using System.Net;

namespace Thrive.Shared.Abstractions.Exceptions;

public abstract class BaseException : Exception
{
    public List<ExceptionDetail> ExceptionDetails { get; } = [];
    public HttpStatusCode StatusCode { get; }
    public string Code { get; init; } = "Thrive.Exception";
    
    protected BaseException(string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        : base(message)
    {
        StatusCode = statusCode;
    }
    
    protected BaseException(string message, IEnumerable<ExceptionDetail> details, 
        HttpStatusCode statusCode = HttpStatusCode.BadRequest) : this(message, statusCode)
    {
        ExceptionDetails.AddRange(details);
    }

    protected BaseException(string message, string code, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        : this(message, statusCode)
    {
        Code = code;
    }
}