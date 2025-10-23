using System.Security.Claims;

namespace DigitalEngineers.Domain.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(IEnumerable<Claim> claims);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
