using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProjectProfessionTypeConfiguration : IEntityTypeConfiguration<ProjectProfessionType>
{
    public void Configure(EntityTypeBuilder<ProjectProfessionType> builder)
    {
        builder.ToTable("ProjectProfessionTypes");
        builder.HasKey(ppt => new { ppt.ProjectId, ppt.ProfessionTypeId });
        
        builder.HasOne(ppt => ppt.Project)
            .WithMany(p => p.ProjectProfessionTypes)
            .HasForeignKey(ppt => ppt.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasOne(ppt => ppt.ProfessionType)
            .WithMany()
            .HasForeignKey(ppt => ppt.ProfessionTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
