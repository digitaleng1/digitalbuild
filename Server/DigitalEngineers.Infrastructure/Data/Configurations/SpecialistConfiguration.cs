using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class SpecialistConfiguration : IEntityTypeConfiguration<Specialist>
{
    public void Configure(EntityTypeBuilder<Specialist> builder)
    {
        builder.ToTable("Specialists");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.UserId).HasMaxLength(450).IsRequired();
        builder.Property(e => e.YearsOfExperience).IsRequired();
        builder.Property(e => e.HourlyRate).HasPrecision(18, 2);
        builder.Property(e => e.Rating).IsRequired();
        builder.Property(e => e.IsAvailable).IsRequired();
        builder.Property(e => e.Specialization).HasMaxLength(500);
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.UpdatedAt).IsRequired();
        
        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasIndex(e => e.UserId).IsUnique();
        
        builder.HasMany(e => e.LicenseTypes)
            .WithOne(e => e.Specialist)
            .HasForeignKey(e => e.SpecialistId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(e => e.AssignedProjects)
            .WithOne(e => e.Specialist)
            .HasForeignKey(e => e.SpecialistId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(e => e.Portfolio)
            .WithOne(e => e.Specialist)
            .HasForeignKey(e => e.SpecialistId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
