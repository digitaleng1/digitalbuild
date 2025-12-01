using System.Security.Claims;
using DigitalEngineers.Domain.DTOs.Auth;
using DigitalEngineers.Infrastructure.Entities.Identity;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using DigitalEngineers.Infrastructure.Entities;

namespace DigitalEngineers.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IFileStorageService _fileStorageService;
    private readonly IEmailService _emailService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        ApplicationDbContext context,
        IConfiguration configuration,
        IFileStorageService fileStorageService,
        IEmailService emailService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _context = context;
        _configuration = configuration;
        _fileStorageService = fileStorageService;
        _emailService = emailService;
    }

    public async Task<TokenData> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.Password != dto.ConfirmPassword)
        {
            throw new ArgumentException("Passwords do not match");
        }

        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        if (dto.Role != "Client" && dto.Role != "Provider")
        {
            throw new ArgumentException("Invalid role. Must be Client or Provider");
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        await _userManager.AddToRoleAsync(user, dto.Role);

        // Create Specialist record if role is Provider
        if (dto.Role == "Provider")
        {
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

            _context.Set<Specialist>().Add(specialist);
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Send welcome email
        await _emailService.SendWelcomeEmailAsync(
            user.Email!,
            $"{user.FirstName} {user.LastName}",
            dto.Role,
            cancellationToken);

        return await GenerateTokenResponse(user, cancellationToken);
    }

    public async Task<TokenData> LoginAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
        if (!result.Succeeded)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        return await GenerateTokenResponse(user, cancellationToken);
    }

    public async Task<TokenData> RefreshTokenAsync(string accessToken, string refreshToken, CancellationToken cancellationToken = default)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
        if (principal == null)
        {
            throw new UnauthorizedAccessException("Invalid access token");
        }

        var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("Invalid token claims");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || user.RefreshToken != refreshToken || 
            user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        return await GenerateTokenResponse(user, cancellationToken);
    }

    public async Task<TokenData> ExternalLoginAsync(string provider, string idToken, CancellationToken cancellationToken = default)
    {
        if (provider.Equals("Google", StringComparison.OrdinalIgnoreCase))
        {
            return await HandleGoogleLogin(idToken, cancellationToken);
        }
        else if (provider.Equals("Auth0", StringComparison.OrdinalIgnoreCase))
        {
            return await HandleAuth0Login(idToken, cancellationToken);
        }

        throw new NotSupportedException($"Provider {provider} is not supported");
    }

    public async Task<bool> RevokeTokenAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _userManager.UpdateAsync(user);

        return true;
    }

    public async Task<UserDto> GetUserByIdAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException($"User with ID {userId} not found");
        }

        var roles = await _userManager.GetRolesAsync(user);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            ProfilePictureUrl = user.ProfilePictureUrl,
            Roles = roles
        };
    }

    private async Task<TokenData> HandleGoogleLogin(string idToken, CancellationToken cancellationToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _configuration["Authentication:Google:ClientId"] ?? throw new InvalidOperationException("Google ClientId not configured") }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            
            var user = await _userManager.FindByEmailAsync(payload.Email);
            
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                await _userManager.AddToRoleAsync(user, "Client");
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            return await GenerateTokenResponse(user, cancellationToken);
        }
        catch (Exception ex)
        {
            throw new UnauthorizedAccessException($"Google authentication failed: {ex.Message}");
        }
    }

    private async Task<TokenData> HandleAuth0Login(string idToken, CancellationToken cancellationToken)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(idToken);
        if (principal == null)
        {
            throw new UnauthorizedAccessException("Invalid Auth0 token");
        }

        var email = principal.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email))
        {
            throw new UnauthorizedAccessException("Email claim not found in token");
        }

        var user = await _userManager.FindByEmailAsync(email);
        
        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FirstName = principal.FindFirst(ClaimTypes.GivenName)?.Value,
                LastName = principal.FindFirst(ClaimTypes.Surname)?.Value,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            await _userManager.AddToRoleAsync(user, "Client");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        return await GenerateTokenResponse(user, cancellationToken);
    }

    private async Task<TokenData> GenerateTokenResponse(ApplicationUser user, CancellationToken cancellationToken)
    {
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
        await _userManager.UpdateAsync(user);

        var expiresAt = DateTime.UtcNow.AddMinutes(
            Convert.ToDouble(_configuration["Jwt:ExpiryInMinutes"] ?? "60"));

        return new TokenData
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureUrl = !string.IsNullOrWhiteSpace(user.ProfilePictureUrl)
                    ? _fileStorageService.GetPresignedUrl(user.ProfilePictureUrl)
                    : null,
                Roles = roles
            }
        };
    }
}
