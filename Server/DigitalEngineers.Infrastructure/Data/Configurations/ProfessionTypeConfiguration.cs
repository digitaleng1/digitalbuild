using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProfessionTypeConfiguration : IEntityTypeConfiguration<ProfessionType>
{
    public void Configure(EntityTypeBuilder<ProfessionType> builder)
    {
        builder.ToTable("ProfessionTypes");

        builder.HasKey(pt => pt.Id);

        builder.Property(pt => pt.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(pt => pt.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(pt => pt.Description)
            .HasMaxLength(1000);

        builder.Property(pt => pt.ProfessionId)
            .IsRequired();

        builder.Property(pt => pt.RequiresStateLicense)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(pt => pt.DisplayOrder)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(pt => pt.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(pt => pt.IsApproved)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(pt => pt.CreatedAt)
            .IsRequired();

        builder.Property(pt => pt.UpdatedAt)
            .IsRequired();

        builder.Property(pt => pt.RejectionReason)
            .HasMaxLength(1000);

        builder.HasOne(pt => pt.Profession)
            .WithMany(p => p.ProfessionTypes)
            .HasForeignKey(pt => pt.ProfessionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pt => pt.CreatedBy)
            .WithMany()
            .HasForeignKey(pt => pt.CreatedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(pt => pt.LicenseRequirements)
            .WithOne(lr => lr.ProfessionType)
            .HasForeignKey(lr => lr.ProfessionTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(pt => pt.Name);
        builder.HasIndex(pt => pt.Code);
        builder.HasIndex(pt => pt.ProfessionId);
        builder.HasIndex(pt => pt.IsApproved);
        builder.HasIndex(pt => pt.IsActive);
        builder.HasIndex(pt => new { pt.ProfessionId, pt.Code }).IsUnique();
    }
}
