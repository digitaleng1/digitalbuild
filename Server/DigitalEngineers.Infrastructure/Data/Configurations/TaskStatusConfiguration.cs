using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

using ProjectTaskStatusEntity = Entities.ProjectTaskStatus;

public class ProjectTaskStatusConfiguration : IEntityTypeConfiguration<ProjectTaskStatusEntity>
{
    public void Configure(EntityTypeBuilder<ProjectTaskStatusEntity> builder)
    {
        builder.ToTable("ProjectTaskStatuses");

        builder.HasKey(ts => ts.Id);

        builder.Property(ts => ts.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(ts => ts.Color)
            .HasMaxLength(7);

        builder.Property(ts => ts.Order)
            .IsRequired();

        builder.Property(ts => ts.IsDefault)
            .IsRequired();

        builder.Property(ts => ts.IsCompleted)
            .IsRequired();

        builder.Property(ts => ts.CreatedAt)
            .IsRequired();

        builder.HasOne(ts => ts.Project)
            .WithMany()
            .HasForeignKey(ts => ts.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
