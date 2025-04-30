using CabirCRM.Application.Requests.Users;
using FluentValidation;

namespace CabirCRM.Application.Validators;


public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required");
        
        RuleFor(x => x.Role.ToString())
            .NotEmpty().WithMessage("Role is required");
    }
}