using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.ProjectId).IsRequired();
        builder.Property(e => e.ClientId).HasMaxLength(450).IsRequired();
        builder.Property(e => e.SpecialistId).IsRequired();
        builder.Property(e => e.Rating).IsRequired();
        builder.Property(e => e.Comment).HasMaxLength(2000).IsRequired();
        builder.Property(e => e.CreatedAt).IsRequired();

        builder.HasOne(e => e.Project)
            .WithMany(p => p.Reviews)
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Specialist)
            .WithMany(s => s.Reviews)
            .HasForeignKey(e => e.SpecialistId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Client)
            .WithMany()
            .HasForeignKey(e => e.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.ProjectId);
        builder.HasIndex(e => e.SpecialistId);
        builder.HasIndex(e => e.ClientId);
    }
}
