using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.Interfaces;

public interface IBidService
{
    Task<BidRequestDto> CreateBidRequestAsync(CreateBidRequestDto dto, CancellationToken cancellationToken = default);
    Task<BidRequestDetailsDto?> GetBidRequestByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidRequestDto>> GetBidRequestsByProjectIdAsync(int projectId, CancellationToken cancellationToken = default);
    Task<BidRequestDto> UpdateBidRequestAsync(int id, UpdateBidRequestDto dto, CancellationToken cancellationToken = default);
    Task<BidRequestDto> UpdateBidRequestStatusAsync(int id, BidRequestStatus status, CancellationToken cancellationToken = default);
    Task DeleteBidRequestAsync(int id, CancellationToken cancellationToken = default);

    Task<BidResponseDto> CreateBidResponseAsync(CreateBidResponseDto dto, CancellationToken cancellationToken = default);
    Task<BidResponseDetailsDto?> GetBidResponseByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidResponseDto>> GetBidResponsesByRequestIdAsync(int requestId, CancellationToken cancellationToken = default);
    Task<BidResponseDto> UpdateBidResponseAsync(int id, UpdateBidResponseDto dto, CancellationToken cancellationToken = default);
    Task AcceptBidResponseAsync(int id, CancellationToken cancellationToken = default);
    Task RejectBidResponseAsync(int id, string? reason = null, CancellationToken cancellationToken = default);

    Task<BidMessageDto> CreateMessageAsync(CreateBidMessageDto dto, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidMessageDto>> GetMessagesByBidResponseIdAsync(int responseId, CancellationToken cancellationToken = default);
    Task DeleteMessageAsync(int id, CancellationToken cancellationToken = default);
    
    Task SendBidRequestAsync(SendBidRequestDto dto, string clientId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidRequestDto>> GetBidRequestsBySpecialistIdAsync(int specialistId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidRequestDto>> GetBidRequestsBySpecialistIdAndStatusAsync(int specialistId, BidRequestStatus? status, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<ProjectBidStatisticsDto>> GetProjectBidStatisticsAsync(CancellationToken cancellationToken = default);
    
    Task<IEnumerable<BidResponseByProjectDto>> GetBidResponsesByProjectIdAsync(int projectId, CancellationToken cancellationToken = default);
}
