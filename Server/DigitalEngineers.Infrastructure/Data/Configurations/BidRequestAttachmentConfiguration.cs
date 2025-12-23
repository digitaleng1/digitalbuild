using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class BidRequestAttachmentConfiguration : IEntityTypeConfiguration<BidRequestAttachment>
{
    public void Configure(EntityTypeBuilder<BidRequestAttachment> builder)
    {
        builder.ToTable("BidRequestAttachments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.FileSize)
            .IsRequired();

        builder.Property(x => x.FileType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.S3Key)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.UploadedAt)
            .IsRequired();

        builder.Property(x => x.UploadedByUserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.HasOne(x => x.BidRequest)
            .WithMany(x => x.Attachments)
            .HasForeignKey(x => x.BidRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.UploadedByUser)
            .WithMany()
            .HasForeignKey(x => x.UploadedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.BidRequestId);
    }
}
