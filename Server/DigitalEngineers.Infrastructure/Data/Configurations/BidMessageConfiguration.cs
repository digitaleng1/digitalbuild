using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class BidMessageConfiguration : IEntityTypeConfiguration<BidMessage>
{
    public void Configure(EntityTypeBuilder<BidMessage> builder)
    {
        builder.ToTable("BidMessages");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.BidRequestId).IsRequired();
        builder.Property(e => e.SenderId).HasMaxLength(450).IsRequired();
        builder.Property(e => e.MessageText).HasMaxLength(2000).IsRequired();
        builder.Property(e => e.CreatedAt).IsRequired();

        builder.HasOne(e => e.BidRequest)
            .WithMany(r => r.Messages)
            .HasForeignKey(e => e.BidRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.BidRequestId);
        builder.HasIndex(e => e.CreatedAt);
    }
}
