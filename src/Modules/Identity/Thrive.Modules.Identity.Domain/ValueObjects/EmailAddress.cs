using System.ComponentModel.DataAnnotations;
using Thrive.Modules.Identity.Domain.Exceptions;

namespace Thrive.Modules.Identity.Domain.ValueObjects;

public sealed record EmailAddress
{
    public string Value { get; }

    public EmailAddress(string value)
    {
        if (string.IsNullOrEmpty(value) || new EmailAddressAttribute().IsValid(value) is false)
        {
            throw new InvalidEmailException();
        }
        
        Value = value;
    }

    public static implicit operator string(EmailAddress emailAddress) => emailAddress.Value;

    public static implicit operator EmailAddress(string value) => new(value);
}