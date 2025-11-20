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
        ILogger logger)
    {
        if (await context.Projects.AnyAsync())
        {
            return new SeededProjects(await context.Projects.ToListAsync());
        }

        if (clients.Count == 0)
        {
            logger.LogError("No clients found. Cannot seed projects.");
            return new SeededProjects(new List<Project>());
        }

        if (licenseTypes.Count == 0)
        {
            logger.LogError("No license types found. Cannot seed projects.");
            return new SeededProjects(new List<Project>());
        }

        var clientIds = clients.Select(c => c.Id).ToArray();
        var projects = CreateProjects(clientIds);
        var projectLicenseTypes = new List<ProjectLicenseType>();
        var projectFiles = new List<ProjectFile>();
        var projectTaskStatuses = new List<ProjectTaskStatus>();
        var projectTaskLabels = new List<ProjectTaskLabel>();

        await context.Projects.AddRangeAsync(projects);
        await context.SaveChangesAsync();

        SeedProjectLicenseTypes(projectLicenseTypes, projects, licenseTypes);
        await context.ProjectLicenseTypes.AddRangeAsync(projectLicenseTypes);
        await context.SaveChangesAsync();

        SeedProjectFiles(projectFiles, projects, clientIds);
        await context.ProjectFiles.AddRangeAsync(projectFiles);
        await context.SaveChangesAsync();

        SeedProjectThumbnails(projects);

        SeedProjectTaskStatuses(projectTaskStatuses, projects);
        await context.Set<ProjectTaskStatus>().AddRangeAsync(projectTaskStatuses);
        await context.SaveChangesAsync();

        SeedProjectTaskLabels(projectTaskLabels, projects);
        await context.Set<ProjectTaskLabel>().AddRangeAsync(projectTaskLabels);
        await context.SaveChangesAsync();

        return new SeededProjects(projects);
    }

    private static List<Project> CreateProjects(string[] clientIds)
    {
        var projects = new List<Project>();

        projects.Add(CreateProject(
            "Residential House Foundation Repair",
            "Foundation inspection and repair for a 2-story residential property. Cracks detected in basement walls, requires structural assessment and repair plan.",
            clientIds[0],
            "1425 Maple Street",
            "New York",
            "NY",
            "10001",
            ProjectScope.OneToThreeMonths,
            ProjectStatus.QuotePending,
            DateTime.UtcNow.AddDays(-15)
        ));

        projects.Add(CreateProject(
            "Downtown Office HVAC Upgrade",
            "Complete HVAC system replacement for 5-floor office building. Energy-efficient system with smart controls and zoned climate management.",
            clientIds[1],
            "850 Commerce Street",
            "Los Angeles",
            "CA",
            "90012",
            ProjectScope.LessThanSixMonths,
            ProjectStatus.InProgress,
            DateTime.UtcNow.AddDays(-45)
        ));

        projects.Add(CreateProject(
            "Industrial Factory Electrical System Upgrade",
            "High-voltage electrical system modernization for manufacturing facility. Includes power distribution, safety systems, and backup generators.",
            clientIds[2],
            "3200 Industrial Parkway",
            "Chicago",
            "IL",
            "60601",
            ProjectScope.GreaterThanSixMonths,
            ProjectStatus.InProgress,
            DateTime.UtcNow.AddDays(-60)
        ));

        projects.Add(CreateProject(
            "Apartment Complex Plumbing Renovation",
            "Complete plumbing system replacement for 50-unit apartment complex. New pipes, fixtures, and water-efficient systems installed.",
            clientIds[0],
            "725 Riverside Drive",
            "Austin",
            "TX",
            "78701",
            ProjectScope.OneToThreeMonths,
            ProjectStatus.Completed,
            DateTime.UtcNow.AddDays(-120)
        ));

        projects.Add(CreateProject(
            "Shopping Mall Fire Safety System Installation",
            "Comprehensive fire protection system for new shopping mall. Includes sprinklers, alarms, emergency lighting, and fire suppression systems.",
            clientIds[1],
            "4500 Mall Boulevard",
            "Boston",
            "MA",
            "02101",
            ProjectScope.LessThanSixMonths,
            ProjectStatus.InProgress,
            DateTime.UtcNow.AddDays(-30)
        ));

        projects.Add(CreateProject(
            "Warehouse Structural Assessment and Reinforcement",
            "Structural integrity assessment for 100,000 sq ft warehouse. Potential load-bearing concerns, requires engineering evaluation and reinforcement plan.",
            clientIds[2],
            "9800 Logistics Way",
            "Denver",
            "CO",
            "80201",
            ProjectScope.GreaterThanSixMonths,
            ProjectStatus.QuotePending,
            DateTime.UtcNow.AddDays(-8)
        ));

        projects.Add(CreateProject(
            "Townhouse Renovation and Modernization",
            "Complete renovation of 4-unit townhouse complex. Structural modifications, updated MEP systems, and modern finishes. Project cancelled due to budget constraints.",
            clientIds[0],
            "1650 Oak Avenue",
            "Seattle",
            "WA",
            "98101",
            ProjectScope.OneToThreeMonths,
            ProjectStatus.Cancelled,
            DateTime.UtcNow.AddDays(-90)
        ));

        projects.Add(CreateProject(
            "Hospital HVAC System Modernization",
            "Critical infrastructure upgrade for regional hospital. Advanced air filtration, isolation room capabilities, and energy-efficient climate control for medical facility.",
            clientIds[1],
            "2100 Medical Center Drive",
            "San Francisco",
            "CA",
            "94102",
            ProjectScope.GreaterThanSixMonths,
            ProjectStatus.InProgress,
            DateTime.UtcNow.AddDays(-75)
        ));

        projects.Add(CreateProject(
            "Power Plant Safety and Compliance Inspection",
            "Comprehensive safety inspection and compliance audit for regional power generation facility. Structural integrity, electrical safety, and environmental compliance assessment completed.",
            clientIds[2],
            "7500 Energy Boulevard",
            "Portland",
            "OR",
            "97201",
            ProjectScope.LessThanSixMonths,
            ProjectStatus.Completed,
            DateTime.UtcNow.AddDays(-150)
        ));

        projects.Add(CreateProject(
            "Luxury Villa Construction Engineering",
            "High-end residential construction project. Custom architectural design, advanced smart home systems, sustainable building practices, and premium finishes.",
            clientIds[0],
            "100 Oceanview Terrace",
            "Miami",
            "FL",
            "33101",
            ProjectScope.OneToThreeMonths,
            ProjectStatus.Draft,
            DateTime.UtcNow.AddDays(-5)
        ));

        return projects;
    }

    private static Project CreateProject(
        string name,
        string description,
        string clientId,
        string streetAddress,
        string city,
        string state,
        string zipCode,
        ProjectScope scope,
        ProjectStatus status,
        DateTime createdAt)
    {
        return new Project
        {
            Name = name,
            Description = description,
            Status = status,
            ClientId = clientId,
            StreetAddress = streetAddress,
            City = city,
            State = state,
            ZipCode = zipCode,
            ProjectScope = scope,
            ManagementType = ProjectManagementType.DigitalEngineersManaged,
            Budget = 0,
            StartDate = status == ProjectStatus.InProgress || status == ProjectStatus.Completed
                ? createdAt.AddDays(15)
                : null,
            CreatedAt = createdAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static void SeedProjectLicenseTypes(List<ProjectLicenseType> list, List<Project> projects, List<LicenseType> allLicenseTypes)
    {
        AddProjectLicenseTypes(list, projects[0].Id, allLicenseTypes, new[] { "Civil Engineering", "Architectural Engineering" });
        AddProjectLicenseTypes(list, projects[1].Id, allLicenseTypes, new[] { "Mechanical Engineering", "Electrical and Computer Engineering" });
        AddProjectLicenseTypes(list, projects[2].Id, allLicenseTypes, new[] { "Electrical and Computer Engineering", "Industrial and Systems Engineering" });
        AddProjectLicenseTypes(list, projects[3].Id, allLicenseTypes, new[] { "Civil Engineering", "Environmental Engineering" });
        AddProjectLicenseTypes(list, projects[4].Id, allLicenseTypes, new[] { "Fire Protection Engineering", "Electrical and Computer Engineering", "Mechanical Engineering" });
        AddProjectLicenseTypes(list, projects[5].Id, allLicenseTypes, new[] { "Civil Engineering", "Architectural Engineering" });
        AddProjectLicenseTypes(list, projects[6].Id, allLicenseTypes, new[] { "Architectural Engineering", "Civil Engineering" });
        AddProjectLicenseTypes(list, projects[7].Id, allLicenseTypes, new[] { "Mechanical Engineering", "Electrical and Computer Engineering", "Fire Protection Engineering" });
        AddProjectLicenseTypes(list, projects[8].Id, allLicenseTypes, new[] { "Electrical and Computer Engineering", "Environmental Engineering" });
        AddProjectLicenseTypes(list, projects[9].Id, allLicenseTypes, new[] { "Architectural Engineering", "Civil Engineering" });
    }

    private static void AddProjectLicenseTypes(
        List<ProjectLicenseType> list,
        int projectId,
        List<LicenseType> allLicenseTypes,
        string[] licenseNames)
    {
        foreach (var name in licenseNames)
        {
            var licenseType = allLicenseTypes.FirstOrDefault(lt => lt.Name == name);
            if (licenseType != null)
            {
                list.Add(new ProjectLicenseType
                {
                    ProjectId = projectId,
                    LicenseTypeId = licenseType.Id
                });
            }
        }
    }

    private static void SeedProjectFiles(List<ProjectFile> list, List<Project> projects, string[] clientIds)
    {
        AddProjectFile(list, projects[0].Id, clientIds[0], "foundation_photos.zip", 15728640, "application/zip");
        AddProjectFile(list, projects[0].Id, clientIds[0], "inspection_report.pdf", 2097152, "application/pdf");

        AddProjectFile(list, projects[1].Id, clientIds[1], "hvac_blueprints.pdf", 5242880, "application/pdf");
        AddProjectFile(list, projects[1].Id, clientIds[1], "building_specs.docx", 1048576, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        AddProjectFile(list, projects[1].Id, clientIds[1], "current_system_photos.zip", 20971520, "application/zip");
        AddProjectFile(list, projects[1].Id, clientIds[1], "energy_audit.pdf", 3145728, "application/pdf");

        AddProjectFile(list, projects[2].Id, clientIds[2], "electrical_drawings.pdf", 10485760, "application/pdf");
        AddProjectFile(list, projects[2].Id, clientIds[2], "power_requirements.xlsx", 524288, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        AddProjectFile(list, projects[2].Id, clientIds[2], "site_survey.pdf", 4194304, "application/pdf");

        AddProjectFile(list, projects[3].Id, clientIds[0], "plumbing_plans.pdf", 6291456, "application/pdf");
        AddProjectFile(list, projects[3].Id, clientIds[0], "completion_photos.zip", 31457280, "application/zip");
        AddProjectFile(list, projects[3].Id, clientIds[0], "inspection_certificate.pdf", 1048576, "application/pdf");
        AddProjectFile(list, projects[3].Id, clientIds[0], "warranty_documents.pdf", 2097152, "application/pdf");
        AddProjectFile(list, projects[3].Id, clientIds[0], "as_built_drawings.pdf", 8388608, "application/pdf");

        AddProjectFile(list, projects[4].Id, clientIds[1], "fire_safety_plans.pdf", 7340032, "application/pdf");
        AddProjectFile(list, projects[4].Id, clientIds[1], "sprinkler_layout.pdf", 4194304, "application/pdf");
        AddProjectFile(list, projects[4].Id, clientIds[1], "alarm_system_specs.pdf", 2097152, "application/pdf");

        AddProjectFile(list, projects[5].Id, clientIds[2], "warehouse_photos.zip", 18874368, "application/zip");

        AddProjectFile(list, projects[6].Id, clientIds[0], "renovation_plans.pdf", 9437184, "application/pdf");
        AddProjectFile(list, projects[6].Id, clientIds[0], "cancellation_notice.pdf", 524288, "application/pdf");

        AddProjectFile(list, projects[7].Id, clientIds[1], "hospital_hvac_specs.pdf", 12582912, "application/pdf");
        AddProjectFile(list, projects[7].Id, clientIds[1], "medical_facility_requirements.pdf", 3145728, "application/pdf");
        AddProjectFile(list, projects[7].Id, clientIds[1], "isolation_room_specs.pdf", 2097152, "application/pdf");
        AddProjectFile(list, projects[7].Id, clientIds[1], "progress_photos_month2.zip", 26214400, "application/zip");

        AddProjectFile(list, projects[8].Id, clientIds[2], "inspection_checklist.pdf", 1572864, "application/pdf");
        AddProjectFile(list, projects[8].Id, clientIds[2], "compliance_report.pdf", 5242880, "application/pdf");
        AddProjectFile(list, projects[8].Id, clientIds[2], "final_assessment.pdf", 4194304, "application/pdf");

        AddProjectFile(list, projects[9].Id, clientIds[0], "villa_concept_drawings.pdf", 16777216, "application/pdf");
        AddProjectFile(list, projects[9].Id, clientIds[0], "smart_home_specifications.pdf", 3145728, "application/pdf");
    }

    private static void AddProjectFile(
        List<ProjectFile> list,
        int projectId,
        string uploadedBy,
        string fileName,
        long fileSize,
        string contentType)
    {
        list.Add(new ProjectFile
        {
            ProjectId = projectId,
            FileName = fileName,
            FileUrl = $"projects/{projectId}/{fileName}",
            FileSize = fileSize,
            ContentType = contentType,
            UploadedBy = uploadedBy,
            UploadedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30))
        });
    }

    private static void SeedProjectThumbnails(List<Project> projects)
    {
        projects[0].ThumbnailUrl = "https://images.unsplash.com/photo-1477322524744-0eece9e79640?w=800&auto=format&fit=crop";
        projects[1].ThumbnailUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop";
        projects[2].ThumbnailUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop";
        projects[3].ThumbnailUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";
        projects[4].ThumbnailUrl = "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800&auto=format&fit=crop";
        projects[5].ThumbnailUrl = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop";
        projects[6].ThumbnailUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop";
        projects[7].ThumbnailUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop";
        projects[8].ThumbnailUrl = "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&auto=format&fit=crop";
        projects[9].ThumbnailUrl = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop";
    }

    private static void SeedProjectTaskStatuses(List<ProjectTaskStatus> list, List<Project> projects)
    {
        foreach (var project in projects)
        {
            list.Add(new ProjectTaskStatus
            {
                Name = "Todo",
                Color = "#6c757d",
                Order = 1,
                IsDefault = true,
                IsCompleted = false,
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            list.Add(new ProjectTaskStatus
            {
                Name = "In Progress",
                Color = "#007bff",
                Order = 2,
                IsDefault = false,
                IsCompleted = false,
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            list.Add(new ProjectTaskStatus
            {
                Name = "Done",
                Color = "#28a745",
                Order = 3,
                IsDefault = false,
                IsCompleted = true,
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });
        }
    }

    private static void SeedProjectTaskLabels(List<ProjectTaskLabel> list, List<Project> projects)
    {
        foreach (var project in projects)
        {
            list.Add(new ProjectTaskLabel
            {
                Name = "Bug",
                Color = "#dc3545",
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            list.Add(new ProjectTaskLabel
            {
                Name = "Feature",
                Color = "#28a745",
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            list.Add(new ProjectTaskLabel
            {
                Name = "Enhancement",
                Color = "#17a2b8",
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });

            list.Add(new ProjectTaskLabel
            {
                Name = "Documentation",
                Color = "#6610f2",
                ProjectId = project.Id,
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}
