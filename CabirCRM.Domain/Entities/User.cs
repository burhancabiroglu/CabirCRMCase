using CabirCRM.Domain.Enums;

namespace CabirCRM.Domain.Entities;

public class User(Guid id,string email, string username, string passwordHash, Role role)
{
    public Guid Id { get; private set; } = id;
    public string Email { get; private set; } = email;
    public string Username { get; private set; } = username;
    public string PasswordHash { get; private set; } = passwordHash;
    public Role Role { get; private set; } = role;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    public void Update(string username, string passwordHash, Role role)
    {
        Username = username;
        PasswordHash = passwordHash;
        Role = role;
        UpdatedAt = DateTime.UtcNow;
    }
    
}