using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProfessionConfiguration : IEntityTypeConfiguration<Profession>
{
    public void Configure(EntityTypeBuilder<Profession> builder)
    {
        builder.ToTable("Professions");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Description)
            .HasMaxLength(1000);

        builder.Property(p => p.DisplayOrder)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(p => p.IsApproved)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .IsRequired();

        builder.Property(p => p.RejectionReason)
            .HasMaxLength(1000);

        builder.HasOne(p => p.CreatedBy)
            .WithMany()
            .HasForeignKey(p => p.CreatedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(p => p.ProfessionTypes)
            .WithOne(pt => pt.Profession)
            .HasForeignKey(pt => pt.ProfessionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => p.Name);
        builder.HasIndex(p => p.Code).IsUnique();
        builder.HasIndex(p => p.IsApproved);
        builder.HasIndex(p => p.CreatedByUserId);
    }
}
