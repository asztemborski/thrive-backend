using System.Reflection;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Thrive.Shared.Abstractions.Modules;
using Thrive.Shared.Infrastructure.Exceptions;

namespace Thrive.Shared.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddSharedInfrastructure(this IServiceCollection services,
        IConfiguration configuration, IList<Assembly> assemblies, IList<IModule> modules)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(swagger =>
        {
            var securityScheme = new OpenApiSecurityScheme
            {
                BearerFormat = "JWT",
                Name = "JWT Authentication",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = BearerTokenDefaults.AuthenticationScheme,
                Description = "Put your JWT Bearer token on text box below",

                Reference = new OpenApiReference
                {
                    Id = BearerTokenDefaults.AuthenticationScheme,
                    Type = ReferenceType.SecurityScheme
                }
            };

            swagger.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
            swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                { securityScheme, Array.Empty<string>() }
            });

            swagger.EnableAnnotations();
            swagger.CustomSchemaIds(x => x.FullName);
            swagger.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Thrive API",
                Version = "v1"
            });
        });

        services.AddMemoryCache();
        services.AddHttpContextAccessor();

        services.AddCors(options => options.AddPolicy("ThriveCorsPolicy", builder =>
        {
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                builder.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
            }
        }));
        
        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });
        
        return services;
    }

    public static IApplicationBuilder UseSharedInfrastructure(this WebApplication builder)
    {
        builder.UseCors("ThriveCorsPolicy");
        builder.MapControllers();
        builder.UseMiddleware<ExceptionMiddleware>();
        builder.UseSwagger();
        builder.UseSwaggerUI();
        builder.UseReDoc(reDoc =>
        {
            reDoc.RoutePrefix = "docs";
            reDoc.SpecUrl("/swagger/v1/swagger.json");
            reDoc.DocumentTitle = "Thrive API";
        });
        
        return builder;
    }

    public static IWebHostBuilder ConfigureModules(this IWebHostBuilder builder)
        => builder.ConfigureAppConfiguration((ctx, cfg) =>
        {
            foreach (var settings in GetSettings("*"))
            {
                cfg.AddJsonFile(settings);
            }

            foreach (var settings in GetSettings($"*.{ctx.HostingEnvironment.EnvironmentName}"))
            {
                cfg.AddJsonFile(settings);
            }

            return;

            IEnumerable<string> GetSettings(string pattern)
                => Directory.EnumerateFiles(ctx.HostingEnvironment.ContentRootPath,
                    $"module.{pattern}.json", SearchOption.AllDirectories);
        });


    public static IConfiguration GetSection<T>(this IConfiguration configuration)
    {
        var assemblyName = typeof(T).Assembly.GetName().Name;
        var moduleName = assemblyName?.Split(".").ElementAtOrDefault(2)?.ToLower();

        if (string.IsNullOrEmpty(moduleName))
            throw new ArgumentException($"Unable to extract module name from {typeof(T).Name}");

        return configuration.GetSection($"{moduleName}:{typeof(T).Name}");
    }
}