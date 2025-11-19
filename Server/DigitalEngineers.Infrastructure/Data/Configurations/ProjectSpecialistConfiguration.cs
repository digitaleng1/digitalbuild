using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalEngineers.Infrastructure.Data.Configurations;

public class ProjectSpecialistConfiguration : IEntityTypeConfiguration<ProjectSpecialist>
{
    public void Configure(EntityTypeBuilder<ProjectSpecialist> builder)
    {
        builder.ToTable("ProjectSpecialists");
        builder.HasKey(ps => new { ps.ProjectId, ps.SpecialistId });
        
        builder.Property(e => e.AssignedAt).IsRequired();
        builder.Property(e => e.Role).HasMaxLength(100);
        
        builder.HasOne(ps => ps.Project)
            .WithMany(p => p.AssignedSpecialists)
            .HasForeignKey(ps => ps.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasOne(ps => ps.Specialist)
            .WithMany(s => s.AssignedProjects)
            .HasForeignKey(ps => ps.SpecialistId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
