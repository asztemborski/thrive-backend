using Thrive.Modules.Identity.Domain.Exceptions;

namespace Thrive.Modules.Identity.Domain.ValueObjects;

public sealed record Username
{
    public Username(string value)
    {
        if (string.IsNullOrEmpty(value) || value.Length is < 5 or > 20) throw new InvalidUsernameException();

        Value = value;
    }

    public string Value { get; }

    public static implicit operator string(Username username)
    {
        return username.Value;
    }

    public static implicit operator Username(string username)
    {
        return new Username(username);
    }
}