using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DigitalEngineers.Infrastructure.Entities;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class TaskLabelConfiguration : IEntityTypeConfiguration<TaskLabel>
{
    public void Configure(EntityTypeBuilder<TaskLabel> builder)
    {
        builder.ToTable("TaskLabels");

        builder.HasKey(tl => tl.Id);

        builder.Property(tl => tl.CreatedAt)
            .IsRequired();

        // Unique constraint
        builder.HasIndex(tl => new { tl.TaskId, tl.LabelId })
            .IsUnique()
            .HasDatabaseName("UX_TaskLabels_TaskId_LabelId");

        // Relationships
        builder.HasOne(tl => tl.Task)
            .WithMany(t => t.TaskLabels)
            .HasForeignKey(tl => tl.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tl => tl.Label)
            .WithMany(ptLabel => ptLabel.TaskLabels)
            .HasForeignKey(tl => tl.LabelId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
