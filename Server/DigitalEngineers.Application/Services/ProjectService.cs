using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Entities;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class ProjectService : IProjectService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProjectService> _logger;

    public ProjectService(ApplicationDbContext context, ILogger<ProjectService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto, string clientId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating project '{Name}' for client {ClientId}", dto.Name, clientId);

        // Validate ClientId exists
        var clientExists = await _context.Users.AnyAsync(u => u.Id == clientId, cancellationToken);
        if (!clientExists)
        {
            _logger.LogWarning("Client with ID {ClientId} not found", clientId);
            throw new ArgumentException($"Client with ID {clientId} not found", nameof(clientId));
        }

        // Validate LicenseTypeIds exist
        var existingLicenseTypeIds = await _context.LicenseTypes
            .Where(lt => dto.LicenseTypeIds.Contains(lt.Id))
            .Select(lt => lt.Id)
            .ToListAsync(cancellationToken);

        if (existingLicenseTypeIds.Count != dto.LicenseTypeIds.Length)
        {
            var invalidIds = dto.LicenseTypeIds.Except(existingLicenseTypeIds);
            _logger.LogWarning("Invalid license type IDs: {InvalidIds}", string.Join(", ", invalidIds));
            throw new ArgumentException($"Invalid license type IDs: {string.Join(", ", invalidIds)}", nameof(dto.LicenseTypeIds));
        }

        // Parse project scope
        var projectScope = ParseProjectScope(dto.ProjectScope);

        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // Create project entity
            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                Status = ProjectStatus.Published,
                ClientId = clientId,
                StreetAddress = dto.StreetAddress,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                ProjectScope = projectScope,
                DocumentUrls = dto.DocumentUrls.ToList(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Add project to context
            _context.Projects.Add(project);
            await _context.SaveChangesAsync(cancellationToken);

            // Create license type associations
            var projectLicenseTypes = dto.LicenseTypeIds
                .Select(ltId => new ProjectLicenseType
                {
                    ProjectId = project.Id,
                    LicenseTypeId = ltId
                })
                .ToList();

            _context.ProjectLicenseTypes.AddRange(projectLicenseTypes);
            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            _logger.LogInformation("Project {ProjectId} created successfully", project.Id);

            return new ProjectDto(
                project.Id,
                project.Name,
                project.Description,
                project.Status.ToString(),
                project.CreatedAt
            );
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error creating project '{Name}' for client {ClientId}", dto.Name, clientId);
            throw;
        }
    }

    public async Task<ProjectDetailsDto?> GetProjectByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .Include(p => p.ProjectLicenseTypes)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (project == null)
        {
            return null;
        }

        var licenseTypeIds = project.ProjectLicenseTypes
            .Select(plt => plt.LicenseTypeId)
            .ToArray();

        return new ProjectDetailsDto(
            project.Id,
            project.Name,
            project.Description,
            project.Status.ToString(),
            project.ClientId,
            project.StreetAddress,
            project.City,
            project.State,
            project.ZipCode,
            ConvertProjectScopeToString(project.ProjectScope),
            project.DocumentUrls.ToArray(),
            licenseTypeIds,
            project.CreatedAt,
            project.UpdatedAt
        );
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsByClientIdAsync(string clientId, CancellationToken cancellationToken = default)
    {
        var projects = await _context.Projects
            .Where(p => p.ClientId == clientId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProjectDto(
                p.Id,
                p.Name,
                p.Description,
                p.Status.ToString(),
                p.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        return projects;
    }

    private static ProjectScope ParseProjectScope(string scope)
    {
        return scope switch
        {
            "1-3" => ProjectScope.OneToThreeMonths,
            "less-6" => ProjectScope.LessThanSixMonths,
            "greater-6" => ProjectScope.GreaterThanSixMonths,
            _ => throw new ArgumentException($"Invalid project scope: {scope}", nameof(scope))
        };
    }

    private static string ConvertProjectScopeToString(ProjectScope scope)
    {
        return scope switch
        {
            ProjectScope.OneToThreeMonths => "1-3",
            ProjectScope.LessThanSixMonths => "less-6",
            ProjectScope.GreaterThanSixMonths => "greater-6",
            _ => throw new ArgumentException($"Invalid project scope: {scope}", nameof(scope))
        };
    }
}
