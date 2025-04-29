using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CabirCRM.Application.DTOs;
using CabirCRM.Application.Interfaces;
using CabirCRM.Application.Requests.Users;
using CabirCRM.Application.Responses.Common;
using CabirCRM.Application.Responses.Users;
using CabirCRM.Application.Responses.Common;
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
            .FirstOrDefault(x => x.Email.Equals(request.Email, StringComparison.CurrentCultureIgnoreCase));

        if (existingUser != null)
        {
            logger.LogWarning(
                "Register attempt failed. Context: {Context}, Reason: {Email}, Email: {Email}",
                $"{nameof(UsersController)}.{nameof(Register)}",
                "Email already exists",
                request.Email
            );
            return Conflict(new { message = "Email already exists." });
        }
        
        existingUser = (await userRepository.GetAllAsync())
            .FirstOrDefault(x => x.Username.Equals(request.Username, StringComparison.CurrentCultureIgnoreCase));

        if (existingUser != null)
        {
            logger.LogWarning(
                "Register attempt failed. Context: {Context}, Reason: {Username}, Username: {Username}",
                $"{nameof(UsersController)}.{nameof(Register)}",
                "Username already exists",
                request.Username
            );
            return Conflict(new { message = "Username already exists." });
        }
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User(Guid.NewGuid(),request.Email ,request.Username, passwordHash, request.Role);
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
    public async Task<IActionResult> GetAll(
        [FromQuery] int pageNumber = 0,
        [FromQuery] int pageSize = 25)
    {
        var users = await userRepository.GetAllAsync();
        var result = users
            .Skip(pageNumber * pageSize)
            .Take(pageSize)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
                Email = u.Email
            })
            .ToList();

        logger.LogInformation(
            "Retrieved users list with pagination. Context: {Context}, PageNumber: {PageNumber}, PageSize: {PageSize}, RetrievedUsers: {UserCount}",
            $"{nameof(UsersController)}.{nameof(GetAll)}",
            pageNumber,
            pageSize,
            result.Count
        );

        var response = new PaginationResponse<UserDto>
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = users.Count(),
            Data = result
        };

        return Ok(response);
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
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
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
        var existingUser = users.FirstOrDefault(x => x.Email == request.Email);

        if (existingUser == null || !BCrypt.Net.BCrypt.Verify(request.Password, existingUser.PasswordHash))
        {
            logger.LogWarning(
                "Login attempt failed. Context: {Context}, Username: {Username}",
                $"{nameof(UsersController)}.{nameof(Login)}",
                request.Email
            );
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var token = tokenService.GenerateToken(existingUser.Id, existingUser.Username, existingUser.Role.ToString());

        var jwtSettings = configuration.GetSection("JwtSettings");
        var expiresInMinutes = int.Parse(jwtSettings["ExpiresInMinutes"] ?? "60");

        logger.LogInformation(
            "User login successful. Context: {Context}, Email: {Email}",
            $"{nameof(UsersController)}.{nameof(Login)}",
            request.Email
        );

        return Ok(new LoginResponse(
            Token: token,
            Expiration: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            User: new UserDto
            {
                Id = existingUser.Id,
                Username = existingUser.Username,
                Role = existingUser.Role,
                CreatedAt = existingUser.CreatedAt,
                UpdatedAt = existingUser.UpdatedAt,
                Email =  existingUser.Email
            }
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
            UpdatedAt = user.UpdatedAt,
            Email = user.Email
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
                user.Role
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
    
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await userRepository.GetByIdAsync(id);

        if (user == null)
        {
            logger.LogWarning(
                "Delete failed. Context: {Context}, Reason: {Reason}, UserId: {UserId}",
                $"{nameof(UsersController)}.{nameof(Delete)}",
                "User not found",
                id
            );
            return NotFound(new { message = "User not found." });
        }

        await userRepository.DeleteAsync(user);

        logger.LogInformation(
            "User deleted successfully. Context: {Context}, UserId: {UserId}",
            $"{nameof(UsersController)}.{nameof(Delete)}",
            user.Id
        );

        return NoContent();
    }
}