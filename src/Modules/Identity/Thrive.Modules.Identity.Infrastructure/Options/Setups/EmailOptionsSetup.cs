using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Thrive.Modules.Identity.Application.Options;
using Thrive.Shared.Infrastructure;

namespace Thrive.Modules.Identity.Infrastructure.Options.Setups;

internal sealed class EmailOptionsSetup : IConfigureOptions<EmailOptions>
{
    private readonly IConfiguration _configuration;

    public EmailOptionsSetup(IConfiguration configuration) =>_configuration = configuration;
    
    public void Configure(EmailOptions options)
    {
        _configuration.GetSection<EmailOptions>().Bind(options);
    }
}