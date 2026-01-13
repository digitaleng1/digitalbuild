using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class SpecialistLicenseTypeConfiguration : IEntityTypeConfiguration<SpecialistLicenseType>
{
    public void Configure(EntityTypeBuilder<SpecialistLicenseType> builder)
    {
        builder.ToTable("SpecialistLicenseTypes");
        builder.HasKey(slt => new { slt.SpecialistId, slt.LicenseTypeId, slt.ProfessionTypeId });
        
        builder.Property(e => e.State).HasMaxLength(100);
        builder.Property(e => e.IssuingAuthority).HasMaxLength(200);
        builder.Property(e => e.LicenseNumber).HasMaxLength(100);
        builder.Property(e => e.LicenseFileUrl).HasMaxLength(1000);
        builder.Property(e => e.VerifiedBy).HasMaxLength(450);
        builder.Property(e => e.AdminComment).HasMaxLength(1000);
        builder.Property(e => e.Status).IsRequired();
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.UpdatedAt).IsRequired();
        
        builder.HasOne(slt => slt.Specialist)
            .WithMany(s => s.LicenseTypes)
            .HasForeignKey(slt => slt.SpecialistId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasOne(slt => slt.LicenseType)
            .WithMany()
            .HasForeignKey(slt => slt.LicenseTypeId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne(slt => slt.ProfessionType)
            .WithMany()
            .HasForeignKey(slt => slt.ProfessionTypeId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasIndex(e => e.Status);
    }
}
