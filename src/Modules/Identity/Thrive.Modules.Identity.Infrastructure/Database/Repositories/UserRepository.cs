using Microsoft.EntityFrameworkCore;
using Thrive.Modules.Identity.Domain.Entities;
using Thrive.Modules.Identity.Domain.Repositories;

namespace Thrive.Modules.Identity.Infrastructure.Database.Repositories;

internal sealed class UserRepository : IUserRepository
{
    private readonly DatabaseContext _context;

    public UserRepository(DatabaseContext context)
    {
        _context = context;
    }

    public Task<IdentityUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return _context.Users.FirstOrDefaultAsync(u => u.Email.Address.Value == email, cancellationToken);
    }

    public async Task<IdentityUser> CreateAsync(IdentityUser user, CancellationToken cancellationToken = default)
    {
        var createdUser = await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return createdUser.Entity;
    }

    public async Task<(bool emailUnique, bool usernameUnique)> IsUnique(string email, string username,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users.Select(u => new
            {
                Email = u.Email.Address.Value,
                Username = u.Username.Value
            })
            .FirstOrDefaultAsync(u => u.Email == email || u.Username == username, cancellationToken);

        return user is null ? (true, true) : (user.Email != email, user.Username != username);
    }
}