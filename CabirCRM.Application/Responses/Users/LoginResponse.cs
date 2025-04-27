namespace CabirCRM.Application.Responses.Users;

public record LoginResponse (
    string Token,
    DateTime Expiration
);