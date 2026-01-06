using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class CommentMentionConfiguration : IEntityTypeConfiguration<CommentMention>
{
    public void Configure(EntityTypeBuilder<CommentMention> builder)
    {
        builder.ToTable("CommentMentions");

        builder.HasKey(cm => cm.Id);

        builder.Property(cm => cm.CommentId)
            .IsRequired();

        builder.Property(cm => cm.MentionedUserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(cm => cm.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");

        // Relationships
        builder.HasOne(cm => cm.Comment)
            .WithMany(c => c.Mentions)
            .HasForeignKey(cm => cm.CommentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cm => cm.MentionedUser)
            .WithMany()
            .HasForeignKey(cm => cm.MentionedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(cm => cm.CommentId);
        builder.HasIndex(cm => cm.MentionedUserId);
    }
}
