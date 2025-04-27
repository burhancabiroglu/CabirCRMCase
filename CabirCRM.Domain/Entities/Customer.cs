namespace CabirCRM.Domain.Entities;

public class Customer(Guid id, string firstName, string lastName, string email, string region)
{
    public Guid Id { get; private set; } = id;
    public string FirstName { get; private set; } = firstName;
    public string LastName { get; private set; } = lastName;
    public string Email { get; private set; } = email;
    public string Region { get; private set; } = region;
    public DateTime RegistrationDate { get; private set; } = DateTime.UtcNow;

    public void Update(string firstName, string lastName, string email, string region)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Region = region;
    }
    
}