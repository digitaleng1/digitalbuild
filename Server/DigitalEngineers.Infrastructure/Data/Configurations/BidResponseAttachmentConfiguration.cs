using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class BidResponseAttachmentConfiguration : IEntityTypeConfiguration<BidResponseAttachment>
{
    public void Configure(EntityTypeBuilder<BidResponseAttachment> builder)
    {
        builder.ToTable("BidResponseAttachments");
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.BidResponseId).IsRequired();
        builder.Property(e => e.FileName).HasMaxLength(255).IsRequired();
        builder.Property(e => e.FileSize).IsRequired();
        builder.Property(e => e.FileType).HasMaxLength(100).IsRequired();
        builder.Property(e => e.S3Key).HasMaxLength(500).IsRequired();
        builder.Property(e => e.UploadedAt).IsRequired();
        builder.Property(e => e.UploadedByUserId).HasMaxLength(450).IsRequired();
        builder.Property(e => e.Description).HasMaxLength(500);

        builder.HasOne(e => e.BidResponse)
            .WithMany(br => br.Attachments)
            .HasForeignKey(e => e.BidResponseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.UploadedByUser)
            .WithMany()
            .HasForeignKey(e => e.UploadedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.BidResponseId);
        builder.HasIndex(e => e.UploadedByUserId);
    }
}
