using FluentValidation;

namespace Thrive.Modules.Identity.Application.Commands.SignUp;

public sealed class SignUpCommandValidator : AbstractValidator<SignUpCommand>
{
    public SignUpCommandValidator()
    {
        RuleFor(request => request.Email)
            .NotEmpty()
            .NotNull()
            .EmailAddress()
            .MinimumLength(5)
            .MaximumLength(100);

        RuleFor(request => request.Username)
            .NotEmpty()
            .NotNull();

        RuleFor(request => request.ConfirmPassword)
            .NotEmpty()
            .NotNull()
            .Equal(request => request.Password)
            .WithMessage("Confirm Password' must be equal to 'Password'.");
    }
}