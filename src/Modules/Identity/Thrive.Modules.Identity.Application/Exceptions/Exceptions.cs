using Thrive.Shared.Abstractions.Exceptions;
using Thrive.Shared.Application.Exceptions;

namespace Thrive.Modules.Identity.Application.Exceptions;

internal sealed class EmailAlreadyUsedException(string email)
    : BaseException($"Email '{email}' is already in use", ExceptionCodes.EmailAlreadyUsed);

internal sealed class UsernameAlreadyUsedException(string username)
    : BaseException($"Username '{username}' is already in use", ExceptionCodes.UsernameAlreadyUsed);

internal sealed class InvalidEmailProviderException(string emailProvider)
    : BaseException($"'{emailProvider}' is not valid email provider.", ExceptionCodes.InvalidEmailProvider);

internal sealed class InvalidCredentialsException() : UnauthorizedException("Invalid credentials");