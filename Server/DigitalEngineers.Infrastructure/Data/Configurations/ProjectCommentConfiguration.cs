using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DigitalEngineers.Infrastructure.Entities;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProjectCommentConfiguration : IEntityTypeConfiguration<ProjectComment>
{
    public void Configure(EntityTypeBuilder<ProjectComment> builder)
    {
        builder.ToTable("ProjectComments");

        builder.HasKey(pc => pc.Id);

        builder.Property(pc => pc.Content)
            .IsRequired()
            .HasMaxLength(int.MaxValue);

        builder.Property(pc => pc.CreatedAt)
            .IsRequired();

        builder.Property(pc => pc.IsEdited)
            .IsRequired();

        // Relationships
        builder.HasOne(pc => pc.Project)
            .WithMany(p => p.Comments)
            .HasForeignKey(pc => pc.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pc => pc.User)
            .WithMany()
            .HasForeignKey(pc => pc.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pc => pc.ParentComment)
            .WithMany(pc => pc.Replies)
            .HasForeignKey(pc => pc.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
