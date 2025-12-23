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
    Task AcceptBidResponseAsync(int id, decimal adminMarkupPercentage, string? adminComment, string acceptedByUserId, CancellationToken cancellationToken = default);
    Task RejectBidResponseAsync(int id, string? reason = null, CancellationToken cancellationToken = default);

    Task<BidMessageDto> CreateMessageAsync(CreateBidMessageDto dto, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidMessageDto>> GetMessagesByBidRequestIdAsync(int requestId, CancellationToken cancellationToken = default);
    Task DeleteMessageAsync(int id, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<int>> SendBidRequestAsync(SendBidRequestDto dto, string clientId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidRequestDto>> GetBidRequestsBySpecialistIdAsync(int specialistId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidRequestDto>> GetBidRequestsBySpecialistIdAndStatusAsync(int specialistId, BidRequestStatus? status, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<ProjectBidStatisticsDto>> GetProjectBidStatisticsAsync(string? clientId = null, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<BidResponseByProjectDto>> GetBidResponsesByProjectIdAsync(int projectId, CancellationToken cancellationToken = default);
    
    Task<BidRequestAttachmentDto> UploadBidRequestAttachmentAsync(int bidRequestId, Stream fileStream, string fileName, string contentType, string userId, string? description, CancellationToken cancellationToken = default);
    Task DeleteBidRequestAttachmentAsync(int attachmentId, string userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidRequestAttachmentDto>> GetBidRequestAttachmentsAsync(int bidRequestId, CancellationToken cancellationToken = default);
}
