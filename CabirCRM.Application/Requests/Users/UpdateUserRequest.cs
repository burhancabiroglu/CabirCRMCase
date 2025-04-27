using CabirCRM.Domain.Enums;

namespace CabirCRM.Application.Requests.Users;

public record UpdateUserRequest(
    string Username,
    string Password,
    Role Role
);