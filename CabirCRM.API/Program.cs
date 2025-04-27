using CabirCRM.API.Extensions;
using CabirCRM.API.Middlewares;
using CabirCRM.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddCustomJsonOptions()
    .AddCustomValidation();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthorizationPolicies();

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<ValidationExceptionMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.ApplyMigrations();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.MapOpenApi();
}

app.UseAuthorization();
app.MapControllers();
app.Run();