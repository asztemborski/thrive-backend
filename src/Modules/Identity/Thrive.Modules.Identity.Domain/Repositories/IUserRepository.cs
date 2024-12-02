using Thrive.Modules.Identity.Domain.Entities;

namespace Thrive.Modules.Identity.Domain.Repositories;

public interface IUserRepository
{
    Task<IdentityUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IdentityUser> CreateAsync(IdentityUser user, CancellationToken cancellationToken = default);

    Task<(bool emailUnique, bool usernameUnique)> IsUnique(string email, string username,
        CancellationToken cancellationToken = default);
}