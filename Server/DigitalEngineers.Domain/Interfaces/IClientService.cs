using DigitalEngineers.Domain.DTOs;
using System.IO;

namespace DigitalEngineers.Domain.Interfaces;

public interface IClientService
{
    Task<ClientProfileDto> GetClientProfileAsync(int clientId, CancellationToken cancellationToken = default);
    Task<ClientProfileDto> GetCurrentClientProfileAsync(string userId, CancellationToken cancellationToken = default);
    Task<ClientProfileDto> UpdateClientProfileAsync(int clientId, UpdateClientProfileDto dto, CancellationToken cancellationToken = default);
    Task<string> UploadProfilePictureAsync(int clientId, Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
}
