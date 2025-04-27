namespace CabirCRM.Application.DTOs;

public class CustomerDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Region { get; set; } = "";
    public DateTime RegistrationDate { get; set; }
}