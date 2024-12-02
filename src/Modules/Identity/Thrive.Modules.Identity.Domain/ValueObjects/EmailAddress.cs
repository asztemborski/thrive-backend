using System.ComponentModel.DataAnnotations;
using Thrive.Modules.Identity.Domain.Exceptions;

namespace Thrive.Modules.Identity.Domain.ValueObjects;

public sealed record EmailAddress
{
    public EmailAddress(string value)
    {
        if (string.IsNullOrEmpty(value) || new EmailAddressAttribute().IsValid(value) is false)
            throw new InvalidEmailException();

        Value = value;
    }

    public string Value { get; }

    public static implicit operator string(EmailAddress emailAddress)
    {
        return emailAddress.Value;
    }

    public static implicit operator EmailAddress(string value)
    {
        return new EmailAddress(value);
    }
}