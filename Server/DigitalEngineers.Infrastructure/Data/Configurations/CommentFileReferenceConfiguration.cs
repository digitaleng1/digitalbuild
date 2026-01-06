using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class CommentFileReferenceConfiguration : IEntityTypeConfiguration<CommentFileReference>
{
    public void Configure(EntityTypeBuilder<CommentFileReference> builder)
    {
        builder.ToTable("CommentFileReferences");

        builder.HasKey(cfr => cfr.Id);

        builder.Property(cfr => cfr.CommentId)
            .IsRequired();

        builder.Property(cfr => cfr.ProjectFileId)
            .IsRequired();

        builder.Property(cfr => cfr.CreatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(cfr => cfr.Comment)
            .WithMany(c => c.FileReferences)
            .HasForeignKey(cfr => cfr.CommentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cfr => cfr.ProjectFile)
            .WithMany()
            .HasForeignKey(cfr => cfr.ProjectFileId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
