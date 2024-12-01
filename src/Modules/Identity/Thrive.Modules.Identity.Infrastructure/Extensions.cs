using Microsoft.Extensions.DependencyInjection;
using Thrive.Modules.Identity.Domain.Repositories;
using Thrive.Modules.Identity.Infrastructure.Database;
using Thrive.Modules.Identity.Infrastructure.Database.Repositories;
using Thrive.Modules.Identity.Infrastructure.Options.Setups;
using Thrive.Shared.Infrastructure.Database;

namespace Thrive.Modules.Identity.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.ConfigureOptions<EmailOptionsSetup>();
        
        services.AddPostgres<DatabaseContext>();
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}