using System.Net;
using System.Text.Json;

namespace CabirCRM.API.Middlewares;

public class GlobalExceptionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var errorDetails = new
            {
                status = (int)HttpStatusCode.InternalServerError,
                error = "Internal Server Error",
                message = ex.Message,
                path = context.Request.Path.Value,
                timestamp = DateTime.UtcNow
            };

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };

            var json = JsonSerializer.Serialize(errorDetails, options);
            await context.Response.WriteAsync(json);
        }
    }
}