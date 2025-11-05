using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DigitalEngineers.Infrastructure.Data;

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
    public DbSet<SpecialistLicenseType> SpecialistLicenseTypes => Set<SpecialistLicenseType>();
    public DbSet<ProjectSpecialist> ProjectSpecialists => Set<ProjectSpecialist>();
    public DbSet<PortfolioItem> PortfolioItems => Set<PortfolioItem>();
    public DbSet<BidRequest> BidRequests => Set<BidRequest>();
    public DbSet<BidResponse> BidResponses => Set<BidResponse>();
    public DbSet<BidMessage> BidMessages => Set<BidMessage>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure ApplicationUser
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("Users");
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.ProfilePictureUrl).HasMaxLength(500);
            entity.Property(e => e.Biography).HasMaxLength(2000);
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.Website).HasMaxLength(500);
            entity.Property(e => e.RefreshToken).HasMaxLength(500);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Profession
        builder.Entity<Profession>(entity =>        {
            entity.ToTable("Professions");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasMany(e => e.LicenseTypes)
                  .WithOne(e => e.Profession)
                  .HasForeignKey(e => e.ProfessionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure LicenseType
        builder.Entity<LicenseType>(entity =>
        {
            entity.ToTable("LicenseTypes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ProfessionId).IsRequired();
        });

        // Configure Project
        builder.Entity<Project>(entity =>
        {
            entity.ToTable("Projects");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(5000).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.ClientId).HasMaxLength(450).IsRequired();
            entity.Property(e => e.StreetAddress).HasMaxLength(300).IsRequired();
            entity.Property(e => e.City).HasMaxLength(100).IsRequired();
            entity.Property(e => e.State).HasMaxLength(2).IsRequired();
            entity.Property(e => e.ZipCode).HasMaxLength(10).IsRequired();
            entity.Property(e => e.ProjectScope).IsRequired();
            entity.Property(e => e.ThumbnailUrl).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            
            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasMany(e => e.ProjectLicenseTypes)
                .WithOne(e => e.Project)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.Files)
                .WithOne(e => e.Project)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.AssignedSpecialists)
                .WithOne(e => e.Project)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure ProjectFile
        builder.Entity<ProjectFile>(entity =>
        {
            entity.ToTable("ProjectFiles");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProjectId).IsRequired();
            entity.Property(e => e.FileName).HasMaxLength(500).IsRequired();
            entity.Property(e => e.FileUrl).HasMaxLength(1000).IsRequired();
            entity.Property(e => e.FileSize).IsRequired();
            entity.Property(e => e.ContentType).HasMaxLength(200).IsRequired();
            entity.Property(e => e.UploadedAt).IsRequired();
            entity.Property(e => e.UploadedBy).HasMaxLength(450).IsRequired();
            
            entity.HasOne(e => e.Project)
                .WithMany(e => e.Files)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => e.ProjectId);
        });

        // Configure ProjectLicenseType (Many-to-Many)
        builder.Entity<ProjectLicenseType>(entity =>
        {
            entity.ToTable("ProjectLicenseTypes");
            entity.HasKey(plt => new { plt.ProjectId, plt.LicenseTypeId });
            
            entity.HasOne(plt => plt.Project)
                .WithMany(p => p.ProjectLicenseTypes)
                .HasForeignKey(plt => plt.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(plt => plt.LicenseType)
                .WithMany()
                .HasForeignKey(plt => plt.LicenseTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Specialist
        builder.Entity<Specialist>(entity =>
        {
            entity.ToTable("Specialists");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).HasMaxLength(450).IsRequired();
            entity.Property(e => e.YearsOfExperience).IsRequired();
            entity.Property(e => e.HourlyRate).HasPrecision(18, 2);
            entity.Property(e => e.Rating).IsRequired();
            entity.Property(e => e.IsAvailable).IsRequired();
            entity.Property(e => e.Specialization).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => e.UserId).IsUnique();
            
            entity.HasMany(e => e.LicenseTypes)
                .WithOne(e => e.Specialist)
                .HasForeignKey(e => e.SpecialistId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.AssignedProjects)
                .WithOne(e => e.Specialist)
                .HasForeignKey(e => e.SpecialistId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.Portfolio)
                .WithOne(e => e.Specialist)
                .HasForeignKey(e => e.SpecialistId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure SpecialistLicenseType (Many-to-Many)
        builder.Entity<SpecialistLicenseType>(entity =>
        {
            entity.ToTable("SpecialistLicenseTypes");
            entity.HasKey(slt => new { slt.SpecialistId, slt.LicenseTypeId });
            
            entity.HasOne(slt => slt.Specialist)
                .WithMany(s => s.LicenseTypes)
                .HasForeignKey(slt => slt.SpecialistId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(slt => slt.LicenseType)
                .WithMany()
                .HasForeignKey(slt => slt.LicenseTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure ProjectSpecialist (Many-to-Many with additional properties)
        builder.Entity<ProjectSpecialist>(entity =>
        {
            entity.ToTable("ProjectSpecialists");
            entity.HasKey(ps => new { ps.ProjectId, ps.SpecialistId });
            
            entity.Property(e => e.AssignedAt).IsRequired();
            entity.Property(e => e.Role).HasMaxLength(100);
            
            entity.HasOne(ps => ps.Project)
                .WithMany(p => p.AssignedSpecialists)
                .HasForeignKey(ps => ps.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(ps => ps.Specialist)
                .WithMany(s => s.AssignedProjects)
                .HasForeignKey(ps => ps.SpecialistId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure PortfolioItem
        builder.Entity<PortfolioItem>(entity =>
        {
            entity.ToTable("PortfolioItems");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SpecialistId).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(2000).IsRequired();
            entity.Property(e => e.ThumbnailUrl).HasMaxLength(1000);
            entity.Property(e => e.ProjectUrl).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).IsRequired();
            
            entity.HasOne(e => e.Specialist)
                .WithMany(s => s.Portfolio)
                .HasForeignKey(e => e.SpecialistId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => e.SpecialistId);
        });

        // Configure BidRequest
        builder.Entity<BidRequest>(entity =>
        {
            entity.ToTable("BidRequests");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProjectId).IsRequired();
            entity.Property(e => e.SpecialistId).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(2000).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.ProposedBudget).HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            entity.HasOne(e => e.Project)
                .WithMany(p => p.BidRequests)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Specialist)
                .WithMany()
                .HasForeignKey(e => e.SpecialistId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Response)
                .WithOne(r => r.BidRequest)
                .HasForeignKey<BidResponse>(r => r.BidRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Messages)
                .WithOne(m => m.BidRequest)
                .HasForeignKey(m => m.BidRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.ProjectId);
            entity.HasIndex(e => e.SpecialistId);
            entity.HasIndex(e => e.Status);
        });

        // Configure BidResponse
        builder.Entity<BidResponse>(entity =>
        {
            entity.ToTable("BidResponses");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.BidRequestId).IsRequired();
            entity.Property(e => e.SpecialistId).IsRequired();
            entity.Property(e => e.CoverLetter).HasMaxLength(2000).IsRequired();
            entity.Property(e => e.ProposedPrice).HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.EstimatedDays).IsRequired();
            entity.Property(e => e.RejectionReason).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            entity.HasOne(e => e.Specialist)
                .WithMany()
                .HasForeignKey(e => e.SpecialistId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.BidRequestId).IsUnique();
            entity.HasIndex(e => e.SpecialistId);
        });

        // Configure BidMessage
        builder.Entity<BidMessage>(entity =>
        {
            entity.ToTable("BidMessages");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.BidRequestId).IsRequired();
            entity.Property(e => e.SenderId).HasMaxLength(450).IsRequired();
            entity.Property(e => e.MessageText).HasMaxLength(2000).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();

            entity.HasOne(e => e.BidRequest)
                .WithMany(r => r.Messages)
                .HasForeignKey(e => e.BidRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.BidRequestId);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Rename Identity tables
        builder.Entity<IdentityRole>(entity =>
        {
            entity.ToTable("Roles");
        });

        builder.Entity<IdentityUserRole<string>>(entity =>
        {
            entity.ToTable("UserRoles");
        });

        builder.Entity<IdentityUserClaim<string>>(entity =>
        {
            entity.ToTable("UserClaims");
        });

        builder.Entity<IdentityUserLogin<string>>(entity =>
        {
            entity.ToTable("UserLogins");
        });

        builder.Entity<IdentityRoleClaim<string>>(entity =>
        {
            entity.ToTable("RoleClaims");
        });

        builder.Entity<IdentityUserToken<string>>(entity =>
        {
            entity.ToTable("UserTokens");
        });
    }
}
