using System.Security.Claims;

namespace CabirCRM.API.Extensions;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy =>
                policy.RequireClaim(ClaimTypes.Role, "Admin"));

            options.AddPolicy("AdminOrStandard", policy =>
                policy.RequireClaim(ClaimTypes.Role, "Admin", "Standard"));
        });

        return services;
    }
}