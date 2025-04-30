using CabirCRM.Application.DTOs;
using CabirCRM.Application.Interfaces;
using CabirCRM.Application.Requests.Customers;
using CabirCRM.Application.Responses.Customers;
using CabirCRM.Application.Responses.Common;
using CabirCRM.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CabirCRM.API.Controllers;

[Route("api/[controller]")]
[Authorize(Policy = "AdminOrStandard")]
[ApiController]
public class CustomersController(
    ICustomerRepository customerRepository,
    ILogger<CustomersController> logger
    ) : ControllerBase
{
    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request)
    {
        var customer = new Customer(Guid.NewGuid(), request.FirstName, request.LastName, request.Email, request.Region);
        await customerRepository.AddAsync(customer);

        var response = new CreateCustomerResponse(customer.Id, $"{customer.FirstName} {customer.LastName}");

        logger.LogInformation(
            "Customer created successfully. Context: {Context}, CustomerId: {CustomerId}, Email: {Email}",
            $"{nameof(CustomersController)}.{nameof(Create)}",
            customer.Id,
            customer.Email
        );

        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? firstName,
        [FromQuery] string? lastName,
        [FromQuery] string? email,
        [FromQuery] DateTime? registrationDate,
        [FromQuery] string? region,
        [FromQuery] int pageNumber = 0,
        [FromQuery] int pageSize = 25)
    {
        var customers = await customerRepository.GetAllAsync();

        var filteredCustomers = customers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(firstName))
            filteredCustomers = filteredCustomers.Where(c => c.FirstName.Contains(firstName, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(lastName))
            filteredCustomers = filteredCustomers.Where(c => c.LastName.Contains(lastName, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(email))
            filteredCustomers = filteredCustomers.Where(c => c.Email.Contains(email, StringComparison.OrdinalIgnoreCase));

        if (registrationDate.HasValue)
            filteredCustomers = filteredCustomers.Where(c => c.RegistrationDate.Date < registrationDate.Value.Date);

        if (!string.IsNullOrWhiteSpace(region))
            filteredCustomers = filteredCustomers.Where(c => c.Region.Contains(region, StringComparison.OrdinalIgnoreCase));

        var result = filteredCustomers
            .Skip(pageNumber * pageSize)
            .Take(pageSize)
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                Region = c.Region,
                RegistrationDate = c.RegistrationDate
            }).ToList();

        var response = new PaginationResponse<CustomerDto>
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = filteredCustomers.Count(),
            Data = result
        };

        logger.LogInformation(
            "Retrieved customers list with optional filters and pagination. Context: {Context}, PageNumber: {PageNumber}, PageSize: {PageSize}, RetrievedCustomers: {CustomerCount}",
            $"{nameof(CustomersController)}.{nameof(GetAll)}",
            pageNumber,
            pageSize,
            result.Count
        );

        return Ok(response);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var customer = await customerRepository.GetByIdAsync(id);
        if (customer == null)
        {
            logger.LogWarning(
                "Customer not found. Context: {Context}, CustomerId: {CustomerId}",
                $"{nameof(CustomersController)}.{nameof(GetById)}",
                id
            );
            return NotFound();
        }

        var result = new CustomerDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            Region = customer.Region,
            RegistrationDate = customer.RegistrationDate
        };

        logger.LogInformation(
            "Retrieved customer by ID. Context: {Context}, CustomerId: {CustomerId}, Email: {Email}",
            $"{nameof(CustomersController)}.{nameof(GetById)}",
            result.Id,
            result.Email
        );

        return Ok(result);
    }
    
    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var customer = await customerRepository.GetByIdAsync(id);

        if (customer == null)
        {
            logger.LogWarning(
                "Delete failed. Context: {Context}, Reason: {Reason}, CustomerId: {CustomerId}",
                $"{nameof(CustomersController)}.{nameof(Delete)}",
                "Customer not found",
                id
            );
            return NotFound(new { message = "Customer not found." });
        }

        await customerRepository.DeleteAsync(customer);

        logger.LogInformation(
            "Customer deleted successfully. Context: {Context}, CustomerId: {CustomerId}",
            $"{nameof(CustomersController)}.{nameof(Delete)}",
            customer.Id
        );

        return NoContent();
    }
    
    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomerRequest request)
    {
        var customer = await customerRepository.GetByIdAsync(id);

        if (customer == null)
        {
            logger.LogWarning(
                "Update failed. Context: {Context}, Reason: {Reason}, CustomerId: {CustomerId}",
                $"{nameof(CustomersController)}.{nameof(Update)}",
                "Customer not found",
                id
            );
            return NotFound(new { message = "Customer not found." });
        }
        
        customer.Update(
            firstName: request.FirstName,
            lastName:request.LastName,
            email:request.Email,
            region:request.Region
        );

        await customerRepository.UpdateAsync(customer);

        logger.LogInformation(
            "Customer updated successfully. Context: {Context}, CustomerId: {CustomerId}",
            $"{nameof(CustomersController)}.{nameof(Update)}",
            customer.Id
        );

        return NoContent();
    }
}