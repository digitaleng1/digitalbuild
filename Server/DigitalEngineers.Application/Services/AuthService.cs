using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using DigitalEngineers.Domain.DTOs.Auth;
using DigitalEngineers.Infrastructure.Entities.Identity;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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
    private readonly IUrlProvider _urlProvider;
    private readonly HttpClient _httpClient;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        ApplicationDbContext context,
        IConfiguration configuration,
        IFileStorageService fileStorageService,
        IEmailService emailService,
        IUrlProvider urlProvider,
        IHttpClientFactory httpClientFactory)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _context = context;
        _configuration = configuration;
        _fileStorageService = fileStorageService;
        _emailService = emailService;
        _urlProvider = urlProvider;
        _httpClient = httpClientFactory.CreateClient();
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
            EmailConfirmed = false
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        await _userManager.AddToRoleAsync(user, dto.Role);

        // Create Client record if role is Client
        if (dto.Role == "Client")
        {
            var client = new Client
            {
                UserId = user.Id,
                CompanyName = null,
                Industry = null,
                Website = null,
                CompanyDescription = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Set<Client>().Add(client);
            await _context.SaveChangesAsync(cancellationToken);
        }

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

        // Generate email confirmation token
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = System.Web.HttpUtility.UrlEncode(token);
        var baseUrl = _urlProvider.GetBaseUrl();
        var confirmationUrl = $"{baseUrl}/account/confirm-email?userId={user.Id}&token={encodedToken}";

        // Send account activation email
        await _emailService.SendAccountActivationEmailAsync(
            user.Email!,
            $"{user.FirstName} {user.LastName}",
            confirmationUrl,
            cancellationToken);

        // Return empty TokenData (no auto-login until email confirmed)
        return new TokenData
        {
            AccessToken = string.Empty,
            RefreshToken = string.Empty,
            ExpiresAt = DateTime.UtcNow,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureUrl = null,
                Roles = new[] { dto.Role }
            }
        };
    }

    public async Task<TokenData> LoginAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (!user.EmailConfirmed)
        {
            throw new DigitalEngineers.Domain.Exceptions.EmailNotConfirmedException(email);
        }

        if (!user.IsActive)
        {
            throw new DigitalEngineers.Domain.Exceptions.UserDeactivatedException(email);
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

        if (!user.IsActive)
        {
            throw new DigitalEngineers.Domain.Exceptions.UserDeactivatedException(user.Email ?? userId);
        }

        return await GenerateTokenResponse(user, cancellationToken);
    }

    public async Task<TokenData> ExternalLoginAsync(string provider, string idToken, string? role = null, CancellationToken cancellationToken = default)
    {
        if (provider.Equals("Google", StringComparison.OrdinalIgnoreCase))
        {
            return await HandleGoogleLogin(idToken, cancellationToken);
        }
        else if (provider.Equals("Auth0", StringComparison.OrdinalIgnoreCase))
        {
            return await HandleAuth0Login(idToken, role, cancellationToken);
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

    public async Task<TokenData> ConfirmEmailAsync(string userId, string token, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new DigitalEngineers.Domain.Exceptions.EmailConfirmationFailedException("Invalid confirmation link");
        }

        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (!result.Succeeded)
        {
            throw new DigitalEngineers.Domain.Exceptions.EmailConfirmationFailedException(
                "Email confirmation failed. The token may be expired or invalid.");
        }

        // Send welcome email after successful confirmation
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Client";
        
        await _emailService.SendWelcomeEmailAsync(
            user.Email!,
            $"{user.FirstName} {user.LastName}",
            role,
            cancellationToken);

        // Auto-login: generate JWT tokens
        return await GenerateTokenResponse(user, cancellationToken);
    }

    public async Task<bool> ResendEmailConfirmationAsync(string email, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            // Don't reveal if email exists
            return true;
        }

        if (user.EmailConfirmed)
        {
            // Already confirmed
            return true;
        }

        // Generate new token
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = System.Web.HttpUtility.UrlEncode(token);
        var baseUrl = _urlProvider.GetBaseUrl();
        var confirmationUrl = $"{baseUrl}/account/confirm-email?userId={user.Id}&token={encodedToken}";

        // Send email
        await _emailService.SendAccountActivationEmailAsync(
            user.Email!,
            $"{user.FirstName} {user.LastName}",
            confirmationUrl,
            cancellationToken);

        return true;
    }

    public async Task<bool> InitiatePasswordResetAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException($"User with ID {userId} not found");
        }

        // Generate password reset token
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = System.Web.HttpUtility.UrlEncode(token);
        var baseUrl = _urlProvider.GetBaseUrl();
        var resetUrl = $"{baseUrl}/account/reset-password?userId={user.Id}&token={encodedToken}";

        // Send password reset email
        await _emailService.SendPasswordResetEmailAsync(
            user.Email!,
            $"{user.FirstName} {user.LastName}",
            resetUrl,
            cancellationToken);

        return true;
    }

    public async Task<bool> ForgotPasswordAsync(string email, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            // Don't reveal if email exists (security best practice)
            return true;
        }

        // Generate password reset token
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = System.Web.HttpUtility.UrlEncode(token);
        var baseUrl = _urlProvider.GetBaseUrl();
        var resetUrl = $"{baseUrl}/account/reset-password?userId={user.Id}&token={encodedToken}";

        // Send password reset email
        await _emailService.SendPasswordResetEmailAsync(
            user.Email!,
            $"{user.FirstName} {user.LastName}",
            resetUrl,
            cancellationToken);

        return true;
    }

    public async Task<TokenData> ResetPasswordAsync(string userId, string token, string newPassword, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new DigitalEngineers.Domain.Exceptions.InvalidPasswordResetTokenException();
        }

        // Reset password using token
        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
        if (!result.Succeeded)
        {
            throw new DigitalEngineers.Domain.Exceptions.InvalidPasswordResetTokenException();
        }

        // Invalidate all refresh tokens
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _userManager.UpdateAsync(user);

        // Send password changed notification
        await _emailService.SendPasswordChangedNotificationAsync(
            user.Email!,
            $"{user.FirstName} {user.LastName}",
            cancellationToken);

        // Auto-login: generate new JWT tokens
        return await GenerateTokenResponse(user, cancellationToken);
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
            else if (!user.IsActive)
            {
                throw new DigitalEngineers.Domain.Exceptions.UserDeactivatedException(payload.Email);
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            return await GenerateTokenResponse(user, cancellationToken);
        }
        catch (DigitalEngineers.Domain.Exceptions.UserDeactivatedException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new UnauthorizedAccessException($"Google authentication failed: {ex.Message}");
        }
    }

    private async Task<TokenData> HandleAuth0Login(string idToken, string? role, CancellationToken cancellationToken)
    {
        try
        {
            var domain = _configuration["Authentication:Auth0:Domain"]
                ?? throw new InvalidOperationException("Auth0 Domain not configured");
            var clientId = _configuration["Authentication:Auth0:ClientId"]
                ?? throw new InvalidOperationException("Auth0 ClientId not configured");

            var jwksUrl = $"https://{domain}/.well-known/jwks.json";
            var jwksJson = await _httpClient.GetStringAsync(jwksUrl, cancellationToken);
            var jwks = new JsonWebKeySet(jwksJson);

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = $"https://{domain}/",
                ValidateAudience = true,
                ValidAudience = clientId,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = jwks.GetSigningKeys()
            };

            var principal = tokenHandler.ValidateToken(idToken, validationParameters, out _);

            var email = principal.FindFirst(ClaimTypes.Email)?.Value
                     ?? principal.FindFirst("email")?.Value;
            
            if (string.IsNullOrEmpty(email))
            {
                throw new UnauthorizedAccessException("Email claim not found in Auth0 token");
            }

            var firstName = principal.FindFirst(ClaimTypes.GivenName)?.Value
                         ?? principal.FindFirst("given_name")?.Value;
            var lastName = principal.FindFirst(ClaimTypes.Surname)?.Value
                        ?? principal.FindFirst("family_name")?.Value;
            var auth0Id = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? principal.FindFirst("sub")?.Value;

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                // Validate and determine effective role (default to Client for backwards compatibility)
                var effectiveRole = role ?? "Client";
                if (effectiveRole != "Client" && effectiveRole != "Provider")
                {
                    effectiveRole = "Client";
                }

                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                await _userManager.AddToRoleAsync(user, effectiveRole);

                // Create appropriate entity based on role
                if (effectiveRole == "Client")
                {
                    var client = new Client
                    {
                        UserId = user.Id,
                        CompanyName = null,
                        Industry = null,
                        Website = null,
                        CompanyDescription = null,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.Set<Client>().Add(client);
                }
                else if (effectiveRole == "Provider")
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
                }

                await _context.SaveChangesAsync(cancellationToken);
            }
            else if (!user.IsActive)
            {
                throw new DigitalEngineers.Domain.Exceptions.UserDeactivatedException(email);
            }
            // Note: For existing users, the role parameter is ignored (security)

            user.LastLoginAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            return await GenerateTokenResponse(user, cancellationToken);
        }
        catch (DigitalEngineers.Domain.Exceptions.UserDeactivatedException)
        {
            throw;
        }
        catch (SecurityTokenException ex)
        {
            throw new UnauthorizedAccessException($"Auth0 token validation failed: {ex.Message}");
        }
        catch (Exception ex) when (ex is not UnauthorizedAccessException)
        {
            throw new UnauthorizedAccessException($"Auth0 authentication failed: {ex.Message}");
        }
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
