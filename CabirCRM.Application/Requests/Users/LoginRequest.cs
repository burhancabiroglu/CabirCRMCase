namespace CabirCRM.Application.Requests.Users;

public record LoginRequest(
    string Username,
    string Password
);