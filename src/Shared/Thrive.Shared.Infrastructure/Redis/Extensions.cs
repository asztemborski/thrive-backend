using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace Thrive.Shared.Infrastructure.Redis;

public static class Extensions
{
    private const string SectionName = "redis";

    public static IServiceCollection AddRedis(this IServiceCollection services)
    {
        var configuration = services.BuildServiceProvider().GetRequiredService<IConfiguration>();
        var connectionString = configuration[$"{SectionName}:ConnectionString"];
        var redis = ConnectionMultiplexer.Connect(connectionString!);

        services.AddSingleton<IDatabase>(redis.GetDatabase());

        return services;
    }
}