using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class ReviewService : IReviewService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ReviewService> _logger;

    public ReviewService(ApplicationDbContext context, ILogger<ReviewService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, string clientId, CancellationToken cancellationToken = default)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            throw new InvalidRatingException(dto.Rating);

        var project = await _context.Projects.FindAsync([dto.ProjectId], cancellationToken);
        if (project == null)
            throw new ProjectNotFoundException(dto.ProjectId);

        if (project.ClientId != clientId)
        {
            _logger.LogWarning("Client {ClientId} attempted to review project {ProjectId} they don't own", clientId, dto.ProjectId);
            throw new UnauthorizedAccessException("You can only review your own projects");
        }

        var specialist = await _context.Specialists.FindAsync([dto.SpecialistId], cancellationToken);
        if (specialist == null)
            throw new SpecialistNotFoundException(dto.SpecialistId);

        var existingReview = await _context.Set<Review>()
            .FirstOrDefaultAsync(r => r.ProjectId == dto.ProjectId && r.SpecialistId == dto.SpecialistId, cancellationToken);

        if (existingReview != null)
        {
            _logger.LogWarning("Review already exists for project {ProjectId} and specialist {SpecialistId}", dto.ProjectId, dto.SpecialistId);
            throw new InvalidOperationException($"Review already exists for this project and specialist");
        }

        var review = new Review
        {
            ProjectId = dto.ProjectId,
            ClientId = clientId,
            SpecialistId = dto.SpecialistId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<Review>().Add(review);
        await _context.SaveChangesAsync(cancellationToken);

        await UpdateSpecialistRatingAsync(dto.SpecialistId, cancellationToken);

        var client = await _context.Users.FindAsync(clientId);
        var projectEntity = await _context.Projects.FindAsync([dto.ProjectId], cancellationToken);

        return new ReviewDto
        {
            Id = review.Id,
            ProjectId = review.ProjectId,
            ProjectName = projectEntity!.Name,
            ClientName = $"{client!.FirstName} {client.LastName}",
            ClientAvatar = client.ProfilePictureUrl,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<IEnumerable<ReviewDto>> GetReviewsBySpecialistIdAsync(int specialistId, CancellationToken cancellationToken = default)
    {
        var reviews = await _context.Set<Review>()
            .Include(r => r.Client)
            .Include(r => r.Project)
            .Where(r => r.SpecialistId == specialistId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);

        return reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ProjectId = r.ProjectId,
            ProjectName = r.Project.Name,
            ClientName = $"{r.Client.FirstName} {r.Client.LastName}",
            ClientAvatar = r.Client.ProfilePictureUrl,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<double> GetAverageRatingAsync(int specialistId, CancellationToken cancellationToken = default)
    {
        var reviews = await _context.Set<Review>()
            .Where(r => r.SpecialistId == specialistId)
            .ToListAsync(cancellationToken);

        if (!reviews.Any())
            return 0;

        return reviews.Average(r => r.Rating);
    }

    public async Task<ReviewDto> UpdateReviewAsync(int id, CreateReviewDto dto, string clientId, CancellationToken cancellationToken = default)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            throw new InvalidRatingException(dto.Rating);

        var review = await _context.Set<Review>()
            .Include(r => r.Client)
            .Include(r => r.Project)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (review == null)
            throw new ReviewNotFoundException(id);

        if (review.ClientId != clientId)
        {
            _logger.LogWarning("Client {ClientId} attempted to update review {ReviewId} they don't own", clientId, id);
            throw new UnauthorizedAccessException("You can only update your own reviews");
        }

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;

        await _context.SaveChangesAsync(cancellationToken);
        await UpdateSpecialistRatingAsync(review.SpecialistId, cancellationToken);

        return new ReviewDto
        {
            Id = review.Id,
            ProjectId = review.ProjectId,
            ProjectName = review.Project.Name,
            ClientName = $"{review.Client.FirstName} {review.Client.LastName}",
            ClientAvatar = review.Client.ProfilePictureUrl,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task DeleteReviewAsync(int id, string clientId, CancellationToken cancellationToken = default)
    {
        var review = await _context.Set<Review>().FindAsync([id], cancellationToken);

        if (review == null)
            throw new ReviewNotFoundException(id);

        if (review.ClientId != clientId)
        {
            _logger.LogWarning("Client {ClientId} attempted to delete review {ReviewId} they don't own", clientId, id);
            throw new UnauthorizedAccessException("You can only delete your own reviews");
        }

        var specialistId = review.SpecialistId;

        _context.Set<Review>().Remove(review);
        await _context.SaveChangesAsync(cancellationToken);

        await UpdateSpecialistRatingAsync(specialistId, cancellationToken);
    }

    private async Task UpdateSpecialistRatingAsync(int specialistId, CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Specialists.FindAsync([specialistId], cancellationToken);
        if (specialist == null)
            return;

        var averageRating = await GetAverageRatingAsync(specialistId, cancellationToken);
        specialist.Rating = averageRating;
        specialist.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
