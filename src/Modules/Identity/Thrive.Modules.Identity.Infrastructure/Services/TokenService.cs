using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using Thrive.Modules.Identity.Application.Contracts;
using Thrive.Modules.Identity.Application.DTOs;
using Thrive.Modules.Identity.Domain.Entities;
using Thrive.Modules.Identity.Infrastructure.Options;

namespace Thrive.Modules.Identity.Infrastructure.Services;

internal sealed class TokenService : ITokenService
{
    private readonly IDatabase _database;
    private readonly JwtOptions _jwtOptions;

    public TokenService(IOptions<JwtOptions> jwtOptions, IDatabase database)
    {
        _jwtOptions = jwtOptions.Value;
        _database = database;
    }

    public async Task<AuthenticationResult> GenerateAsync(IdentityUser user,
        CancellationToken cancellationToken = default)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email.Address),
            new(ClaimTypes.Name, user.Username)
        };

        var accessToken = GenerateEncryptedToken(claims, TimeSpan.FromMinutes(_jwtOptions.TokenExpirationInMinutes));
        var refreshTokenExpiresIn = TimeSpan.FromDays(_jwtOptions.RefreshTokenExpirationInDays);
        var refreshToken = GenerateEncryptedToken(claims, refreshTokenExpiresIn);

        await _database.StringSetAsync($"{user.Id}-${refreshToken}", user.Id.ToString(),
            TimeSpan.FromDays(_jwtOptions.RefreshTokenExpirationInDays));

        return new AuthenticationResult(accessToken, refreshToken, DateTime.UtcNow.Add(refreshTokenExpiresIn));
    }

    private string GenerateEncryptedToken(IEnumerable<Claim> claims, TimeSpan expiresIn)
    {
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.Add(expiresIn),
            SigningCredentials = signingCredentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}