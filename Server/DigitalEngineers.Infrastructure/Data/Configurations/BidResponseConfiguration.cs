using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class BidResponseConfiguration : IEntityTypeConfiguration<BidResponse>
{
    public void Configure(EntityTypeBuilder<BidResponse> builder)
    {
        builder.ToTable("BidResponses");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.BidRequestId).IsRequired();
        builder.Property(e => e.SpecialistId).IsRequired();
        builder.Property(e => e.CoverLetter).HasMaxLength(2000).IsRequired();
        builder.Property(e => e.ProposedPrice).HasPrecision(18, 2).IsRequired();
        builder.Property(e => e.EstimatedDays).IsRequired();
        builder.Property(e => e.RejectionReason).HasMaxLength(500);
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.UpdatedAt).IsRequired();

        builder.HasOne(e => e.Specialist)
            .WithMany()
            .HasForeignKey(e => e.SpecialistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.BidRequestId).IsUnique();
        builder.HasIndex(e => e.SpecialistId);
    }
}
