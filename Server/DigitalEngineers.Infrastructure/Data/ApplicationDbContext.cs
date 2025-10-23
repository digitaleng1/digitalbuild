using DigitalEngineers.Domain.Entities;
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

        // Seed data
        SeedProfessions(builder);
        SeedLicenseTypes(builder);

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

    private static void SeedProfessions(ModelBuilder builder)
    {
        builder.Entity<Profession>().HasData(
            new Profession { Id = 1, Name = "Engineer", Description = "Professional Engineer" }
        );
    }

    private static void SeedLicenseTypes(ModelBuilder builder)
    {
        builder.Entity<LicenseType>().HasData(
            new LicenseType { Id = 1, Name = "Agricultural and Biological Engineering", Description = "Agricultural and Biological Engineering", ProfessionId = 1 },
            new LicenseType { Id = 2, Name = "Architectural Engineering", Description = "Architectural Engineering", ProfessionId = 1 },
            new LicenseType { Id = 3, Name = "Chemical Engineering", Description = "Chemical Engineering", ProfessionId = 1 },
            new LicenseType { Id = 4, Name = "Civil Engineering", Description = "Civil Engineering", ProfessionId = 1 },
            new LicenseType { Id = 5, Name = "Control Systems Engineering", Description = "Control Systems Engineering", ProfessionId = 1 },
            new LicenseType { Id = 6, Name = "Electrical and Computer Engineering", Description = "Electrical and Computer Engineering", ProfessionId = 1 },
            new LicenseType { Id = 7, Name = "Environmental Engineering", Description = "Environmental Engineering", ProfessionId = 1 },
            new LicenseType { Id = 8, Name = "Fire Protection Engineering", Description = "Fire Protection Engineering", ProfessionId = 1 },
            new LicenseType { Id = 9, Name = "Industrial and Systems Engineering", Description = "Industrial and Systems Engineering", ProfessionId = 1 },
            new LicenseType { Id = 10, Name = "Mechanical Engineering", Description = "Mechanical Engineering", ProfessionId = 1 },
            new LicenseType { Id = 11, Name = "Metallurgical and Materials Engineering", Description = "Metallurgical and Materials Engineering", ProfessionId = 1 },
            new LicenseType { Id = 12, Name = "Mining and Mineral Processing Engineering", Description = "Mining and Mineral Processing Engineering", ProfessionId = 1 },
            new LicenseType { Id = 13, Name = "Naval Architecture and Marine Engineering", Description = "Naval Architecture and Marine Engineering", ProfessionId = 1 },
            new LicenseType { Id = 14, Name = "Nuclear Engineering", Description = "Nuclear Engineering", ProfessionId = 1 },
            new LicenseType { Id = 15, Name = "Petroleum Engineering", Description = "Petroleum Engineering", ProfessionId = 1 }
        );
    }
}
