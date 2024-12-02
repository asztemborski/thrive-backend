using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Thrive.Modules.Identity.Application.Contracts;
using Thrive.Modules.Identity.Domain.Repositories;
using Thrive.Modules.Identity.Infrastructure.Database;
using Thrive.Modules.Identity.Infrastructure.Database.Repositories;
using Thrive.Modules.Identity.Infrastructure.Options.Setups;
using Thrive.Modules.Identity.Infrastructure.Services;
using Thrive.Shared.Infrastructure.Database;

namespace Thrive.Modules.Identity.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.ConfigureOptions<EmailOptionsSetup>();
        services.ConfigureOptions<JwtOptionsSetup>();
        services.ConfigureOptions<JwtBearerOptionsSetup>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var bearerOptions = services.BuildServiceProvider()
                    .GetRequiredService<IOptions<JwtBearerOptions>>().Value;

                options.TokenValidationParameters = bearerOptions.TokenValidationParameters;
            });
        
        services.AddPostgres<DatabaseContext>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IValueHasher, ValueHasher>();

        return services;
    }

    public static IApplicationBuilder UseInfrastructure(this IApplicationBuilder app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
        
        return app;
    }
}