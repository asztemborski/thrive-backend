using MediatR;
using Thrive.Modules.Identity.Application.Contracts;
using Thrive.Modules.Identity.Application.DTOs;
using Thrive.Modules.Identity.Application.Exceptions;
using Thrive.Modules.Identity.Domain.Repositories;

namespace Thrive.Modules.Identity.Application.Commands.Authenticate;

public sealed record AuthenticateCommand(string Email, string Password) : IRequest<AuthenticationResult>;

internal sealed class AuthenticateCommandHandler : IRequestHandler<AuthenticateCommand, AuthenticationResult>
{
    private readonly ITokenService _tokenService;
    private readonly IUserRepository _userRepository;
    private readonly IValueHasher _valueHasher;

    public AuthenticateCommandHandler(IUserRepository userRepository, IValueHasher valueHasher,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _valueHasher = valueHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthenticationResult> Handle(AuthenticateCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken)
                   ?? throw new InvalidCredentialsException();

        var isPasswordValid = _valueHasher.Verify(request.Password, user.Password);

        if (!isPasswordValid || !user.IsActive || !user.Email.IsVerified) throw new InvalidCredentialsException();

        return await _tokenService.GenerateAsync(user, cancellationToken);
    }
}