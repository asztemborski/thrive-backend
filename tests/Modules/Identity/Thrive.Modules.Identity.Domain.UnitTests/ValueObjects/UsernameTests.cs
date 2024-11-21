using Thrive.Modules.Identity.Domain.Exceptions;
using Thrive.Modules.Identity.Domain.ValueObjects;

namespace Thrive.Modules.Identity.Domain.UnitTests.ValueObjects;

public class UsernameTests
{
    [Theory]
    [InlineData("ValidUsername")]
    [InlineData("ValidUsername2")]
    public void Should_Create_Valid_Username(string validUsername)
    {
        var username = new Username(validUsername);
        Assert.Equal(validUsername, username.Value);
    }

    [Theory]
    [InlineData("")]
    [InlineData("A")]
    public void Should_Throw_InvalidUsernameException_For_Invalid_Username(string invalidUsername)
    {
        Assert.Throws<InvalidUsernameException>(() => new Username(invalidUsername));
    }

    [Fact]
    public void Implicit_Conversion_Should_Work()
    {
        var username = new Username("ImplicitTest");
        string usernameAsString = username;
        Assert.Equal("ImplicitTest", usernameAsString);

        Username usernameFromString = "ImplicitTest";
        Assert.Equal("ImplicitTest", usernameFromString.Value);
    }
}