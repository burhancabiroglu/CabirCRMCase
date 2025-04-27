using CabirCRM.Application.Interfaces;
using CabirCRM.Domain.Entities;
using CabirCRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CabirCRM.Infrastructure.Repositories;

public class CustomerRepository(ApplicationDbContext context) : ICustomerRepository
{
    public async Task<Customer?> GetByIdAsync(Guid id)
    {
        return await context.Customers.FindAsync(id);
    }

    public async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await context.Customers.ToListAsync();
    }

    public async Task AddAsync(Customer customer)
    {
        await context.Customers.AddAsync(customer);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Customer customer)
    {
        context.Customers.Update(customer);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Customer customer)
    {
        context.Customers.Remove(customer);
        await context.SaveChangesAsync();
    }
}