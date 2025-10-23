using DigitalEngineers.Domain.DTOs.Auth;

namespace DigitalEngineers.Domain.Interfaces;

public interface IAuthService
{
    Task<TokenData> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default);
    Task<TokenData> LoginAsync(string email, string password, CancellationToken cancellationToken = default);
    Task<TokenData> RefreshTokenAsync(string accessToken, string refreshToken, CancellationToken cancellationToken = default);
    Task<TokenData> ExternalLoginAsync(string provider, string idToken, CancellationToken cancellationToken = default);
    Task<bool> RevokeTokenAsync(string userId, CancellationToken cancellationToken = default);
}
