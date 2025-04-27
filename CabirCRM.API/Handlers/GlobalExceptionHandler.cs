using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;

namespace CabirCRM.API.Handlers;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    private readonly JsonSerializerOptions _options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };
    
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Unhandled exception occurred.");

        httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        httpContext.Response.ContentType = "application/problem+json";

        var problemDetails = new
        {
            title = "An unexpected error occurred.",
            status = httpContext.Response.StatusCode,
            detail = exception.Message,
        };

        var json = JsonSerializer.Serialize(problemDetails, _options);

        await httpContext.Response.WriteAsync(json, cancellationToken);

        return true; // Exception handled
    }
}