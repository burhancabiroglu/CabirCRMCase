

using System.Net;
using System.Text.Json;
using FluentValidation;

namespace CabirCRM.API.Middlewares;

public class ValidationExceptionMiddleware(RequestDelegate next)
{
    private readonly JsonSerializerOptions _options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

            var errorDetails = new
            {
                status = (int)HttpStatusCode.BadRequest,
                error = "Bad Request",
                message = "Validation Failed",
                path = context.Request.Path.Value,
                timestamp = DateTime.UtcNow,
                errors = ex.Errors.Select(e => new
                {
                    field = e.PropertyName,
                    message = e.ErrorMessage
                }).ToArray()
            };
            var json = JsonSerializer.Serialize(errorDetails, _options);
            await context.Response.WriteAsync(json);
        }
    }
}