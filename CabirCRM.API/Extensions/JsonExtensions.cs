using System.Text.Json.Serialization;

namespace CabirCRM.API.Extensions;

public static class JsonExtensions
{
    public static IMvcBuilder AddCustomJsonOptions(this IMvcBuilder builder)
    {
        builder.AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

        return builder;
    }
}