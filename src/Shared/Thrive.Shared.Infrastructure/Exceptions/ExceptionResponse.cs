using System.Net;
using Thrive.Shared.Abstractions.Exceptions;

namespace Thrive.Shared.Infrastructure.Exceptions;

public sealed record ExceptionResponse
{
    public required string Title { get; set; } = string.Empty;
    public string Code { get; set; } = "Thrive.Exception";
    public List<ExceptionDetail> Details { get; } = [];
    public string Source { get; set; } = string.Empty;
    public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.BadRequest;
}