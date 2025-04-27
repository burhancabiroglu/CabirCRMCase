namespace CabirCRM.Application.Requests.Customers;

public record UpdateCustomerRequest(
    string FirstName,
    string LastName,
    string Email,
    string Region
);