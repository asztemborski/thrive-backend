using System.Reflection;
using Thrive.Shared.Application;
using Thrive.Shared.Infrastructure;
using Thrive.Shared.Infrastructure.Modules;

var builder = WebApplication.CreateBuilder(args);

var assemblies = ModuleLoader.LoadAssemblies(builder.Configuration, "Thrive.src.Modules.");
var modules = ModuleLoader.LoadModules(assemblies);

builder.WebHost.ConfigureModules();
builder.Services.AddSharedApplication(assemblies);
builder.Services.AddSharedInfrastructure(builder.Configuration, assemblies, modules);
builder.Configuration.AddUserSecrets(Assembly.GetExecutingAssembly());

foreach (var module in modules)
{
    module.Add(builder.Services);
}

var app = builder.Build();
app.UseSharedInfrastructure();

foreach (var module in modules)
{
    module.Use(app);
}

assemblies.Clear();
modules.Clear();

app.Run();