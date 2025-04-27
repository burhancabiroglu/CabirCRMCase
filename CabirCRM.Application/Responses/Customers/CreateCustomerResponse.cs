namespace CabirCRM.Application.Responses.Customers;

public record CreateCustomerResponse(
     Guid Id,
     string FullName
);