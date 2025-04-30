namespace CabirCRM.Application.Requests.Users;

public record LoginRequest(
    string Email,
    string Password
);