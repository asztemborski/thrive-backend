using System.Net;
using Thrive.Shared.Abstractions.Exceptions;

namespace Thrive.Shared.Application.Exceptions;

public class BadRequestException(string message) : BaseException(message);

public class UnauthorizedException(string message): BaseException(message, HttpStatusCode.Unauthorized);

public class NotFoundException(string message) : BaseException(message, HttpStatusCode.NotFound);

public sealed class ValidationException(IEnumerable<ExceptionDetail> details) 
    : BaseException("Some validation errors have occured", details); 