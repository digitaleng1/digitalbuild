using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DigitalEngineers.Infrastructure.Entities;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class TaskAuditLogConfiguration : IEntityTypeConfiguration<TaskAuditLog>
{
    public void Configure(EntityTypeBuilder<TaskAuditLog> builder)
    {
        builder.ToTable("TaskAuditLogs");

        builder.HasKey(tal => tal.Id);

        builder.Property(tal => tal.Action)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(tal => tal.FieldName)
            .HasMaxLength(100);

        builder.Property(tal => tal.OldValue)
            .HasMaxLength(int.MaxValue);

        builder.Property(tal => tal.NewValue)
            .HasMaxLength(int.MaxValue);

        builder.Property(tal => tal.CreatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(tal => tal.TaskId)
            .HasDatabaseName("IX_TaskAuditLogs_TaskId");

        builder.HasIndex(tal => tal.UserId)
            .HasDatabaseName("IX_TaskAuditLogs_UserId");

        builder.HasIndex(tal => tal.CreatedAt)
            .HasDatabaseName("IX_TaskAuditLogs_CreatedAt");

        // Relationships
        builder.HasOne(tal => tal.Task)
            .WithMany(t => t.AuditLogs)
            .HasForeignKey(tal => tal.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tal => tal.User)
            .WithMany()
            .HasForeignKey(tal => tal.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
