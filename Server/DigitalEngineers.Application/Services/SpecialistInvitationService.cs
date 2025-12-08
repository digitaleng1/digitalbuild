using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.DTOs.Auth;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class SpecialistInvitationService : ISpecialistInvitationService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailService _emailService;
    private readonly ITokenService _tokenService;
    private readonly IUrlProvider _urlProvider;
    private readonly ILogger<SpecialistInvitationService> _logger;

    public SpecialistInvitationService(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        IEmailService emailService,
        ITokenService tokenService,
        IUrlProvider urlProvider,
        ILogger<SpecialistInvitationService> logger)
    {
        _context = context;
        _userManager = userManager;
        _emailService = emailService;
        _tokenService = tokenService;
        _urlProvider = urlProvider;
        _logger = logger;
    }

    public async Task<InviteSpecialistResultDto> InviteSpecialistAsync(
        InviteSpecialistDto dto, 
        string invitedByUserId, 
        CancellationToken cancellationToken = default)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            throw new UserAlreadyExistsException(dto.Email);
        }

        // Validate license type
        var licenseType = await _context.LicenseTypes
            .FindAsync([dto.LicenseTypeId], cancellationToken);
        
        if (licenseType == null)
        {
            _logger.LogWarning("License type with ID {LicenseTypeId} not found", dto.LicenseTypeId);
            throw new ArgumentException($"License type with ID {dto.LicenseTypeId} not found", nameof(dto.LicenseTypeId));
        }

        // Use transaction for atomic operation
        await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        
        try
        {
            var generatedPassword = GenerateSecurePassword();

            // Create user
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createResult = await _userManager.CreateAsync(user, generatedPassword);
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                _logger.LogError("Failed to create user: {Errors}", errors);
                throw new InvalidOperationException($"Failed to create user: {errors}");
            }

            // Assign Provider role
            await _userManager.AddToRoleAsync(user, "Provider");

            // Create specialist profile
            var specialist = new Specialist
            {
                UserId = user.Id,
                YearsOfExperience = 0,
                HourlyRate = null,
                Specialization = null,
                IsAvailable = true,
                Rating = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Specialists.Add(specialist);
            await _context.SaveChangesAsync(cancellationToken);

            // Create specialist license type
            var specialistLicense = new SpecialistLicenseType
            {
                SpecialistId = specialist.Id,
                LicenseTypeId = dto.LicenseTypeId
            };

            _context.Set<SpecialistLicenseType>().Add(specialistLicense);
            await _context.SaveChangesAsync(cancellationToken);

            // Generate invitation token
            var invitationToken = GenerateInvitationToken(user.Id, dto.Email);

            // Create invitation record
            var invitation = new SpecialistInvitation
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                GeneratedPassword = generatedPassword,
                InvitationToken = invitationToken,
                CustomMessage = dto.CustomMessage,
                LicenseTypeId = dto.LicenseTypeId,
                InvitedByUserId = invitedByUserId,
                CreatedSpecialistUserId = user.Id,
                IsUsed = false,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            _context.SpecialistInvitations.Add(invitation);
            await _context.SaveChangesAsync(cancellationToken);

            // Commit transaction
            await transaction.CommitAsync(cancellationToken);

            // Send email (after successful transaction)
            var baseUrl = _urlProvider.GetBaseUrl();
            var invitationUrl = $"{baseUrl}/account/invite/{invitationToken}";

            await _emailService.SendSpecialistInvitationEmailAsync(
                dto.Email,
                $"{dto.FirstName} {dto.LastName}",
                dto.Email,
                generatedPassword,
                invitationUrl,
                licenseType.Name,
                dto.CustomMessage,
                cancellationToken);

            return new InviteSpecialistResultDto
            {
                SpecialistId = specialist.Id,
                SpecialistUserId = user.Id,
                Email = dto.Email,
                FullName = $"{dto.FirstName} {dto.LastName}",
                GeneratedPassword = generatedPassword,
                InvitationToken = invitationToken,
                ExpiresAt = invitation.ExpiresAt
            };
        }
        catch
        {
            // Rollback transaction on any error
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public async Task<ValidateInvitationResultDto> ValidateInvitationTokenAsync(
        string token, 
        CancellationToken cancellationToken = default)
    {
        var invitation = await _context.SpecialistInvitations
            .FirstOrDefaultAsync(i => i.InvitationToken == token, cancellationToken);

        if (invitation == null)
        {
            return new ValidateInvitationResultDto
            {
                IsValid = false,
                ErrorMessage = "Invitation not found"
            };
        }

        if (invitation.IsUsed)
        {
            return new ValidateInvitationResultDto
            {
                IsValid = false,
                ErrorMessage = "Invitation has already been used"
            };
        }

        if (invitation.ExpiresAt < DateTime.UtcNow)
        {
            return new ValidateInvitationResultDto
            {
                IsValid = false,
                ErrorMessage = "Invitation has expired"
            };
        }

        return new ValidateInvitationResultDto
        {
            IsValid = true,
            Email = invitation.Email,
            Token = token
        };
    }

    public async Task<AcceptInvitationResultDto> AcceptInvitationAsync(
        string token, 
        CancellationToken cancellationToken = default)
    {
        var validationResult = await ValidateInvitationTokenAsync(token, cancellationToken);
        
        if (!validationResult.IsValid)
        {
            throw new InvitationNotFoundException(validationResult.ErrorMessage ?? "Invalid invitation");
        }

        var invitation = await _context.SpecialistInvitations
            .Include(i => i.CreatedSpecialistUser)
            .FirstOrDefaultAsync(i => i.InvitationToken == token, cancellationToken);

        if (invitation == null)
        {
            throw new InvitationNotFoundException("Invitation not found");
        }

        invitation.IsUsed = true;
        invitation.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var user = invitation.CreatedSpecialistUser;
        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}".Trim())
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        return new AcceptInvitationResultDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureUrl = user.ProfilePictureUrl,
                Roles = roles
            }
        };
    }

    private static string GenerateSecurePassword()
    {
        const string uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string lowercase = "abcdefghijklmnopqrstuvwxyz";
        const string digits = "0123456789";
        const string special = "!@#$%^&*";
        const string all = uppercase + lowercase + digits + special;

        var password = new char[12];
        
        password[0] = uppercase[RandomNumberGenerator.GetInt32(uppercase.Length)];
        password[1] = lowercase[RandomNumberGenerator.GetInt32(lowercase.Length)];
        password[2] = digits[RandomNumberGenerator.GetInt32(digits.Length)];
        password[3] = special[RandomNumberGenerator.GetInt32(special.Length)];

        for (int i = 4; i < 12; i++)
        {
            password[i] = all[RandomNumberGenerator.GetInt32(all.Length)];
        }

        return new string(password.OrderBy(_ => RandomNumberGenerator.GetInt32(int.MaxValue)).ToArray());
    }

    private static string GenerateInvitationToken(string userId, string email)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var data = $"{userId}|{email}|{timestamp}";
        var bytes = Encoding.UTF8.GetBytes(data);
        return Convert.ToBase64String(bytes);
    }
}
