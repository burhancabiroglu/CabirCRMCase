using CabirCRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CabirCRM.API.Extensions;

public static class MigrationExtensions
{
    public static void ApplyMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.Migrate();
        if (!dbContext.Customers.Any())
        {
            ApplicationDbContext.SeedManually(dbContext);
        }
        
    }
}