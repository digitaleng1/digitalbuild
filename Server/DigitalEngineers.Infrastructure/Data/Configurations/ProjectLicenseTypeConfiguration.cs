using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProjectLicenseTypeConfiguration : IEntityTypeConfiguration<ProjectLicenseType>
{
    public void Configure(EntityTypeBuilder<ProjectLicenseType> builder)
    {
        builder.ToTable("ProjectLicenseTypes");
        builder.HasKey(plt => new { plt.ProjectId, plt.LicenseTypeId });
        
        builder.HasOne(plt => plt.Project)
            .WithMany(p => p.ProjectLicenseTypes)
            .HasForeignKey(plt => plt.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasOne(plt => plt.LicenseType)
            .WithMany()
            .HasForeignKey(plt => plt.LicenseTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
