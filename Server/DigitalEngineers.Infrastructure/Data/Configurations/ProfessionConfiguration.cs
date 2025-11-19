using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProfessionConfiguration : IEntityTypeConfiguration<Profession>
{
    public void Configure(EntityTypeBuilder<Profession> builder)
    {
        builder.ToTable("Professions");
        builder.Property(e => e.Description).HasMaxLength(500);
        builder.HasMany(e => e.LicenseTypes)
              .WithOne(e => e.Profession)
              .HasForeignKey(e => e.ProfessionId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
