using Thrive.Modules.Identity.Application.DTOs;
using Thrive.Modules.Identity.Domain.Entities;

namespace Thrive.Modules.Identity.Application.Contracts;

public interface ITokenService
{
    Task<AuthenticationResult> GenerateAsync(IdentityUser user, CancellationToken cancellationToken = default);
}