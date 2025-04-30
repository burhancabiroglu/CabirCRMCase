using CabirCRM.Application.DTOs;
using CabirCRM.Domain.Entities;

namespace CabirCRM.Application.Responses.Users;

public record LoginResponse (
    string Token,
    DateTime Expiration,
    UserDto User
);