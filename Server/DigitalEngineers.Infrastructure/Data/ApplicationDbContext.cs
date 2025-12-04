using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DigitalEngineers.Infrastructure.Data;

using ProjectTaskEntity = Entities.ProjectTask;
using ProjectTaskStatusEntity = Entities.ProjectTaskStatus;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Profession> Professions => Set<Profession>();
    public DbSet<LicenseType> LicenseTypes => Set<LicenseType>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectLicenseType> ProjectLicenseTypes => Set<ProjectLicenseType>();
    public DbSet<ProjectFile> ProjectFiles => Set<ProjectFile>();
    public DbSet<Specialist> Specialists => Set<Specialist>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<SpecialistLicenseType> SpecialistLicenseTypes => Set<SpecialistLicenseType>();
    public DbSet<ProjectSpecialist> ProjectSpecialists => Set<ProjectSpecialist>();
    public DbSet<PortfolioItem> PortfolioItems => Set<PortfolioItem>();
    public DbSet<BidRequest> BidRequests => Set<BidRequest>();
    public DbSet<BidResponse> BidResponses => Set<BidResponse>();
    public DbSet<BidMessage> BidMessages => Set<BidMessage>();
    public DbSet<Review> Reviews => Set<Review>();

    // Task Management System
    public DbSet<ProjectTaskEntity> Tasks => Set<ProjectTaskEntity>();
    public DbSet<ProjectTaskStatusEntity> ProjectTaskStatuses => Set<ProjectTaskStatusEntity>();
    public DbSet<TaskComment> TaskComments => Set<TaskComment>();
    public DbSet<TaskAttachment> TaskAttachments => Set<TaskAttachment>();
    public DbSet<TaskWatcher> TaskWatchers => Set<TaskWatcher>();
    public DbSet<ProjectTaskLabel> ProjectTaskLabels => Set<ProjectTaskLabel>();
    public DbSet<TaskLabel> TaskLabels => Set<TaskLabel>();
    public DbSet<TaskAuditLog> TaskAuditLogs => Set<TaskAuditLog>();
    
    // Notifications
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<UserDevice> UserDevices => Set<UserDevice>();
    public DbSet<SpecialistInvitation> SpecialistInvitations => Set<SpecialistInvitation>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
