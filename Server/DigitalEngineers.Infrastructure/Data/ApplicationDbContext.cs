using DigitalEngineers.Domain.Entities;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
        builder.Entity<Profession>(entity =>
        {
            entity.ToTable("Professions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
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
            entity.Property(e => e.DocumentUrls)
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                );
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
