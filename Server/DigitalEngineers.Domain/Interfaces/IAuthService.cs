using DigitalEngineers.Domain.DTOs.Auth;

namespace DigitalEngineers.Domain.Interfaces;

public interface IAuthService
{
    Task<TokenData> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default);
    Task<TokenData> LoginAsync(string email, string password, CancellationToken cancellationToken = default);
    Task<TokenData> RefreshTokenAsync(string accessToken, string refreshToken, CancellationToken cancellationToken = default);
    Task<TokenData> ExternalLoginAsync(string provider, string idToken, CancellationToken cancellationToken = default);
    Task<bool> RevokeTokenAsync(string userId, CancellationToken cancellationToken = default);
    Task<UserDto> GetUserByIdAsync(string userId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Confirms email and performs auto-login
    /// </summary>
    /// <returns>TokenData with JWT tokens for automatic login</returns>
    Task<TokenData> ConfirmEmailAsync(string userId, string token, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Resends email confirmation
    /// </summary>
    Task<bool> ResendEmailConfirmationAsync(string email, CancellationToken cancellationToken = default);
}
