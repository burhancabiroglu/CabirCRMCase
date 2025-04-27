using CabirCRM.Application.Interfaces;
using CabirCRM.Domain.Entities;
using CabirCRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CabirCRM.Infrastructure.Repositories;

public class UserRepository(ApplicationDbContext context) : IUserRepository
{
    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await context.Users.FindAsync(id);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await context.Users.ToListAsync();
    }

    public async Task AddAsync(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(User user)
    {
        context.Users.Remove(user);
        await context.SaveChangesAsync();
    }
}