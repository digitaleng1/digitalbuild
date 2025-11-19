using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DigitalEngineers.Infrastructure.Entities;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class TaskLabelAssignmentConfiguration : IEntityTypeConfiguration<TaskLabelAssignment>
{
    public void Configure(EntityTypeBuilder<TaskLabelAssignment> builder)
    {
        builder.ToTable("TaskLabelAssignments");

        builder.HasKey(tla => tla.Id);

        builder.Property(tla => tla.CreatedAt)
            .IsRequired();

        // Unique constraint
        builder.HasIndex(tla => new { tla.TaskId, tla.LabelId })
            .IsUnique()
            .HasDatabaseName("UX_TaskLabelAssignments_TaskId_LabelId");

        // Relationships
        builder.HasOne(tla => tla.Task)
            .WithMany(t => t.LabelAssignments)
            .HasForeignKey(tla => tla.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tla => tla.Label)
            .WithMany(tl => tl.TaskAssignments)
            .HasForeignKey(tla => tla.LabelId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
