using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CabirCRM.Application.DTOs;
using CabirCRM.Application.Interfaces;
using CabirCRM.Application.Requests.Users;
using CabirCRM.Application.Responses.Users;
using CabirCRM.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CabirCRM.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(
    IUserRepository userRepository,
    ITokenService tokenService,
    IConfiguration configuration,
    ILogger<UsersController> logger
) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var existingUser = (await userRepository.GetAllAsync())
            .FirstOrDefault(x => x.Username.Equals(request.Username, StringComparison.CurrentCultureIgnoreCase));

        if (existingUser != null)
        {
            logger.LogWarning(
                "Register attempt failed. Context: {Context}, Reason: {Reason}, Username: {Username}",
                $"{nameof(UsersController)}.{nameof(Register)}",
                "Username already exists",
                request.Username
            );
            return Conflict(new { message = "Username already exists." });
        }
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User(Guid.NewGuid(), request.Username, passwordHash, request.Role);
        await userRepository.AddAsync(user);
        
        logger.LogInformation(
            "User registered successfully. Context: {Context}, UserId: {UserId}, Username: {Username}, Role: {Role}",
            $"{nameof(UsersController)}.{nameof(Register)}",
            user.Id,
            user.Username,
            user.Role.ToString()
        );

        var response = new RegisterResponse(user.Id, user.Username);
        
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await userRepository.GetAllAsync();
        var result = users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Role = u.Role,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();

        logger.LogInformation(
            "Retrieved users list. Context: {Context}, TotalUsers: {UserCount}",
            $"{nameof(UsersController)}.{nameof(GetAll)}",
            result.Count
        );

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user == null)
        {
            logger.LogWarning(
                "User not found. Context: {Context}, UserId: {UserId}",
                $"{nameof(UsersController)}.{nameof(GetById)}",
                id
            );
            return NotFound();
        }

        var result = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        logger.LogInformation(
            "Retrieved user details. Context: {Context}, UserId: {UserId}, Username: {Username}",
            $"{nameof(UsersController)}.{nameof(GetById)}",
            result.Id,
            result.Username
        );

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var users = await userRepository.GetAllAsync();
        var existingUser = users.FirstOrDefault(x => x.Username == request.Username);

        if (existingUser == null || !BCrypt.Net.BCrypt.Verify(request.Password, existingUser.PasswordHash))
        {
            logger.LogWarning(
                "Login attempt failed. Context: {Context}, Username: {Username}",
                $"{nameof(UsersController)}.{nameof(Login)}",
                request.Username
            );
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var token = tokenService.GenerateToken(existingUser.Id, existingUser.Username, existingUser.Role.ToString());

        var jwtSettings = configuration.GetSection("JwtSettings");
        var expiresInMinutes = int.Parse(jwtSettings["ExpiresInMinutes"] ?? "60");

        logger.LogInformation(
            "User login successful. Context: {Context}, Username: {Username}",
            $"{nameof(UsersController)}.{nameof(Login)}",
            request.Username
        );

        return Ok(new LoginResponse(
            Token: token,
            Expiration: DateTime.UtcNow.AddMinutes(expiresInMinutes)
        ));
    }
    
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)
                          ?? User.FindFirst(JwtRegisteredClaimNames.Sub);

        if (userIdClaim == null)
        {
            logger.LogWarning(
                "Current user retrieval failed. Context: {Context}, Reason: {Reason}",
                $"{nameof(UsersController)}.{nameof(GetCurrentUser)}",
                "Invalid token"
            );
            return Unauthorized(new { message = "Invalid token." });
        }

        if (!Guid.TryParse(userIdClaim.Value, out var userId))
        {
            logger.LogWarning(
                "Current user retrieval failed. Context: {Context}, Reason: {Reason}",
                $"{nameof(UsersController)}.{nameof(GetCurrentUser)}",
                "Invalid token"
            );
            return Unauthorized(new { message = "Invalid user id in token." });
        }

        var user = await userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            logger.LogWarning(
                "Current user not found. Context: {Context}, UserIdClaim: {UserIdClaim}",
                $"{nameof(UsersController)}.{nameof(GetCurrentUser)}",
                userIdClaim.Value
            );
            return NotFound(new { message = "User not found." });
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        logger.LogInformation(
            "Retrieved current user. Context: {Context}, UserId: {UserId}, Username: {Username}",
            $"{nameof(UsersController)}.{nameof(GetCurrentUser)}",
            userDto.Id,
            userDto.Username
        );

        return Ok(userDto);
    }
    
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        var user = await userRepository.GetByIdAsync(id);

        if (user == null)
        {
            logger.LogWarning(
                "Update failed. Context: {Context}, Reason: {Reason}, UserId: {UserId}",
                $"{nameof(UsersController)}.{nameof(Update)}",
                "User not found",
                id
            );
            return NotFound(new { message = "User not found." });
        }

        var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (currentUserRole == null)
        {
            logger.LogWarning(
                "Update failed. Context: {Context}, Reason: {Reason}",
                $"{nameof(UsersController)}.{nameof(Update)}",
                "Invalid token: Role missing"
            );
            return Unauthorized(new { message = "Invalid token: Role missing." });
        }

        if (currentUserRole != "Admin")
        {
            user.Update(
                request.Username,
                BCrypt.Net.BCrypt.HashPassword(request.Password),
                user.Role // eski role aynen kalıyor!
            );
        }
        else
        {
            user.Update(
                request.Username,
                BCrypt.Net.BCrypt.HashPassword(request.Password),
                request.Role
            );
        }

        await userRepository.UpdateAsync(user);

        logger.LogInformation(
            "User updated successfully. Context: {Context}, UserId: {UserId}, Username: {Username}",
            $"{nameof(UsersController)}.{nameof(Update)}",
            user.Id,
            user.Username
        );

        return NoContent();
    }
}