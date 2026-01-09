using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class ClientService : IClientService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<ClientService> _logger;

    public ClientService(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        ILogger<ClientService> logger)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<ClientProfileDto> GetClientProfileAsync(int clientId, CancellationToken cancellationToken = default)
    {
        var client = await _context.Clients
            .Include(c => c.User)
            .Include(c => c.Projects)
                .ThenInclude(p => p.AssignedSpecialists)
            .FirstOrDefaultAsync(c => c.Id == clientId, cancellationToken);

        if (client == null)
            throw new ClientNotFoundException(clientId);

        var stats = await CalculateStatsAsync(client.UserId, cancellationToken);

        string? profilePictureUrl = null;
        if (!string.IsNullOrWhiteSpace(client.User.ProfilePictureUrl))
        {
            profilePictureUrl = _fileStorageService.GetPresignedUrl(client.User.ProfilePictureUrl);
        }

        return new ClientProfileDto
        {
            Id = client.Id,
            UserId = client.UserId,
            FirstName = client.User.FirstName ?? string.Empty,
            LastName = client.User.LastName ?? string.Empty,
            Email = client.User.Email ?? string.Empty,
            ProfilePictureUrl = profilePictureUrl,
            CompanyName = client.CompanyName,
            Industry = client.Industry,
            Website = client.Website,
            CompanyDescription = client.CompanyDescription,
            PhoneNumber = client.User.PhoneNumber,
            Location = client.User.Location,
            Stats = stats,
            CreatedAt = client.CreatedAt
        };
    }

    public async Task<ClientProfileDto> GetCurrentClientProfileAsync(string userId, CancellationToken cancellationToken = default)
    {
        var client = await _context.Clients
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (client == null)
            throw new ClientNotFoundException($"Client with user ID {userId} not found");

        return await GetClientProfileAsync(client.Id, cancellationToken);
    }

    public async Task<ClientProfileDto> UpdateClientProfileAsync(int clientId, UpdateClientProfileDto dto, CancellationToken cancellationToken = default)
    {
        var client = await _context.Clients
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == clientId, cancellationToken);

        if (client == null)
            throw new ClientNotFoundException(clientId);

        // Update Client fields
        client.CompanyName = dto.CompanyName;
        client.Industry = dto.Industry;
        client.Website = dto.Website;
        client.CompanyDescription = dto.CompanyDescription;
        client.UpdatedAt = DateTime.UtcNow;

        // Update ApplicationUser fields
        client.User.FirstName = dto.FirstName;
        client.User.LastName = dto.LastName;
        client.User.PhoneNumber = dto.PhoneNumber;
        client.User.Location = dto.Location;
        client.User.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return await GetClientProfileAsync(clientId, cancellationToken);
    }

    public async Task<string> UploadProfilePictureAsync(int clientId, Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var client = await _context.Clients
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == clientId, cancellationToken);

        if (client == null)
            throw new ClientNotFoundException(clientId);

        // Validate file
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(extension))
            throw new ValidationException($"Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}");

        if (fileStream.Length > 5 * 1024 * 1024) // 5MB
            throw new ValidationException("File size cannot exceed 5MB");

        // Delete old avatar if exists
        if (!string.IsNullOrWhiteSpace(client.User.ProfilePictureUrl))
        {
            try
            {
                await _fileStorageService.DeleteFileAsync(client.User.ProfilePictureUrl, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete old avatar for client {ClientId}", clientId);
            }
        }

        // Upload new avatar
        var s3Key = await _fileStorageService.UploadUserAvatarAsync(
            fileStream,
            fileName,
            contentType,
            client.UserId,
            cancellationToken);

        // Update ProfilePictureUrl in ApplicationUser
        client.User.ProfilePictureUrl = s3Key;
        client.User.UpdatedAt = DateTime.UtcNow;
        client.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Generate presigned URL
        return _fileStorageService.GetPresignedUrl(s3Key);
    }

    public async Task<List<ClientListDto>> GetClientListAsync(string? search = null, CancellationToken cancellationToken = default)
    {
        // Get users with Client role
        var usersWithClientRole = _context.UserRoles
            .Where(ur => _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == UserRoles.Client))
            .Select(ur => ur.UserId);
        
        var query = from user in _context.Users
                    join client in _context.Clients on user.Id equals client.UserId into clientJoin
                    from client in clientJoin.DefaultIfEmpty()
                    where user.IsActive && usersWithClientRole.Contains(user.Id)
                    select new { User = user, Client = client };
        
        // Apply search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(x =>
                (x.User.FirstName != null && x.User.FirstName.ToLower().Contains(searchLower)) ||
                (x.User.LastName != null && x.User.LastName.ToLower().Contains(searchLower)) ||
                (x.User.Email != null && x.User.Email.ToLower().Contains(searchLower)) ||
                (x.Client != null && x.Client.CompanyName != null && x.Client.CompanyName.ToLower().Contains(searchLower))
            );
        }
        
        var clients = await query
            .OrderBy(x => x.User.FirstName)
            .ThenBy(x => x.User.LastName)
            .Select(x => new ClientListDto
            {
                UserId = x.User.Id,
                Name = $"{x.User.FirstName} {x.User.LastName}".Trim(),
                Email = x.User.Email!,
                CompanyName = x.Client != null ? x.Client.CompanyName : null,
                ProfilePictureUrl = x.User.ProfilePictureUrl
            })
            .ToListAsync(cancellationToken);
        
        // Generate presigned URLs for profile pictures
        foreach (var client in clients)
        {
            if (!string.IsNullOrEmpty(client.ProfilePictureUrl))
            {
                client.ProfilePictureUrl = _fileStorageService.GetPresignedUrl(client.ProfilePictureUrl);
            }
        }
        
        return clients;
    }

    private async Task<ClientStatsDto> CalculateStatsAsync(string clientUserId, CancellationToken cancellationToken)
    {
        var projects = await _context.Projects
            .Include(p => p.AssignedSpecialists)
            .Where(p => p.ClientId == clientUserId)
            .ToListAsync(cancellationToken);

        var projectIds = projects.Select(p => p.Id).ToList();

        if (!projectIds.Any())
        {
            return new ClientStatsDto
            {
                TotalProjects = 0,
                ActiveProjects = 0,
                TotalTasks = 0,
                CompletedTasks = 0,
                InProgressTasks = 0,
                TotalSpecialists = 0
            };
        }

        var tasks = await _context.Tasks
            .Include(t => t.Status)
            .Where(t => projectIds.Contains(t.ProjectId))
            .ToListAsync(cancellationToken);

        return new ClientStatsDto
        {
            TotalProjects = projects.Count,
            ActiveProjects = projects.Count(p => p.Status == ProjectStatus.InProgress),
            TotalTasks = tasks.Count,
            CompletedTasks = tasks.Count(t => t.Status.IsCompleted),
            InProgressTasks = tasks.Count(t => !t.Status.IsCompleted && t.StartedAt != null),
            TotalSpecialists = projects
                .SelectMany(p => p.AssignedSpecialists)
                .Select(ps => ps.SpecialistId)
                .Distinct()
                .Count()
        };
    }
}
