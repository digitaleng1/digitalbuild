using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class LicenseTypeConfiguration : IEntityTypeConfiguration<LicenseType>
{
    public void Configure(EntityTypeBuilder<LicenseType> builder)
    {
        builder.ToTable("LicenseTypes");
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Name)
            .HasMaxLength(200)
            .IsRequired();
        
        builder.Property(e => e.Code)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(e => e.Description)
            .HasMaxLength(1000);
        
        builder.Property(e => e.IsStateSpecific)
            .IsRequired()
            .HasDefaultValue(false);
        
        builder.Property(e => e.IsApproved)
            .IsRequired()
            .HasDefaultValue(true);
        
        builder.Property(e => e.CreatedAt)
            .IsRequired();
        
        builder.Property(e => e.UpdatedAt)
            .IsRequired();
        
        builder.Property(e => e.RejectionReason)
            .HasMaxLength(1000);

        builder.HasOne(e => e.CreatedBy)
            .WithMany()
            .HasForeignKey(e => e.CreatedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(e => e.ProfessionTypeLicenseRequirements)
            .WithOne(lr => lr.LicenseType)
            .HasForeignKey(lr => lr.LicenseTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.Name);
        builder.HasIndex(e => e.Code).IsUnique();
        builder.HasIndex(e => e.IsApproved);
        builder.HasIndex(e => e.CreatedByUserId);
    }
}
