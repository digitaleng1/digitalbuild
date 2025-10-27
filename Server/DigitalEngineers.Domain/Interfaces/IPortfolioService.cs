using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface IPortfolioService
{
    Task<PortfolioItemDto> CreatePortfolioItemAsync(int specialistId, CreatePortfolioItemDto dto, Stream? thumbnailStream = null, string? fileName = null, string? contentType = null, CancellationToken cancellationToken = default);
    Task<PortfolioItemDto?> GetPortfolioItemByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<PortfolioItemDto>> GetPortfolioItemsBySpecialistIdAsync(int specialistId, CancellationToken cancellationToken = default);
    Task<PortfolioItemDto> UpdatePortfolioItemAsync(int id, CreatePortfolioItemDto dto, CancellationToken cancellationToken = default);
    Task DeletePortfolioItemAsync(int id, CancellationToken cancellationToken = default);
}
