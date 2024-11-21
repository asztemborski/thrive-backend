using Thrive.Modules.Identity.Domain.Exceptions;
using Thrive.Modules.Identity.Domain.ValueObjects;

namespace Thrive.Modules.Identity.Domain.UnitTests.ValueObjects;

public class EmailAddressTests
{
    [Theory]
    [InlineData("test@example.com")]
    [InlineData("user.name+alias@domain.co")]
    public void Should_Create_Valid_EmailAddress(string validEmail)
    {
        var email = new EmailAddress(validEmail);
        Assert.Equal(validEmail, email.Value);
    }

    [Theory]
    [InlineData("")]
    [InlineData("invalid-email")]
    public void Should_Throw_InvalidEmailException_For_Invalid_Email(string invalidEmail)
    {
        Assert.Throws<InvalidEmailException>(() => new EmailAddress(invalidEmail));
    }

    [Fact]
    public void Implicit_Conversion_Should_Work()
    {
        var email = new EmailAddress("implicit@example.com");
        string emailAsString = email;
        Assert.Equal("implicit@example.com", emailAsString);

        EmailAddress emailFromString = "implicit@example.com";
        Assert.Equal("implicit@example.com", emailFromString.Value);
    }
}