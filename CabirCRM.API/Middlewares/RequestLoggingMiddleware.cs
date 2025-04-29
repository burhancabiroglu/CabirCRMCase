using System.Diagnostics;
using System.Text.Json;

namespace CabirCRM.API.Middlewares;

public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    private readonly JsonSerializerOptions _options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        var request = context.Request;

        await next(context);

        stopwatch.Stop();

        var logEntry = new
        {
            timestamp = DateTime.UtcNow.ToString("o"),
            method = request.Method,
            path = request.Path,
            queryString = request.QueryString.HasValue ? request.QueryString.Value : null,
            statusCode = context.Response.StatusCode,
            durationMs = stopwatch.ElapsedMilliseconds
        };
        
        var json = JsonSerializer.Serialize(logEntry, _options);
        logger.LogInformation(json);
    }
}