using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class BidService : IBidService
{
    private readonly ApplicationDbContext _context;
    private readonly ISpecialistService _specialistService;
    private readonly ILogger<BidService> _logger;

    public BidService(
        ApplicationDbContext context,
        ISpecialistService specialistService,
        ILogger<BidService> logger)
    {
        _context = context;
        _specialistService = specialistService;
        _logger = logger;
    }

    public async Task<BidRequestDto> CreateBidRequestAsync(CreateBidRequestDto dto, CancellationToken cancellationToken = default)
    {
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == dto.ProjectId, cancellationToken);
        if (!projectExists)
            throw new ProjectNotFoundException(dto.ProjectId);

        var bidRequest = new BidRequest
        {
            ProjectId = dto.ProjectId,
            Title = dto.Title,
            Description = dto.Description,
            BudgetMin = dto.BudgetMin,
            BudgetMax = dto.BudgetMax,
            Deadline = dto.Deadline,
            Status = BidRequestStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Set<BidRequest>().Add(bidRequest);
        await _context.SaveChangesAsync(cancellationToken);

        var project = await _context.Projects.FindAsync([dto.ProjectId], cancellationToken);

        return new BidRequestDto
        {
            Id = bidRequest.Id,
            ProjectId = bidRequest.ProjectId,
            ProjectName = project!.Name,
            Title = bidRequest.Title,
            Description = bidRequest.Description,
            Status = bidRequest.Status.ToString(),
            BudgetMin = bidRequest.BudgetMin,
            BudgetMax = bidRequest.BudgetMax,
            Deadline = bidRequest.Deadline,
            ResponseCount = 0,
            CreatedAt = bidRequest.CreatedAt,
            UpdatedAt = bidRequest.UpdatedAt
        };
    }

    public async Task<BidRequestDetailsDto> GetBidRequestByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var bidRequest = await _context.Set<BidRequest>()
            .Include(br => br.Project)
            .Include(br => br.Responses)
                .ThenInclude(r => r.Specialist)
                    .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(br => br.Id == id, cancellationToken);

        if (bidRequest == null)
            throw new BidRequestNotFoundException(id);

        return new BidRequestDetailsDto
        {
            Id = bidRequest.Id,
            ProjectId = bidRequest.ProjectId,
            ProjectName = bidRequest.Project.Name,
            Title = bidRequest.Title,
            Description = bidRequest.Description,
            Status = bidRequest.Status.ToString(),
            BudgetMin = bidRequest.BudgetMin,
            BudgetMax = bidRequest.BudgetMax,
            Deadline = bidRequest.Deadline,
            CreatedAt = bidRequest.CreatedAt,
            UpdatedAt = bidRequest.UpdatedAt,
            Responses = bidRequest.Responses.Select(r => new BidResponseDto
            {
                Id = r.Id,
                BidRequestId = r.BidRequestId,
                SpecialistId = r.SpecialistId,
                SpecialistName = $"{r.Specialist.User.FirstName} {r.Specialist.User.LastName}",
                SpecialistProfilePicture = r.Specialist.User.ProfilePictureUrl,
                SpecialistRating = r.Specialist.Rating,
                CoverLetter = r.CoverLetter,
                ProposedPrice = r.ProposedPrice,
                EstimatedDays = r.EstimatedDays,
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            }).ToArray()
        };
    }

    public async Task<IEnumerable<BidRequestDto>> GetBidRequestsByProjectIdAsync(int projectId, CancellationToken cancellationToken = default)
    {
        var bidRequests = await _context.Set<BidRequest>()
            .Include(br => br.Project)
            .Include(br => br.Responses)
            .Where(br => br.ProjectId == projectId)
            .OrderByDescending(br => br.CreatedAt)
            .ToListAsync(cancellationToken);

        return bidRequests.Select(br => new BidRequestDto
        {
            Id = br.Id,
            ProjectId = br.ProjectId,
            ProjectName = br.Project.Name,
            Title = br.Title,
            Description = br.Description,
            Status = br.Status.ToString(),
            BudgetMin = br.BudgetMin,
            BudgetMax = br.BudgetMax,
            Deadline = br.Deadline,
            ResponseCount = br.Responses.Count,
            CreatedAt = br.CreatedAt,
            UpdatedAt = br.UpdatedAt
        });
    }

    public async Task<BidRequestDto> UpdateBidRequestAsync(int id, UpdateBidRequestDto dto, CancellationToken cancellationToken = default)
    {
        var bidRequest = await _context.Set<BidRequest>()
            .Include(br => br.Project)
            .Include(br => br.Responses)
            .FirstOrDefaultAsync(br => br.Id == id, cancellationToken);

        if (bidRequest == null)
            throw new BidRequestNotFoundException(id);

        if (dto.Title != null)
            bidRequest.Title = dto.Title;

        if (dto.Description != null)
            bidRequest.Description = dto.Description;

        if (dto.BudgetMin.HasValue)
            bidRequest.BudgetMin = dto.BudgetMin.Value;

        if (dto.BudgetMax.HasValue)
            bidRequest.BudgetMax = dto.BudgetMax.Value;

        if (dto.Deadline.HasValue)
            bidRequest.Deadline = dto.Deadline.Value;

        if (dto.Status.HasValue)
            bidRequest.Status = dto.Status.Value;

        bidRequest.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new BidRequestDto
        {
            Id = bidRequest.Id,
            ProjectId = bidRequest.ProjectId,
            ProjectName = bidRequest.Project.Name,
            Title = bidRequest.Title,
            Description = bidRequest.Description,
            Status = bidRequest.Status.ToString(),
            BudgetMin = bidRequest.BudgetMin,
            BudgetMax = bidRequest.BudgetMax,
            Deadline = bidRequest.Deadline,
            ResponseCount = bidRequest.Responses.Count,
            CreatedAt = bidRequest.CreatedAt,
            UpdatedAt = bidRequest.UpdatedAt
        };
    }

    public async Task<BidRequestDto> UpdateBidRequestStatusAsync(int id, BidRequestStatus status, CancellationToken cancellationToken = default)
    {
        var bidRequest = await _context.Set<BidRequest>()
            .Include(br => br.Project)
            .Include(br => br.Responses)
            .FirstOrDefaultAsync(br => br.Id == id, cancellationToken);

        if (bidRequest == null)
            throw new BidRequestNotFoundException(id);

        bidRequest.Status = status;
        bidRequest.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new BidRequestDto
        {
            Id = bidRequest.Id,
            ProjectId = bidRequest.ProjectId,
            ProjectName = bidRequest.Project.Name,
            Title = bidRequest.Title,
            Description = bidRequest.Description,
            Status = bidRequest.Status.ToString(),
            BudgetMin = bidRequest.BudgetMin,
            BudgetMax = bidRequest.BudgetMax,
            Deadline = bidRequest.Deadline,
            ResponseCount = bidRequest.Responses.Count,
            CreatedAt = bidRequest.CreatedAt,
            UpdatedAt = bidRequest.UpdatedAt
        };
    }

    public async Task DeleteBidRequestAsync(int id, CancellationToken cancellationToken = default)
    {
        var bidRequest = await _context.Set<BidRequest>().FindAsync([id], cancellationToken);

        if (bidRequest == null)
            throw new BidRequestNotFoundException(id);

        _context.Set<BidRequest>().Remove(bidRequest);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<BidResponseDto> CreateBidResponseAsync(CreateBidResponseDto dto, CancellationToken cancellationToken = default)
    {
        var bidRequest = await _context.Set<BidRequest>()
            .FirstOrDefaultAsync(br => br.Id == dto.BidRequestId, cancellationToken);

        if (bidRequest == null)
            throw new BidRequestNotFoundException(dto.BidRequestId);

        if (bidRequest.Status != BidRequestStatus.Open && bidRequest.Status != BidRequestStatus.Active)
            throw new InvalidBidStatusException(bidRequest.Status, BidRequestStatus.Open);

        var specialistExists = await _context.Set<Specialist>().AnyAsync(s => s.Id == dto.SpecialistId, cancellationToken);
        if (!specialistExists)
            throw new SpecialistNotFoundException(dto.SpecialistId);

        var existingResponse = await _context.Set<BidResponse>()
            .AnyAsync(r => r.BidRequestId == dto.BidRequestId && r.SpecialistId == dto.SpecialistId, cancellationToken);

        if (existingResponse)
        {
            _logger.LogWarning("Specialist {SpecialistId} already submitted response to bid request {BidRequestId}", 
                dto.SpecialistId, dto.BidRequestId);
            throw new InvalidOperationException($"Specialist {dto.SpecialistId} already submitted response to this bid request");
        }

        var bidResponse = new BidResponse
        {
            BidRequestId = dto.BidRequestId,
            SpecialistId = dto.SpecialistId,
            CoverLetter = dto.CoverLetter,
            ProposedPrice = dto.ProposedPrice,
            EstimatedDays = dto.EstimatedDays,
            Status = BidResponseStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Set<BidResponse>().Add(bidResponse);

        if (bidRequest.Status == BidRequestStatus.Open)
        {
            bidRequest.Status = BidRequestStatus.Active;
            bidRequest.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        var specialist = await _context.Set<Specialist>()
            .Include(s => s.User)
            .FirstAsync(s => s.Id == dto.SpecialistId, cancellationToken);

        return new BidResponseDto
        {
            Id = bidResponse.Id,
            BidRequestId = bidResponse.BidRequestId,
            SpecialistId = bidResponse.SpecialistId,
            SpecialistName = $"{specialist.User.FirstName} {specialist.User.LastName}",
            SpecialistProfilePicture = specialist.User.ProfilePictureUrl,
            SpecialistRating = specialist.Rating,
            CoverLetter = bidResponse.CoverLetter,
            ProposedPrice = bidResponse.ProposedPrice,
            EstimatedDays = bidResponse.EstimatedDays,
            Status = bidResponse.Status.ToString(),
            CreatedAt = bidResponse.CreatedAt,
            UpdatedAt = bidResponse.UpdatedAt
        };
    }

    public async Task<BidResponseDetailsDto> GetBidResponseByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var bidResponse = await _context.Set<BidResponse>()
            .Include(r => r.BidRequest)
            .Include(r => r.Specialist)
                .ThenInclude(s => s.User)
            .Include(r => r.Messages)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (bidResponse == null)
            throw new BidResponseNotFoundException(id);

        return new BidResponseDetailsDto
        {
            Id = bidResponse.Id,
            BidRequestId = bidResponse.BidRequestId,
            BidRequestTitle = bidResponse.BidRequest.Title,
            SpecialistId = bidResponse.SpecialistId,
            SpecialistName = $"{bidResponse.Specialist.User.FirstName} {bidResponse.Specialist.User.LastName}",
            SpecialistProfilePicture = bidResponse.Specialist.User.ProfilePictureUrl,
            SpecialistRating = bidResponse.Specialist.Rating,
            SpecialistYearsOfExperience = bidResponse.Specialist.YearsOfExperience,
            CoverLetter = bidResponse.CoverLetter,
            ProposedPrice = bidResponse.ProposedPrice,
            EstimatedDays = bidResponse.EstimatedDays,
            Status = bidResponse.Status.ToString(),
            RejectionReason = bidResponse.RejectionReason,
            CreatedAt = bidResponse.CreatedAt,
            UpdatedAt = bidResponse.UpdatedAt,
            Messages = bidResponse.Messages.Select(m => new BidMessageDto
            {
                Id = m.Id,
                BidResponseId = m.BidResponseId,
                SenderId = m.SenderId,
                SenderName = string.Empty,
                MessageText = m.MessageText,
                CreatedAt = m.CreatedAt
            }).ToArray()
        };
    }

    public async Task<IEnumerable<BidResponseDto>> GetBidResponsesByRequestIdAsync(int requestId, CancellationToken cancellationToken = default)
    {
        var bidResponses = await _context.Set<BidResponse>()
            .Include(r => r.Specialist)
                .ThenInclude(s => s.User)
            .Where(r => r.BidRequestId == requestId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);

        return bidResponses.Select(r => new BidResponseDto
        {
            Id = r.Id,
            BidRequestId = r.BidRequestId,
            SpecialistId = r.SpecialistId,
            SpecialistName = $"{r.Specialist.User.FirstName} {r.Specialist.User.LastName}",
            SpecialistProfilePicture = r.Specialist.User.ProfilePictureUrl,
            SpecialistRating = r.Specialist.Rating,
            CoverLetter = r.CoverLetter,
            ProposedPrice = r.ProposedPrice,
            EstimatedDays = r.EstimatedDays,
            Status = r.Status.ToString(),
            CreatedAt = r.CreatedAt,
            UpdatedAt = r.UpdatedAt
        });
    }

    public async Task<BidResponseDto> UpdateBidResponseAsync(int id, UpdateBidResponseDto dto, CancellationToken cancellationToken = default)
    {
        var bidResponse = await _context.Set<BidResponse>()
            .Include(r => r.Specialist)
                .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (bidResponse == null)
            throw new BidResponseNotFoundException(id);

        if (bidResponse.Status != BidResponseStatus.Pending)
        {
            _logger.LogWarning("Cannot update bid response {BidResponseId} with status {Status}", id, bidResponse.Status);
            throw new InvalidBidStatusException(bidResponse.Status, BidResponseStatus.Pending);
        }

        if (dto.CoverLetter != null)
            bidResponse.CoverLetter = dto.CoverLetter;

        if (dto.ProposedPrice.HasValue)
            bidResponse.ProposedPrice = dto.ProposedPrice.Value;

        if (dto.EstimatedDays.HasValue)
            bidResponse.EstimatedDays = dto.EstimatedDays.Value;

        bidResponse.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new BidResponseDto
        {
            Id = bidResponse.Id,
            BidRequestId = bidResponse.BidRequestId,
            SpecialistId = bidResponse.SpecialistId,
            SpecialistName = $"{bidResponse.Specialist.User.FirstName} {bidResponse.Specialist.User.LastName}",
            SpecialistProfilePicture = bidResponse.Specialist.User.ProfilePictureUrl,
            SpecialistRating = bidResponse.Specialist.Rating,
            CoverLetter = bidResponse.CoverLetter,
            ProposedPrice = bidResponse.ProposedPrice,
            EstimatedDays = bidResponse.EstimatedDays,
            Status = bidResponse.Status.ToString(),
            CreatedAt = bidResponse.CreatedAt,
            UpdatedAt = bidResponse.UpdatedAt
        };
    }

    public async Task AcceptBidResponseAsync(int id, CancellationToken cancellationToken = default)
    {
        var bidResponse = await _context.Set<BidResponse>()
            .Include(r => r.BidRequest)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (bidResponse == null)
            throw new BidResponseNotFoundException(id);

        if (bidResponse.Status != BidResponseStatus.Pending)
            throw new InvalidBidStatusException(bidResponse.Status, BidResponseStatus.Accepted);

        bidResponse.Status = BidResponseStatus.Accepted;
        bidResponse.UpdatedAt = DateTime.UtcNow;

        bidResponse.BidRequest.Status = BidRequestStatus.Closed;
        bidResponse.BidRequest.UpdatedAt = DateTime.UtcNow;

        await _specialistService.AssignSpecialistToProjectAsync(
            bidResponse.BidRequest.ProjectId,
            bidResponse.SpecialistId,
            "Bid Winner",
            cancellationToken);

        var otherResponses = await _context.Set<BidResponse>()
            .Where(r => r.BidRequestId == bidResponse.BidRequestId && r.Id != id && r.Status == BidResponseStatus.Pending)
            .ToListAsync(cancellationToken);

        foreach (var response in otherResponses)
        {
            response.Status = BidResponseStatus.Rejected;
            response.RejectionReason = "Another specialist was selected";
            response.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RejectBidResponseAsync(int id, string? reason = null, CancellationToken cancellationToken = default)
    {
        var bidResponse = await _context.Set<BidResponse>().FindAsync([id], cancellationToken);

        if (bidResponse == null)
            throw new BidResponseNotFoundException(id);

        if (bidResponse.Status != BidResponseStatus.Pending)
            throw new InvalidBidStatusException(bidResponse.Status, BidResponseStatus.Rejected);

        bidResponse.Status = BidResponseStatus.Rejected;
        bidResponse.RejectionReason = reason;
        bidResponse.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<BidMessageDto> CreateMessageAsync(CreateBidMessageDto dto, CancellationToken cancellationToken = default)
    {
        var bidResponseExists = await _context.Set<BidResponse>().AnyAsync(r => r.Id == dto.BidResponseId, cancellationToken);
        if (!bidResponseExists)
            throw new BidResponseNotFoundException(dto.BidResponseId);

        var message = new BidMessage
        {
            BidResponseId = dto.BidResponseId,
            SenderId = dto.SenderId,
            MessageText = dto.MessageText,
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<BidMessage>().Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        var user = await _context.Users.FindAsync(dto.SenderId);

        return new BidMessageDto
        {
            Id = message.Id,
            BidResponseId = message.BidResponseId,
            SenderId = message.SenderId,
            SenderName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown",
            MessageText = message.MessageText,
            CreatedAt = message.CreatedAt
        };
    }

    public async Task<IEnumerable<BidMessageDto>> GetMessagesByBidResponseIdAsync(int responseId, CancellationToken cancellationToken = default)
    {
        var messages = await _context.Set<BidMessage>()
            .Where(m => m.BidResponseId == responseId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync(cancellationToken);

        var senderIds = messages.Select(m => m.SenderId).Distinct().ToList();
        var users = await _context.Users
            .Where(u => senderIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => $"{u.FirstName} {u.LastName}", cancellationToken);

        return messages.Select(m => new BidMessageDto
        {
            Id = m.Id,
            BidResponseId = m.BidResponseId,
            SenderId = m.SenderId,
            SenderName = users.GetValueOrDefault(m.SenderId, "Unknown"),
            MessageText = m.MessageText,
            CreatedAt = m.CreatedAt
        });
    }

    public async Task DeleteMessageAsync(int id, CancellationToken cancellationToken = default)
    {
        var message = await _context.Set<BidMessage>().FindAsync([id], cancellationToken);

        if (message == null)
            throw new ArgumentException($"Message with ID {id} not found");

        _context.Set<BidMessage>().Remove(message);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
