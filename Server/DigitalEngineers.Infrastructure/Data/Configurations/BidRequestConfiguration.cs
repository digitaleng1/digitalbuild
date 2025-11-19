using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class BidRequestConfiguration : IEntityTypeConfiguration<BidRequest>
{
    public void Configure(EntityTypeBuilder<BidRequest> builder)
    {
        builder.ToTable("BidRequests");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.ProjectId).IsRequired();
        builder.Property(e => e.SpecialistId).IsRequired();
        builder.Property(e => e.Title).HasMaxLength(300).IsRequired();
        builder.Property(e => e.Description).HasMaxLength(2000).IsRequired();
        builder.Property(e => e.Status).IsRequired();
        builder.Property(e => e.ProposedBudget).HasPrecision(18, 2).IsRequired();
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.UpdatedAt).IsRequired();

        builder.HasOne(e => e.Project)
            .WithMany(p => p.BidRequests)
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Specialist)
            .WithMany()
            .HasForeignKey(e => e.SpecialistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Response)
            .WithOne(r => r.BidRequest)
            .HasForeignKey<BidResponse>(r => r.BidRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Messages)
            .WithOne(m => m.BidRequest)
            .HasForeignKey(m => m.BidRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.ProjectId);
        builder.HasIndex(e => e.SpecialistId);
        builder.HasIndex(e => e.Status);
    }
}
