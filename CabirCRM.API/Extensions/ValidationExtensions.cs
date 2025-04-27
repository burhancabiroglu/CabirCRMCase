using CabirCRM.Application.Validators;
using FluentValidation.AspNetCore;
#pragma warning disable CS0618 // Type or member is obsolete

namespace CabirCRM.API.Extensions;

public static class ValidationExtensions
    {
        public static IMvcBuilder AddCustomValidation(this IMvcBuilder builder)
        {
            builder.AddFluentValidation(fv =>
            {
                fv.RegisterValidatorsFromAssembly(typeof(RegisterRequestValidator).Assembly);
                fv.DisableDataAnnotationsValidation = true;
            });

            return builder;
        }
    }