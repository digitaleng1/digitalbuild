using DigitalEngineers.Domain.DTOs;
using System.IO;

namespace DigitalEngineers.Domain.Interfaces;

public interface IClientService
{
    Task<ClientProfileDto> GetClientProfileAsync(int clientId, CancellationToken cancellationToken = default);
    Task<ClientProfileDto> GetCurrentClientProfileAsync(string userId, CancellationToken cancellationToken = default);
    Task<ClientProfileDto> UpdateClientProfileAsync(int clientId, UpdateClientProfileDto dto, CancellationToken cancellationToken = default);
    Task<string> UploadProfilePictureAsync(int clientId, Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get list of clients for selection (Admin only)
    /// </summary>
    /// <param name="search">Search term for filtering by name, email, or company</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of clients matching search criteria</returns>
    Task<List<ClientListDto>> GetClientListAsync(string? search = null, CancellationToken cancellationToken = default);
}
