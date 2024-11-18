namespace Thrive.Shared.Abstractions.Exceptions;

public sealed record ExceptionDetail(string Code, string Path, string Message);