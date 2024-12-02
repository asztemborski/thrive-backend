using FluentValidation;

namespace Thrive.Modules.Identity.Application.Commands.Authenticate;

public sealed class AuthenticateCommandValidator : AbstractValidator<AuthenticateCommand>
{
    public AuthenticateCommandValidator()
    {
        RuleFor(request => request.Email)
            .NotNull()
            .NotEmpty()
            .EmailAddress();

        RuleFor(request => request.Password)
            .NotNull()
            .NotEmpty();
    }
}