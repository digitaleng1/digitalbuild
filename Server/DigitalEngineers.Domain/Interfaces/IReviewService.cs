using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface IReviewService
{
    Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, string clientId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ReviewDto>> GetReviewsBySpecialistIdAsync(int specialistId, CancellationToken cancellationToken = default);
    Task<double> GetAverageRatingAsync(int specialistId, CancellationToken cancellationToken = default);
    Task<ReviewDto> UpdateReviewAsync(int id, CreateReviewDto dto, string clientId, CancellationToken cancellationToken = default);
    Task DeleteReviewAsync(int id, string clientId, CancellationToken cancellationToken = default);
}
