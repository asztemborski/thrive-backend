using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Thrive.Shared.Abstractions.Modules;

public interface IModule
{
    string Name { get; }
    void Add(IServiceCollection services);
    void Use(IApplicationBuilder app);
}