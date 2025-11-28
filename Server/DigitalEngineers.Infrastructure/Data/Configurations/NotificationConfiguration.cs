using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notifications");
        
        builder.HasKey(n => n.Id);
        
        builder.Property(n => n.Type).IsRequired();
        builder.Property(n => n.SubType).IsRequired();
        builder.Property(n => n.Title).IsRequired().HasMaxLength(200);
        builder.Property(n => n.Body).IsRequired().HasMaxLength(1000);
        builder.Property(n => n.AdditionalData).HasColumnType("text");
        
        builder.Property(n => n.SenderId).HasMaxLength(450);
        builder.Property(n => n.ReceiverId).IsRequired().HasMaxLength(450);
        
        builder.Property(n => n.IsDelivered).HasDefaultValue(false);
        builder.Property(n => n.IsRead).HasDefaultValue(false);
        builder.Property(n => n.CreatedAt).HasDefaultValueSql("NOW()");
        
        builder.HasOne(n => n.Sender)
            .WithMany()
            .HasForeignKey(n => n.SenderId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);
        
        builder.HasOne(n => n.Receiver)
            .WithMany()
            .HasForeignKey(n => n.ReceiverId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasIndex(n => n.ReceiverId);
        builder.HasIndex(n => new { n.ReceiverId, n.IsRead });
        builder.HasIndex(n => n.CreatedAt);
    }
}
