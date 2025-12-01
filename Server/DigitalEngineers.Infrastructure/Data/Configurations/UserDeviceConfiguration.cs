using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class UserDeviceConfiguration : IEntityTypeConfiguration<UserDevice>
{
    public void Configure(EntityTypeBuilder<UserDevice> builder)
    {
        builder.ToTable("UserDevices");
        
        builder.HasKey(d => d.Id);
        
        builder.Property(d => d.UserId).IsRequired().HasMaxLength(450);
        builder.Property(d => d.FcmToken).IsRequired().HasMaxLength(500);
        builder.Property(d => d.DeviceType).HasMaxLength(50);
        builder.Property(d => d.DeviceName).HasMaxLength(200);
        builder.Property(d => d.UserAgent).HasMaxLength(500);
        builder.Property(d => d.CreatedAt).HasDefaultValueSql("NOW()");
        builder.Property(d => d.IsActive).HasDefaultValue(true);
        
        builder.HasOne(d => d.User)
            .WithMany()
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasIndex(d => d.UserId);
        builder.HasIndex(d => new { d.UserId, d.FcmToken }).IsUnique();
        builder.HasIndex(d => d.IsActive);
    }
}
