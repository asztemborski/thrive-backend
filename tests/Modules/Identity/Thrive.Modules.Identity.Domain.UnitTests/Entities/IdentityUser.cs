using Thrive.Modules.Identity.Domain.Entities;
using Thrive.Modules.Identity.Domain.Exceptions;
using Thrive.Modules.Identity.Domain.ValueObjects;

namespace Thrive.Modules.Identity.Domain.UnitTests.Entities;

public class IdentityUserTests
{
    [Fact]
    public void Should_Create_IdentityUser()
    {
        var email = new EmailAddress("user@example.com");
        var username = new Username("User123");
        var user = new IdentityUser(email, username, "password123");

        Assert.Equal(email, user.Email.Address);
        Assert.Equal(username, user.Username);
        Assert.Equal("password123", user.Password);
        Assert.True(user.IsActive);
    }

    [Fact]
    public void Should_Toggle_Activation_Status()
    {
        var email = new EmailAddress("user@example.com");
        var username = new Username("User123");
        var user = new IdentityUser(email, username, "password123");

        user.ToggleActivationStatus(false);
        Assert.False(user.IsActive);

        user.ToggleActivationStatus(true);
        Assert.True(user.IsActive);
    }

    [Fact]
    public void Should_Throw_Exception_When_Toggling_To_Same_Status()
    {
        var email = new EmailAddress("user@example.com");
        var username = new Username("User123");
        var user = new IdentityUser(email, username, "password123");

        Assert.Throws<UserActiveException>(() => user.ToggleActivationStatus(true));

        user.ToggleActivationStatus(false);
        Assert.Throws<UserInactiveException>(() => user.ToggleActivationStatus(false));
    }
}