namespace Thrive.Modules.Identity.Infrastructure.Options;

internal sealed record JwtOptions
{
    public required string SecretKey { get; init; }
    public int TokenExpirationInMinutes { get; init; }
    public int RefreshTokenExpirationInDays { get; init; }
    public bool ValidateIssuerSigningKey { get; init; }
    public bool ValidateIssuer { get; init; }
    public bool ValidateAudience { get; init; }
    public bool ValidateLifetime { get; init; }
}