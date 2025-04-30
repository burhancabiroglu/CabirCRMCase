using CabirCRM.API.Extensions;
using CabirCRM.API.Handlers;
using CabirCRM.API.Middlewares;
using CabirCRM.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddCustomJsonOptions()
    .AddCustomValidation();

builder.Services
    .AddInfrastructure(builder.Configuration)
    .AddJwtAuthentication(builder.Configuration)
    .AddAuthorizationPolicies()
    .AddExceptionHandler<GlobalExceptionHandler>()
    .AddSwaggerGen()
    .AddCorsPolicy(builder.Configuration)
    .AddRouting(options => { options.LowercaseUrls = true; });

var app = builder.Build();
var logger = app.Services.GetRequiredService<ILogger<Program>>();


app.UseMiddleware<ValidationExceptionMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.ApplyMigrations();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.MapOpenApi();
}

app.UseExceptionHandler("/Error");
app.UseAuthorization();
app.MapControllers();

app.MapSwagger();
app.UseSwaggerUI();
app.UseCors();

app.UseStaticFiles();
app.UseDefaultFiles();
app.MapFallbackToFile("index.html");

logger.LogInformation("Application is listening on: {Urls}", string.Join(", ", app.Urls));
app.Run();
