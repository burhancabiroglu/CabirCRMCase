using CabirCRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CabirCRM.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.Role).HasConversion<string>();
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<Customer>(entity => { entity.HasIndex(e => e.Email).IsUnique(); });
    }

    public static void SeedManually(ApplicationDbContext context)
    {
        context.Database.ExecuteSqlRaw("""
                                           INSERT INTO "Customers" ("Id", "FirstName", "LastName", "Email", "Region", "RegistrationDate")
                                           VALUES 
                                           ('22222222-2222-2222-2222-222222222221', 'John', 'Doe', 'john.doe@example.com', 'North America', '2023-06-15'),
                                           ('22222222-2222-2222-2222-222222222222', 'Jane', 'Smith', 'jane.smith@example.com', 'Europe', '2023-05-10'),
                                           ('22222222-2222-2222-2222-222222222223', 'Carlos', 'Gomez', 'carlos.gomez@example.com', 'South America', '2023-07-22');
                                       """);
    }
}