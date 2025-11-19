using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DigitalEngineers.Infrastructure.Entities;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProjectTaskLabelConfiguration : IEntityTypeConfiguration<ProjectTaskLabel>
{
    public void Configure(EntityTypeBuilder<ProjectTaskLabel> builder)
    {
        builder.ToTable("ProjectTaskLabels");

        builder.HasKey(tl => tl.Id);

        builder.Property(tl => tl.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(tl => tl.Color)
            .IsRequired()
            .HasMaxLength(7);

        builder.Property(tl => tl.CreatedAt)
            .IsRequired();

        // Unique constraint
        builder.HasIndex(tl => new { tl.Name, tl.ProjectId })
            .IsUnique()
            .HasDatabaseName("UX_ProjectTaskLabels_Name_ProjectId");

        // Relationships
        builder.HasOne(tl => tl.Project)
            .WithMany()
            .HasForeignKey(tl => tl.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
