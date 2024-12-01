namespace Thrive.Modules.Identity.Application.Options;

public sealed record EmailOptions
{
    public required List<string> BannedEmailProviders { get; set; }
}