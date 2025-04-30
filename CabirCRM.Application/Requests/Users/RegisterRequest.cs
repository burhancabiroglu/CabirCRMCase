using CabirCRM.Domain.Enums;

namespace CabirCRM.Application.Requests.Users;

public record RegisterRequest(
    string Email,
    string Username,
    string Password,
    Role Role
);