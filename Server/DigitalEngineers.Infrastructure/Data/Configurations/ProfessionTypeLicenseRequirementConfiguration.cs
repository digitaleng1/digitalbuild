using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProfessionTypeLicenseRequirementConfiguration : IEntityTypeConfiguration<ProfessionTypeLicenseRequirement>
{
    public void Configure(EntityTypeBuilder<ProfessionTypeLicenseRequirement> builder)
    {
        builder.ToTable("ProfessionTypeLicenseRequirements");

        builder.HasKey(lr => lr.Id);

        builder.Property(lr => lr.ProfessionTypeId)
            .IsRequired();

        builder.Property(lr => lr.LicenseTypeId)
            .IsRequired();

        builder.Property(lr => lr.IsRequired)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(lr => lr.Notes)
            .HasMaxLength(500);

        builder.HasOne(lr => lr.ProfessionType)
            .WithMany(pt => pt.LicenseRequirements)
            .HasForeignKey(lr => lr.ProfessionTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(lr => lr.LicenseType)
            .WithMany(lt => lt.ProfessionTypeLicenseRequirements)
            .HasForeignKey(lr => lr.LicenseTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(lr => lr.ProfessionTypeId);
        builder.HasIndex(lr => lr.LicenseTypeId);
        builder.HasIndex(lr => new { lr.ProfessionTypeId, lr.LicenseTypeId }).IsUnique();
    }
}
