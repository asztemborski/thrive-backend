using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Thrive.Shared.Infrastructure.Database;

public static class Extensions
{
    private const string SectionName = "postgres";

    public static IServiceCollection AddPostgres<T>(this IServiceCollection services) where T : DbContext
    {
        var configuration = services.BuildServiceProvider().GetRequiredService<IConfiguration>();
        var connectionString = configuration[$"{SectionName}:ConnectionString"];
        services.AddDbContext<T>(x => x.UseNpgsql(connectionString));

        return services;
    }
}