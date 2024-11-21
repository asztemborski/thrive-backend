using Thrive.Modules.Identity.Domain.Entities;
using Thrive.Modules.Identity.Domain.Exceptions;
using Thrive.Modules.Identity.Domain.ValueObjects;

namespace Thrive.Modules.Identity.Domain.UnitTests.Entities;

public class UserEmailTests
{
    [Fact]
    public void Should_Create_UserEmail_With_Valid_Address()
    {
        var email = new EmailAddress("user@example.com");
        var userEmail = new UserEmail(email);

        Assert.Equal(email, userEmail.Address);
        Assert.False(userEmail.IsVerified);
    }

    [Fact]
    public void Should_Verify_Email()
    {
        var email = new UserEmail(new EmailAddress("user@example.com"));
        email.Verify();
        Assert.True(email.IsVerified);
    }

    [Fact]
    public void Should_Throw_Exception_When_Verifying_Already_Verified_Email()
    {
        var email = new UserEmail(new EmailAddress("user@example.com"));
        email.Verify();
        Assert.Throws<EmailAlreadyConfirmedException>(() => email.Verify());
    }

    [Fact]
    public void Should_Change_Email_Address()
    {
        var email = new UserEmail(new EmailAddress("user@example.com"));
        email.ChangeAddress("newuser@example.com");

        Assert.Equal("newuser@example.com", email.Address.Value);
    }

    [Fact]
    public void Should_Throw_Exception_When_Changing_To_Same_Email_Address()
    {
        var email = new UserEmail(new EmailAddress("user@example.com"));
        Assert.Throws<CannotUpdateEmailToCurrentEmailException>(() => email.ChangeAddress("user@example.com"));
    }
}