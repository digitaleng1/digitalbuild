using DigitalEngineers.Infrastructure.Configuration;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Infrastructure.Entities.Identity;
using DigitalEngineers.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

public class SeededProjects
{
    public List<Project> Projects { get; }

    public SeededProjects(List<Project> projects)
    {
        Projects = projects;
    }
}

public static class ProjectSeeder
{
    public static async Task<SeededProjects> SeedAsync(
        ApplicationDbContext context,
        List<ApplicationUser> clients,
        List<LicenseType> licenseTypes,
        List<ProjectConfig> projectConfigs,
        ILogger logger)
    {
        if (await context.Projects.AnyAsync())
        {
            return new SeededProjects(await context.Projects.ToListAsync());
        }

        if (clients.Count == 0)
        {
            logger.LogError("No clients found. Cannot seed projects");
            return new SeededProjects(new List<Project>());
        }

        if (licenseTypes.Count == 0)
        {
            logger.LogError("No license types found. Cannot seed projects");
            return new SeededProjects(new List<Project>());
        }

        var projects = new List<Project>();

        // Create projects from config
        foreach (var config in projectConfigs)
        {
            var client = clients.FirstOrDefault(c => c.Email == config.ClientEmail);
            if (client == null)
            {
                logger.LogWarning("Client {ClientEmail} not found for project {ProjectName}",
                    config.ClientEmail, config.Name);
                continue;
            }

            var project = new Project
            {
                Name = config.Name,
                Description = config.Description,
                Status = Enum.Parse<ProjectStatus>(config.Status),
                ClientId = client.Id,
                StreetAddress = config.StreetAddress,
                City = config.City,
                State = config.State,
                ZipCode = config.ZipCode,
                ProjectScope = Enum.Parse<ProjectScope>(config.ProjectScope),
                ManagementType = ProjectManagementType.DigitalEngineersManaged,
                Budget = 0,
                ThumbnailUrl = config.ThumbnailUrl,
                StartDate = config.Status == "InProgress" || config.Status == "Completed"
                    ? DateTime.UtcNow.AddDays(-config.CreatedDaysAgo + 15)
                    : null,
                CreatedAt = DateTime.UtcNow.AddDays(-config.CreatedDaysAgo),
                UpdatedAt = DateTime.UtcNow
            };

            projects.Add(project);
        }

        await context.Projects.AddRangeAsync(projects);
        await context.SaveChangesAsync();

        // Seed project license types from config
        var projectLicenseTypes = new List<ProjectLicenseType>();
        foreach (var project in projects)
        {
            var config = projectConfigs.First(pc => pc.Name == project.Name);

            foreach (var licenseTypeName in config.LicenseTypeNames)
            {
                var licenseType = licenseTypes.FirstOrDefault(lt => lt.Name == licenseTypeName);
                if (licenseType != null)
                {
                    projectLicenseTypes.Add(new ProjectLicenseType
                    {
                        ProjectId = project.Id,
                        LicenseTypeId = licenseType.Id
                    });
                }
            }
        }

        await context.ProjectLicenseTypes.AddRangeAsync(projectLicenseTypes);
        await context.SaveChangesAsync();

        // Seed project task statuses and labels (common for all projects)
        await SeedProjectTaskStatusesAndLabels(context, projects);

        return new SeededProjects(projects);
    }

    private static async Task SeedProjectTaskStatusesAndLabels(ApplicationDbContext context, List<Project> projects)
    {
        var projectTaskStatuses = new List<ProjectTaskStatus>();
        var projectTaskLabels = new List<ProjectTaskLabel>();

        foreach (var project in projects)
        {
            projectTaskStatuses.Add(new ProjectTaskStatus
            {
                Name = "Todo",
                Color = "#6c757d",
                Order = 1,
                IsDefault = true,
                IsCompleted = false,
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            projectTaskStatuses.Add(new ProjectTaskStatus
            {
                Name = "In Progress",
                Color = "#007bff",
                Order = 2,
                IsDefault = false,
                IsCompleted = false,
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            projectTaskStatuses.Add(new ProjectTaskStatus
            {
                Name = "Done",
                Color = "#28a745",
                Order = 3,
                IsDefault = false,
                IsCompleted = true,
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            projectTaskLabels.Add(new ProjectTaskLabel
            {
                Name = "Bug",
                Color = "#dc3545",
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            projectTaskLabels.Add(new ProjectTaskLabel
            {
                Name = "Feature",
                Color = "#28a745",
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            projectTaskLabels.Add(new ProjectTaskLabel
            {
                Name = "Enhancement",
                Color = "#17a2b8",
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            projectTaskLabels.Add(new ProjectTaskLabel
            {
                Name = "Documentation",
                Color = "#6610f2",
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });
        }

        await context.Set<ProjectTaskStatus>().AddRangeAsync(projectTaskStatuses);
        await context.Set<ProjectTaskLabel>().AddRangeAsync(projectTaskLabels);
        await context.SaveChangesAsync();
    }
}
