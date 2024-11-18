using System.Net;
using Thrive.Shared.Abstractions.Exceptions;

namespace Thrive.Shared.Application.Exceptions;

public sealed class BadRequestException(string message) : BaseException(message);

public sealed class UnauthorizedException(string message): BaseException(message, HttpStatusCode.Unauthorized);

public sealed class ValidationException(IEnumerable<ExceptionDetail> details) 
    : BaseException("Some validation errors have occured", details); 