using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class PortfolioItemConfiguration : IEntityTypeConfiguration<PortfolioItem>
{
    public void Configure(EntityTypeBuilder<PortfolioItem> builder)
    {
        builder.ToTable("PortfolioItems");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.SpecialistId).IsRequired();
        builder.Property(e => e.Title).HasMaxLength(300).IsRequired();
        builder.Property(e => e.Description).HasMaxLength(2000).IsRequired();
        builder.Property(e => e.ThumbnailUrl).HasMaxLength(1000);
        builder.Property(e => e.ProjectUrl).HasMaxLength(500);
        builder.Property(e => e.CreatedAt).IsRequired();
        
        builder.HasOne(e => e.Specialist)
            .WithMany(s => s.Portfolio)
            .HasForeignKey(e => e.SpecialistId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasIndex(e => e.SpecialistId);
    }
}
