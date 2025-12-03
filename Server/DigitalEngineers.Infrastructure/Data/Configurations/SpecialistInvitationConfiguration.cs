using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class SpecialistInvitationConfiguration : IEntityTypeConfiguration<SpecialistInvitation>
{
    public void Configure(EntityTypeBuilder<SpecialistInvitation> builder)
    {
        builder.ToTable("SpecialistInvitations");

        builder.HasKey(si => si.Id);

        builder.Property(si => si.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(si => si.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(si => si.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(si => si.GeneratedPassword)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(si => si.InvitationToken)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(si => si.CustomMessage)
            .HasMaxLength(1000);

        builder.Property(si => si.InvitedByUserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(si => si.CreatedSpecialistUserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(si => si.IsUsed)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(si => si.CreatedAt)
            .IsRequired();

        builder.Property(si => si.ExpiresAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(si => si.InvitationToken)
            .IsUnique();

        builder.HasIndex(si => si.Email);

        builder.HasIndex(si => si.IsUsed);

        builder.HasIndex(si => si.CreatedAt);

        // Relationships
        builder.HasOne(si => si.LicenseType)
            .WithMany()
            .HasForeignKey(si => si.LicenseTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(si => si.InvitedByUser)
            .WithMany()
            .HasForeignKey(si => si.InvitedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(si => si.CreatedSpecialistUser)
            .WithMany()
            .HasForeignKey(si => si.CreatedSpecialistUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
