using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Name).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Description).HasMaxLength(5000).IsRequired();
        builder.Property(e => e.Status).IsRequired();
        builder.Property(e => e.ClientId).HasMaxLength(450).IsRequired();
        builder.Property(e => e.StreetAddress).HasMaxLength(300).IsRequired();
        builder.Property(e => e.City).HasMaxLength(100).IsRequired();
        builder.Property(e => e.State).HasMaxLength(2).IsRequired();
        builder.Property(e => e.ZipCode).HasMaxLength(10).IsRequired();
        builder.Property(e => e.ProjectScope).IsRequired();
        builder.Property(e => e.ThumbnailUrl).HasMaxLength(1000);
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.UpdatedAt).IsRequired();
        
        builder.Property(e => e.QuotedAmount).HasPrecision(18, 2);
        builder.Property(e => e.QuoteNotes).HasMaxLength(1000);
        
        builder.HasOne(e => e.Client)
            .WithMany()
            .HasForeignKey(e => e.ClientId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasMany(e => e.ProjectProfessionTypes)
            .WithOne(e => e.Project)
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(e => e.Files)
            .WithOne(e => e.Project)
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(e => e.AssignedSpecialists)
            .WithOne(e => e.Project)
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
