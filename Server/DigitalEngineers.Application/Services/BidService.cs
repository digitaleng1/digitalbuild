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
    private readonly IEmailService _emailService;
    private readonly ILogger<BidService> _logger;
    private readonly IFileStorageService _fileStorageService;

    public BidService(
        ApplicationDbContext context,
        ISpecialistService specialistService,
        IEmailService emailService,
        ILogger<BidService> logger,
        IFileStorageService fileStorageService)
    {
        _context = context;
        _specialistService = specialistService;
        _emailService = emailService;
        _logger = logger;
        _fileStorageService = fileStorageService;
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
            ProposedBudget = dto.ProposedBudget,
            Deadline = dto.Deadline,
            Status = BidRequestStatus.Pending,
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
            ProposedBudget = bidRequest.ProposedBudget,
            Deadline = bidRequest.Deadline,
            HasResponse = false,
            CreatedAt = bidRequest.CreatedAt,
            UpdatedAt = bidRequest.UpdatedAt
        };
    }

    public async Task<BidRequestDetailsDto> GetBidRequestByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var bidRequest = await _context.Set<BidRequest>()
            .Include(br => br.Project)
            .Include(br => br.Response)
                .ThenInclude(r => r!.Specialist)
                    .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(br => br.Id == id, cancellationToken);

        if (bidRequest == null)
            throw new BidRequestNotFoundException(id);

        string clientName;
        string clientEmail;

        if (bidRequest.Project.ManagementType == ProjectManagementType.ClientManaged)
        {
            var client = await _context.Users.FindAsync(bidRequest.Project.ClientId);
            clientName = client != null ? $"{client.FirstName} {client.LastName}" : "Unknown";
            clientEmail = client?.Email ?? string.Empty;
        }
        else
        {
            clientName = "DigitalEngineers Platform";
            clientEmail = string.Empty;
        }

        BidResponseDto? responseDto = null;
        if (bidRequest.Response != null)
        {
            var response = bidRequest.Response;
            responseDto = new BidResponseDto
            {
                Id = response.Id,
                BidRequestId = response.BidRequestId,
                SpecialistId = response.SpecialistId,
                SpecialistName = $"{response.Specialist.User.FirstName} {response.Specialist.User.LastName}",
                SpecialistProfilePicture = response.Specialist.User.ProfilePictureUrl,
                SpecialistRating = response.Specialist.Rating,
                CoverLetter = response.CoverLetter,
                ProposedPrice = response.ProposedPrice,
                EstimatedDays = response.EstimatedDays,
                CreatedAt = response.CreatedAt,
                UpdatedAt = response.UpdatedAt
            };
        }

        string? projectThumbnailPresignedUrl = null;
        if (!string.IsNullOrEmpty(bidRequest.Project.ThumbnailUrl))
        {
            projectThumbnailPresignedUrl = _fileStorageService.GetPresignedUrl(bidRequest.Project.ThumbnailUrl);
        }

        return new BidRequestDetailsDto
        {
            Id = bidRequest.Id,
            ProjectId = bidRequest.ProjectId,
            ProjectName = bidRequest.Project.Name,
            ProjectDescription = bidRequest.Project.Description,
            ProjectThumbnailUrl = projectThumbnailPresignedUrl,
            Title = bidRequest.Title,
            Description = bidRequest.Description,
            Status = bidRequest.Status.ToString(),
            ProposedBudget = bidRequest.ProposedBudget,
            Deadline = bidRequest.Deadline,
            HasResponse = bidRequest.Response != null,
            CreatedAt = bidRequest.CreatedAt,
            UpdatedAt = bidRequest.UpdatedAt,
            ClientName = clientName,
            ClientEmail = clientEmail,
            Response = responseDto
        };
    }

    public async Task<IEnumerable<BidRequestDto>> GetBidRequestsByProjectIdAsync(int projectId, CancellationToken cancellationToken = default)
    {
        var bidRequests = await _context.Set<BidRequest>()
            .Include(br => br.Project)
            .Include(br => br.Response)
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
            ProposedBudget = br.ProposedBudget,
            Deadline = br.Deadline,
            HasResponse = br.Response != null,
            CreatedAt = br.CreatedAt,
            UpdatedAt = br.UpdatedAt
        });
    }

    public async Task<BidRequestDto> UpdateBidRequestAsync(int id, UpdateBidRequestDto dto, CancellationToken cancellationToken = default)
    {
        var bidRequest = await _context.Set<BidRequest>()
            .Include(br => br.Project)
            .Include(br => br.Response)
            .FirstOrDefaultAsync(br => br.Id == id, cancellationToken);

        if (bidRequest == null)
            throw new BidRequestNotFoundException(id);

        if (dto.Title != null)
            bidRequest.Title = dto.Title;

        if (dto.Description != null)
            bidRequest.Description = dto.Description;

        if (dto.ProposedBudget.HasValue)
            bidRequest.ProposedBudget = dto.ProposedBudget.Value;

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
            ProposedBudget = bidRequest.ProposedBudget,
            Deadline = bidRequest.Deadline,
            HasResponse = bidRequest.Response != null,
            CreatedAt = bidRequest.CreatedAt,
            UpdatedAt = bidRequest.UpdatedAt
        };
    }

    public async Task<BidRequestDto> UpdateBidRequestStatusAsync(int id, BidRequestStatus status, CancellationToken cancellationToken = default)
    {
        var bidRequest = await _context.Set<BidRequest>()
            .Include(br => br.Project)
            .Include(br => br.Response)
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
            ProposedBudget = bidRequest.ProposedBudget,
            Deadline = bidRequest.Deadline,
            HasResponse = bidRequest.Response != null,
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

        if (bidRequest.Status != BidRequestStatus.Pending && bidRequest.Status != BidRequestStatus.Responded)
            throw new InvalidBidStatusException(bidRequest.Status, BidRequestStatus.Pending);

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
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Set<BidResponse>().Add(bidResponse);

        if (bidRequest.Status == BidRequestStatus.Pending)
        {
            bidRequest.Status = BidRequestStatus.Responded;
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
            Status = bidResponse.BidRequest.Status.ToString(),
            RejectionReason = bidResponse.RejectionReason,
            CreatedAt = bidResponse.CreatedAt,
            UpdatedAt = bidResponse.UpdatedAt,
            Messages = []
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
            CreatedAt = r.CreatedAt,
            UpdatedAt = r.UpdatedAt
        });
    }

    public async Task<BidResponseDto> UpdateBidResponseAsync(int id, UpdateBidResponseDto dto, CancellationToken cancellationToken = default)
    {
        var bidResponse = await _context.Set<BidResponse>()
            .Include(r => r.Specialist)
                .ThenInclude(s => s.User)
            .Include(r => r.BidRequest)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (bidResponse == null)
            throw new BidResponseNotFoundException(id);

        if (bidResponse.BidRequest.Status != BidRequestStatus.Pending && bidResponse.BidRequest.Status != BidRequestStatus.Responded)
        {
            _logger.LogWarning("Cannot update bid response {BidResponseId} with bid request status {Status}", 
                id, bidResponse.BidRequest.Status);
            throw new InvalidBidStatusException(bidResponse.BidRequest.Status, BidRequestStatus.Pending);
        }

        if (dto.CoverLetter != null)
            bidResponse.CoverLetter = dto.CoverLetter;

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
            CreatedAt = bidResponse.CreatedAt,
            UpdatedAt = bidResponse.UpdatedAt
        };
    }

    public async Task AcceptBidResponseAsync(int id, decimal adminMarkupPercentage, string? adminComment, CancellationToken cancellationToken = default)
    {
        var bidResponse = await _context.Set<BidResponse>()
            .Include(r => r.BidRequest)
                .ThenInclude(br => br.Project)
            .Include(r => r.Specialist)
                .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (bidResponse == null)
            throw new BidResponseNotFoundException(id);

        if (bidResponse.BidRequest.Status != BidRequestStatus.Responded)
            throw new InvalidBidStatusException(bidResponse.BidRequest.Status, BidRequestStatus.Accepted);

        bidResponse.AdminMarkupPercentage = adminMarkupPercentage;
        bidResponse.AdminComment = adminComment;
        bidResponse.UpdatedAt = DateTime.UtcNow;

        bidResponse.BidRequest.Status = BidRequestStatus.Accepted;
        bidResponse.BidRequest.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _specialistService.AssignSpecialistToProjectAsync(
                bidResponse.BidRequest.ProjectId,
                bidResponse.SpecialistId,
                "Specialist",
                cancellationToken);
        }
        catch (SpecialistAlreadyAssignedException)
        {
            // Re-throw with specialist and project names for better UX
            var specialistName = $"{bidResponse.Specialist.User.FirstName} {bidResponse.Specialist.User.LastName}";
            var projectName = bidResponse.BidRequest.Project.Name;
            throw new SpecialistAlreadyAssignedException(
                bidResponse.SpecialistId,
                bidResponse.BidRequest.ProjectId,
                specialistName,
                projectName);
        }

        var otherResponses = await _context.Set<BidResponse>()
            .Include(r => r.BidRequest)
            .Where(r => r.BidRequestId == bidResponse.BidRequestId && r.Id != id)
            .ToListAsync(cancellationToken);

        //foreach (var response in otherResponses)
        //{
        //    if (response.BidRequest.Status == BidRequestStatus.Responded)
        //    {
        //        response.BidRequest.Status = BidRequestStatus.Rejected;
        //        response.BidRequest.UpdatedAt = DateTime.UtcNow;
        //        response.RejectionReason = "Another specialist was selected";
        //        response.UpdatedAt = DateTime.UtcNow;
        //    }
        //}

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RejectBidResponseAsync(int id, string? reason = null, CancellationToken cancellationToken = default)
    {
        var bidResponse = await _context.Set<BidResponse>()
            .Include(r => r.BidRequest)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (bidResponse == null)
            throw new BidResponseNotFoundException(id);

        bidResponse.BidRequest.Status = BidRequestStatus.Rejected;
        bidResponse.BidRequest.UpdatedAt = DateTime.UtcNow;
        bidResponse.RejectionReason = reason;
        bidResponse.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<BidMessageDto> CreateMessageAsync(CreateBidMessageDto dto, CancellationToken cancellationToken = default)
    {
        var bidRequestExists = await _context.Set<BidRequest>().AnyAsync(r => r.Id == dto.BidRequestId, cancellationToken);
        if (!bidRequestExists)
            throw new BidRequestNotFoundException(dto.BidRequestId);

        var message = new BidMessage
        {
            BidRequestId = dto.BidRequestId,
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
            BidRequestId = message.BidRequestId,
            SenderId = message.SenderId,
            SenderName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown",
            SenderProfilePictureUrl = user?.ProfilePictureUrl,
            MessageText = message.MessageText,
            CreatedAt = message.CreatedAt
        };
    }

    public async Task<IEnumerable<BidMessageDto>> GetMessagesByBidRequestIdAsync(int requestId, CancellationToken cancellationToken = default)
    {
        var messages = await _context.Set<BidMessage>()
            .Where(m => m.BidRequestId == requestId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync(cancellationToken);

        var senderIds = messages.Select(m => m.SenderId).Distinct().ToList();
        var users = await _context.Users
            .Where(u => senderIds.Contains(u.Id))
            .Select(u => new { u.Id, Name = $"{u.FirstName} {u.LastName}", u.ProfilePictureUrl })
            .ToDictionaryAsync(u => u.Id, cancellationToken);

        return messages.Select(m =>
        {
            var user = users.GetValueOrDefault(m.SenderId);
            return new BidMessageDto
            {
                Id = m.Id,
                BidRequestId = m.BidRequestId,
                SenderId = m.SenderId,
                SenderName = user?.Name ?? "Unknown",
                SenderProfilePictureUrl = user?.ProfilePictureUrl,
                MessageText = m.MessageText,
                CreatedAt = m.CreatedAt
            };
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

    public async Task SendBidRequestAsync(SendBidRequestDto dto, string clientId, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects.FindAsync([dto.ProjectId], cancellationToken);
        if (project == null)
            throw new ProjectNotFoundException(dto.ProjectId);

        var user = await _context.Users.FindAsync(clientId);
        if (user == null)
            throw new UnauthorizedAccessException("User not found");

        var userRoles = await _context.UserRoles
            .Where(ur => ur.UserId == clientId)
            .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
            .ToListAsync(cancellationToken);

        var isAdminOrSuperAdmin = userRoles.Any(role => role == "Admin" || role == "SuperAdmin");

        if (project.ClientId != clientId && !isAdminOrSuperAdmin)
            throw new UnauthorizedAccessException("You are not the owner of this project");

        var specialists = await _context.Specialists
            .Include(s => s.User)
            .Where(s => dto.SpecialistUserIds.Contains(s.UserId))
            .ToListAsync(cancellationToken);

        if (specialists.Count != dto.SpecialistUserIds.Length)
            throw new InvalidBidRequestException("One or more specialists not found");

        foreach (var specialist in specialists)
        {
            var bidRequest = new BidRequest
            {
                ProjectId = dto.ProjectId,
                SpecialistId = specialist.Id,
                Title = $"Bid Request for {project.Name}",
                Description = dto.Description,
                Status = BidRequestStatus.Pending,
                ProposedBudget = 0, // Admin doesn't set price, specialist will propose in bid response
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.BidRequests.Add(bidRequest);
            
            await _emailService.SendBidRequestNotificationAsync(
                specialist.User.Email!,
                $"{specialist.User.FirstName} {specialist.User.LastName}",
                project.Name,
                dto.Description,
                0, // No price in email notification
                cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<BidRequestDto>> GetBidRequestsBySpecialistIdAsync(int specialistId, CancellationToken cancellationToken = default)
    {
        var specialistExists = await _context.Specialists
            .AnyAsync(s => s.Id == specialistId, cancellationToken);
            
        if (!specialistExists)
            throw new SpecialistNotFoundException(specialistId);

        var bidRequests = await _context.BidRequests
            .Include(br => br.Project)
            .Include(br => br.Response)
            .Where(br => br.SpecialistId == specialistId)
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
            ProposedBudget = br.ProposedBudget,
            Deadline = br.Deadline,
            HasResponse = br.Response != null,
            CreatedAt = br.CreatedAt,
            UpdatedAt = br.UpdatedAt
        });
    }

    public async Task<IEnumerable<BidRequestDto>> GetBidRequestsBySpecialistIdAndStatusAsync(int specialistId, BidRequestStatus? status, CancellationToken cancellationToken = default)
    {
        var specialistExists = await _context.Specialists
            .AnyAsync(s => s.Id == specialistId, cancellationToken);
            
        if (!specialistExists)
            throw new SpecialistNotFoundException(specialistId);

        var query = _context.BidRequests
            .Include(br => br.Project)
            .Include(br => br.Response)
            .Where(br => br.SpecialistId == specialistId);

        if (status.HasValue)
        {
            query = query.Where(br => br.Status == status.Value);
        }

        var bidRequests = await query
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
            ProposedBudget = br.ProposedBudget,
            Deadline = br.Deadline,
            HasResponse = br.Response != null,
            CreatedAt = br.CreatedAt,
            UpdatedAt = br.UpdatedAt
        });
    }

    public async Task<IEnumerable<ProjectBidStatisticsDto>> GetProjectBidStatisticsAsync(CancellationToken cancellationToken = default)
    {
        var statistics = await _context.Projects
            .Include(p => p.BidRequests)
            .Where(p => p.BidRequests.Any()) // ✅ Only projects with bid requests
            .Select(p => new ProjectBidStatisticsDto
            {
                ProjectId = p.Id,
                ProjectName = p.Name,
                ProjectStatus = p.Status.ToString(),
                ProjectBudget = p.Budget,
                StartDate = p.StartDate,
                PendingBidsCount = p.BidRequests.Count(br => br.Status == BidRequestStatus.Pending),
                RespondedBidsCount = p.BidRequests.Count(br => br.Status == BidRequestStatus.Responded),
                AcceptedBidsCount = p.BidRequests.Count(br => br.Status == BidRequestStatus.Accepted),
                RejectedBidsCount = p.BidRequests.Count(br => br.Status == BidRequestStatus.Rejected)
            })
            .ToListAsync(cancellationToken);

        return statistics;
    }

    public async Task<IEnumerable<BidResponseByProjectDto>> GetBidResponsesByProjectIdAsync(int projectId, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
            
        if (project == null)
            throw new ProjectNotFoundException(projectId);

        // Get ALL BidRequests for this project, regardless of whether they have responses
        var bidRequests = await _context.Set<BidRequest>()
            .Include(br => br.Specialist)
                .ThenInclude(s => s.User)
            .Include(br => br.Specialist)
                .ThenInclude(s => s.LicenseTypes)
                    .ThenInclude(slt => slt.LicenseType)
            .Include(br => br.Response)
            .Where(br => br.ProjectId == projectId)
            .OrderByDescending(br => br.CreatedAt)
            .ToListAsync(cancellationToken);

        string clientName = "Unknown";
        string? clientProfilePictureUrl = null;
        
        if (!string.IsNullOrEmpty(project.ClientId))
        {
            var client = await _context.Users.FindAsync(project.ClientId);
            if (client != null)
            {
                clientName = $"{client.FirstName} {client.LastName}";
                clientProfilePictureUrl = client.ProfilePictureUrl;
            }
        }

        string? projectThumbnailUrl = null;
        if (!string.IsNullOrEmpty(project.ThumbnailUrl))
        {
            projectThumbnailUrl = _fileStorageService.GetPresignedUrl(project.ThumbnailUrl);
        }

        return bidRequests.Select(br =>
        {
            var specialist = br.Specialist;
            var licenseType = specialist.LicenseTypes.FirstOrDefault()?.LicenseType;
            var response = br.Response;

            return new BidResponseByProjectDto
            {
                Id = response?.Id ?? 0, // 0 if no response yet
                BidRequestId = br.Id,
                SpecialistId = specialist.Id,
                SpecialistName = $"{specialist.User.FirstName} {specialist.User.LastName}",
                SpecialistEmail = specialist.User.Email ?? string.Empty,
                SpecialistProfilePicture = specialist.User.ProfilePictureUrl,
                LicenseTypeId = licenseType?.Id ?? 0,
                LicenseTypeName = licenseType?.Name ?? "N/A",
                Status = br.Status.ToString(),
                ProposedPrice = response?.ProposedPrice ?? 0,
                EstimatedDays = response?.EstimatedDays ?? 0,
                IsAvailable = specialist.IsAvailable,
                CoverLetter = response?.CoverLetter ?? string.Empty,
                SubmittedAt = response?.CreatedAt ?? br.CreatedAt,
                
                ProjectId = project.Id,
                ProjectName = project.Name,
                ProjectThumbnailUrl = projectThumbnailUrl,
                ProjectBudget = project.Budget,
                ProjectDeadline = br.Deadline,
                
                ClientName = clientName,
                ClientProfilePictureUrl = clientProfilePictureUrl
            };
        });
    }
}
