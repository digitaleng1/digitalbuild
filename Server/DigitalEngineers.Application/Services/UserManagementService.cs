using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DigitalEngineers.Application.Services;

public class UserManagementService : IUserManagementService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailService _emailService;
    private readonly IFileStorageService _fileStorageService;

    public UserManagementService(
        ApplicationDbContext context, 
        UserManager<ApplicationUser> userManager,
        IEmailService emailService,
        IFileStorageService fileStorageService)
    {
        _context = context;
        _userManager = userManager;
        _emailService = emailService;
        _fileStorageService = fileStorageService;
    }

    public async Task<IEnumerable<UserManagementDto>> GetUsersByRoleAsync(string role, CancellationToken cancellationToken = default)
    {
        var usersInRole = await _userManager.GetUsersInRoleAsync(role);

        var userDtos = new List<UserManagementDto>();

        foreach (var user in usersInRole)
        {
            var roles = await _userManager.GetRolesAsync(user);
            
            string? licenseStatus = null;
            if (role == "Provider")
            {
                var specialist = await _context.Specialists
                    .Include(s => s.LicenseTypes)
                    .FirstOrDefaultAsync(s => s.UserId == user.Id, cancellationToken);

                if (specialist != null && specialist.LicenseTypes.Any())
                {
                    var hasApproved = specialist.LicenseTypes.Any(lt => lt.Status == LicenseRequestStatus.Approved);
                    var hasPending = specialist.LicenseTypes.Any(lt => lt.Status == LicenseRequestStatus.Pending);
                    
                    if (hasApproved)
                        licenseStatus = "Active";
                    else if (hasPending)
                        licenseStatus = "Pending";
                    else
                        licenseStatus = "None";
                }
                else
                {
                    licenseStatus = "None";
                }
            }

            string? profilePictureUrl = null;
            if (!string.IsNullOrWhiteSpace(user.ProfilePictureUrl))
            {
                profilePictureUrl = _fileStorageService.GetPresignedUrl(user.ProfilePictureUrl);
            }
            
            userDtos.Add(new UserManagementDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureUrl = profilePictureUrl,
                Roles = roles,
                IsActive = user.IsActive,
                LastActive = user.LastActive,
                CreatedAt = user.CreatedAt,
                LicenseStatus = licenseStatus
            });
        }

        return userDtos.OrderByDescending(u => u.CreatedAt);
    }

    public async Task<bool> ToggleUserStatusAsync(string userId, bool isActive, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return false;

        user.IsActive = isActive;
        user.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<UserManagementDto> CreateAdminAsync(CreateAdminDto dto, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            EmailConfirmed = true,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create admin: {errors}");
        }

        await _userManager.AddToRoleAsync(user, UserRoles.Admin);

        await _emailService.SendAdminWelcomeEmailAsync(
            dto.Email,
            $"{dto.FirstName} {dto.LastName}",
            dto.Email,
            dto.Password,
            cancellationToken);

        var roles = await _userManager.GetRolesAsync(user);

        return new UserManagementDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            ProfilePictureUrl = null,
            Roles = roles,
            IsActive = user.IsActive,
            LastActive = user.LastActive,
            CreatedAt = user.CreatedAt,
            LicenseStatus = null
        };
    }

    public async Task<UserManagementDto> CreateClientAsync(CreateClientDto dto, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        
        try
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                EmailConfirmed = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create client user: {errors}");
            }

            await _userManager.AddToRoleAsync(user, UserRoles.Client);

            var client = new Infrastructure.Entities.Client
            {
                UserId = user.Id,
                CompanyName = dto.CompanyName,
                Industry = dto.Industry,
                Website = dto.Website,
                CompanyDescription = dto.CompanyDescription,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            await _emailService.SendClientWelcomeEmailAsync(
                dto.Email,
                $"{dto.FirstName} {dto.LastName}",
                dto.Email,
                dto.Password,
                cancellationToken);

            var roles = await _userManager.GetRolesAsync(user);

            return new UserManagementDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureUrl = null,
                Roles = roles,
                IsActive = user.IsActive,
                LastActive = user.LastActive,
                CreatedAt = user.CreatedAt,
                LicenseStatus = null
            };
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public async Task<UserManagementDto> CreateSpecialistAsync(CreateSpecialistByAdminDto dto, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        if (dto.ProfessionTypeIds.Length == 0)
        {
            throw new ArgumentException("At least one profession type must be selected", nameof(dto.ProfessionTypeIds));
        }

        var professionTypes = await _context.ProfessionTypes
            .Where(pt => dto.ProfessionTypeIds.Contains(pt.Id))
            .Include(pt => pt.LicenseRequirements)
            .ToListAsync(cancellationToken);

        if (professionTypes.Count != dto.ProfessionTypeIds.Length)
        {
            throw new ArgumentException("One or more profession types not found", nameof(dto.ProfessionTypeIds));
        }

        await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        
        try
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                EmailConfirmed = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create specialist user: {errors}");
            }

            await _userManager.AddToRoleAsync(user, UserRoles.Provider);

            var specialist = new Infrastructure.Entities.Specialist
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

            var licenseTypesToAdd = new Dictionary<int, int>();
            foreach (var professionType in professionTypes)
            {
                foreach (var requirement in professionType.LicenseRequirements)
                {
                    licenseTypesToAdd[requirement.LicenseTypeId] = professionType.Id;
                }
            }

            foreach (var kvp in licenseTypesToAdd)
            {
                var specialistLicense = new Infrastructure.Entities.SpecialistLicenseType
                {
                    SpecialistId = specialist.Id,
                    LicenseTypeId = kvp.Key,
                    ProfessionTypeId = kvp.Value,
                    Status = LicenseRequestStatus.Pending
                };
                _context.Set<Infrastructure.Entities.SpecialistLicenseType>().Add(specialistLicense);
            }

            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            var professionTypeNames = string.Join(", ", professionTypes.Select(pt => pt.Name));

            await _emailService.SendSpecialistWelcomeEmailAsync(
                dto.Email,
                $"{dto.FirstName} {dto.LastName}",
                dto.Email,
                dto.Password,
                professionTypeNames,
                cancellationToken);

            var roles = await _userManager.GetRolesAsync(user);

            return new UserManagementDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureUrl = null,
                Roles = roles,
                IsActive = user.IsActive,
                LastActive = user.LastActive,
                CreatedAt = user.CreatedAt,
                LicenseStatus = "Pending"
            };
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
