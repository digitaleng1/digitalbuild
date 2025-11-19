using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DigitalEngineers.Infrastructure.Entities;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class TaskWatcherConfiguration : IEntityTypeConfiguration<TaskWatcher>
{
    public void Configure(EntityTypeBuilder<TaskWatcher> builder)
    {
        builder.ToTable("TaskWatchers");

        builder.HasKey(tw => tw.Id);

        builder.Property(tw => tw.CreatedAt)
            .IsRequired();

        // Unique constraint
        builder.HasIndex(tw => new { tw.TaskId, tw.UserId })
            .IsUnique()
            .HasDatabaseName("UX_TaskWatchers_TaskId_UserId");

        // Relationships
        builder.HasOne(tw => tw.Task)
            .WithMany(t => t.Watchers)
            .HasForeignKey(tw => tw.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tw => tw.User)
            .WithMany()
            .HasForeignKey(tw => tw.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
