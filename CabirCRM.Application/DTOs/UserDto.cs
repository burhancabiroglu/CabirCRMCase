using CabirCRM.Domain.Enums;

namespace CabirCRM.Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = "";
    public string Email { get; set; } = "";
    public Role Role { get; set; } = Role.Standard;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}