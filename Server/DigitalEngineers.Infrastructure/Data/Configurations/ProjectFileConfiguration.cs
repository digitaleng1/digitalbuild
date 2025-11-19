using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProjectFileConfiguration : IEntityTypeConfiguration<ProjectFile>
{
    public void Configure(EntityTypeBuilder<ProjectFile> builder)
    {
        builder.ToTable("ProjectFiles");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.ProjectId).IsRequired();
        builder.Property(e => e.FileName).HasMaxLength(500).IsRequired();
        builder.Property(e => e.FileUrl).HasMaxLength(1000).IsRequired();
        builder.Property(e => e.FileSize).IsRequired();
        builder.Property(e => e.ContentType).HasMaxLength(200).IsRequired();
        builder.Property(e => e.UploadedAt).IsRequired();
        builder.Property(e => e.UploadedBy).HasMaxLength(450).IsRequired();
        
        builder.HasOne(e => e.Project)
            .WithMany(e => e.Files)
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasIndex(e => e.ProjectId);
    }
}
