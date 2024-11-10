using ClancySafeAI.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClancySafeAI.Infrastructure.Data;

/// <summary>
/// Entity Framework database context for the ClancySafeAI application
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PhoneNumber).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.Property(e => e.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20);
            
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.CompanyName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.JobTitle)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");
        });
    }
} 