namespace Thrive.Modules.Identity.Application.DTOs;

public sealed record AuthenticationResult(string AccessToken, string RefreshToken, DateTime ExpiresAt);