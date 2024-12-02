using Thrive.Modules.Identity.Domain.Exceptions;
using Thrive.Modules.Identity.Domain.ValueObjects;

namespace Thrive.Modules.Identity.Domain.Entities;

public sealed class UserEmail
{
    public UserEmail(EmailAddress address)
    {
        Address = address;
    }

    private UserEmail()
    {
    }

    public EmailAddress Address { get; private set; }
    public bool IsVerified { get; private set; }

    public void ChangeAddress(string newAddress)
    {
        if (Address == newAddress) throw new CannotUpdateEmailToCurrentEmailException();

        Address = newAddress;
    }

    public void Verify()
    {
        if (IsVerified) throw new EmailAlreadyConfirmedException();

        IsVerified = true;
    }
}