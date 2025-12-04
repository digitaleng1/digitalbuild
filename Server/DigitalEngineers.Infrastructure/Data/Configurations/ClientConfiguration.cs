using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ClientConfiguration : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.ToTable("Clients");
        
        builder.HasKey(c => c.Id);
        
        // 1:1 relationship with ApplicationUser
        builder.HasOne(c => c.User)
            .WithOne()
            .HasForeignKey<Client>(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Company Info
        builder.Property(c => c.CompanyName)
            .HasMaxLength(100);
        
        builder.Property(c => c.Industry)
            .HasMaxLength(50);
        
        builder.Property(c => c.Website)
            .HasMaxLength(200);
        
        builder.Property(c => c.CompanyDescription)
            .HasMaxLength(500);
        
        // Timestamps
        builder.Property(c => c.CreatedAt)
            .IsRequired();
        
        builder.Property(c => c.UpdatedAt)
            .IsRequired();
        
        // Relationships
        builder.HasMany(c => c.Projects)
            .WithOne(p => p.ClientEntity)
            .HasForeignKey(p => p.ClientEntityId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
