using Microsoft.EntityFrameworkCore;
using Thrive.Modules.Identity.Domain.Entities;
using Thrive.Modules.Identity.Infrastructure.Database.Configurations;

namespace Thrive.Modules.Identity.Infrastructure.Database;

internal sealed class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
    public DbSet<IdentityUser> Users => Set<IdentityUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasDefaultSchema("identity");
        new IdentityUserConfiguration().Configure(modelBuilder.Entity<IdentityUser>());
    }
}