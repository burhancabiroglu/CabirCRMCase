using CabirCRM.Domain.Enums;

namespace CabirCRM.Application.Requests.Users;

public record RegisterRequest(
    string Username,
    string Password,
    Role Role
);