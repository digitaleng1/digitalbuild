using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class PortfolioService : IPortfolioService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<PortfolioService> _logger;

    public PortfolioService(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        ILogger<PortfolioService> logger)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<PortfolioItemDto> CreatePortfolioItemAsync(
        int specialistId,
        CreatePortfolioItemDto dto,
        Stream? thumbnailStream = null,
        string? fileName = null,
        string? contentType = null,
        CancellationToken cancellationToken = default)
    {
        var specialistExists = await _context.Set<Specialist>().AnyAsync(s => s.Id == specialistId, cancellationToken);
        if (!specialistExists)
        {
            _logger.LogWarning("Specialist with ID {SpecialistId} not found", specialistId);
            throw new SpecialistNotFoundException(specialistId);
        }

        var portfolioItem = new PortfolioItem
        {
            SpecialistId = specialistId,
            Title = dto.Title,
            Description = dto.Description,
            ProjectUrl = dto.ProjectUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<PortfolioItem>().Add(portfolioItem);
        await _context.SaveChangesAsync(cancellationToken);

        if (thumbnailStream != null && !string.IsNullOrEmpty(fileName))
        {
            try
            {
                var thumbnailKey = await _fileStorageService.UploadFileAsync(
                    thumbnailStream,
                    $"portfolio_{portfolioItem.Id}_{fileName}",
                    contentType ?? "image/jpeg",
                    0,
                    cancellationToken);

                portfolioItem.ThumbnailUrl = thumbnailKey;
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to upload thumbnail for portfolio item {PortfolioItemId}", portfolioItem.Id);
            }
        }

        return new PortfolioItemDto
        {
            Id = portfolioItem.Id,
            Title = portfolioItem.Title,
            Description = portfolioItem.Description,
            ThumbnailUrl = portfolioItem.ThumbnailUrl != null ? _fileStorageService.GetPresignedUrl(portfolioItem.ThumbnailUrl) : null,
            ProjectUrl = portfolioItem.ProjectUrl,
            CreatedAt = portfolioItem.CreatedAt
        };
    }

    public async Task<PortfolioItemDto> GetPortfolioItemByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var portfolioItem = await _context.Set<PortfolioItem>()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (portfolioItem == null)
            throw new PortfolioItemNotFoundException(id);

        return new PortfolioItemDto
        {
            Id = portfolioItem.Id,
            Title = portfolioItem.Title,
            Description = portfolioItem.Description,
            ThumbnailUrl = portfolioItem.ThumbnailUrl != null ? _fileStorageService.GetPresignedUrl(portfolioItem.ThumbnailUrl) : null,
            ProjectUrl = portfolioItem.ProjectUrl,
            CreatedAt = portfolioItem.CreatedAt
        };
    }

    public async Task<IEnumerable<PortfolioItemDto>> GetPortfolioItemsBySpecialistIdAsync(int specialistId, CancellationToken cancellationToken = default)
    {
        var portfolioItems = await _context.Set<PortfolioItem>()
            .Where(p => p.SpecialistId == specialistId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        return portfolioItems.Select(p => new PortfolioItemDto
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            ThumbnailUrl = p.ThumbnailUrl != null ? _fileStorageService.GetPresignedUrl(p.ThumbnailUrl) : null,
            ProjectUrl = p.ProjectUrl,
            CreatedAt = p.CreatedAt
        });
    }

    public async Task<PortfolioItemDto> UpdatePortfolioItemAsync(int id, CreatePortfolioItemDto dto, CancellationToken cancellationToken = default)
    {
        var portfolioItem = await _context.Set<PortfolioItem>().FindAsync([id], cancellationToken);

        if (portfolioItem == null)
            throw new PortfolioItemNotFoundException(id);

        portfolioItem.Title = dto.Title;
        portfolioItem.Description = dto.Description;
        portfolioItem.ProjectUrl = dto.ProjectUrl;

        await _context.SaveChangesAsync(cancellationToken);

        return new PortfolioItemDto
        {
            Id = portfolioItem.Id,
            Title = portfolioItem.Title,
            Description = portfolioItem.Description,
            ThumbnailUrl = portfolioItem.ThumbnailUrl != null ? _fileStorageService.GetPresignedUrl(portfolioItem.ThumbnailUrl) : null,
            ProjectUrl = portfolioItem.ProjectUrl,
            CreatedAt = portfolioItem.CreatedAt
        };
    }

    public async Task DeletePortfolioItemAsync(int id, CancellationToken cancellationToken = default)
    {
        var portfolioItem = await _context.Set<PortfolioItem>().FindAsync([id], cancellationToken);

        if (portfolioItem == null)
            throw new PortfolioItemNotFoundException(id);

        if (!string.IsNullOrEmpty(portfolioItem.ThumbnailUrl))
        {
            try
            {
                await _fileStorageService.DeleteFileAsync(portfolioItem.ThumbnailUrl, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete thumbnail for portfolio item {PortfolioItemId}", id);
            }
        }

        _context.Set<PortfolioItem>().Remove(portfolioItem);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
