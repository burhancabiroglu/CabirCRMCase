namespace CabirCRM.Application.Requests.Customers;

public record CreateCustomerRequest(
     string FirstName,
     string LastName,
     string Email,
     string Region
);