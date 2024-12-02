using MediatR;
using Microsoft.Extensions.Options;
using Thrive.Modules.Identity.Application.Contracts;
using Thrive.Modules.Identity.Application.Exceptions;
using Thrive.Modules.Identity.Application.Options;
using Thrive.Modules.Identity.Domain.Repositories;
using IdentityUser = Thrive.Modules.Identity.Domain.Entities.IdentityUser;

namespace Thrive.Modules.Identity.Application.Commands.SignUp;

public sealed record SignUpCommand(string Email, string Username, string Password, string ConfirmPassword) : IRequest;

internal sealed class SignUpCommandHandler : IRequestHandler<SignUpCommand>
{
    private readonly EmailOptions _emailOptions;
    private readonly IUserRepository _userRepository;
    private readonly IValueHasher _valueHasher;

    public SignUpCommandHandler(IUserRepository userRepository, IOptions<EmailOptions> emailOptions,
        IValueHasher valueHasher)
    {
        _userRepository = userRepository;
        _valueHasher = valueHasher;
        _emailOptions = emailOptions.Value;
    }

    public async Task Handle(SignUpCommand request, CancellationToken cancellationToken)
    {
        var emailProvider = request.Email.Split("@").Last();

        if (_emailOptions.BannedEmailProviders.Any(x => x.Contains(emailProvider)))
            throw new InvalidEmailProviderException(emailProvider);

        var (emailUnique, usernameUnique) =
            await _userRepository.IsUnique(request.Email, request.Username, cancellationToken);

        if (!emailUnique) throw new EmailAlreadyUsedException(request.Email);

        if (!usernameUnique) throw new UsernameAlreadyUsedException(request.Username);

        var hashedPassword = _valueHasher.Hash(request.Password);
        var user = new IdentityUser(request.Email, request.Username, hashedPassword);
        await _userRepository.CreateAsync(user, cancellationToken);
    }
}