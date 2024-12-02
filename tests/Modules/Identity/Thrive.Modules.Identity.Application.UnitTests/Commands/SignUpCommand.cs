using Microsoft.Extensions.Options;
using Moq;
using Thrive.Modules.Identity.Application.Commands.SignUp;
using Thrive.Modules.Identity.Application.Contracts;
using Thrive.Modules.Identity.Application.Exceptions;
using Thrive.Modules.Identity.Application.Options;
using Thrive.Modules.Identity.Domain.Entities;
using Thrive.Modules.Identity.Domain.Repositories;

namespace Thrive.Modules.Identity.Application.UnitTests.Commands;

public sealed class SignUpCommandHandlerTests
{
    private readonly SignUpCommandHandler _handler;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public SignUpCommandHandlerTests()
    {
        _mockUserRepository = new Mock<IUserRepository>();
        Mock<IOptions<EmailOptions>> mockEmailOptions = new();
        Mock<IValueHasher> mockValueHasher = new();

        mockEmailOptions.Setup(x => x.Value).Returns(new EmailOptions
        {
            BannedEmailProviders = ["banned.com", "spam.net"]
        });

        _handler = new SignUpCommandHandler(
            _mockUserRepository.Object,
            mockEmailOptions.Object,
            mockValueHasher.Object
        );
    }

    [Fact]
    public async Task Handle_WhenAllValidationsPass_ShouldCreateUser()
    {
        // Arrange
        var command = new SignUpCommand(
            "user@example.com",
            "testuser",
            "StrongPassword123!",
            "StrongPassword123!"
        );

        _mockUserRepository
            .Setup(x => x.IsUnique(command.Email, command.Username, It.IsAny<CancellationToken>()))
            .ReturnsAsync((true, true));

        var expectedUser = new IdentityUser(command.Email, command.Username, command.Password);
        _mockUserRepository
            .Setup(x => x.CreateAsync(It.IsAny<IdentityUser>(), It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(expectedUser));

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        _mockUserRepository.Verify(
            x => x.CreateAsync(
                It.Is<IdentityUser>(u =>
                    u.Email.Address == command.Email &&
                    u.Username == command.Username
                ),
                It.IsAny<CancellationToken>()
            ),
            Times.Once
        );
    }

    [Theory]
    [InlineData("user@banned.com", "testuser")]
    [InlineData("another@spam.net", "anotheruser")]
    public async Task Handle_WhenEmailProviderIsBanned_ShouldThrowInvalidEmailProviderException(
        string email, string username)
    {
        // Arrange
        var command = new SignUpCommand(
            email,
            username,
            "StrongPassword123!",
            "StrongPassword123!"
        );

        // Act & Assert
        await Assert.ThrowsAsync<InvalidEmailProviderException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }

    [Fact]
    public async Task Handle_WhenEmailAlreadyExists_ShouldThrowEmailAlreadyUsedException()
    {
        // Arrange
        var command = new SignUpCommand(
            "existing@example.com",
            "newuser",
            "StrongPassword123!",
            "StrongPassword123!"
        );

        _mockUserRepository
            .Setup(x => x.IsUnique(command.Email, command.Username, It.IsAny<CancellationToken>()))
            .ReturnsAsync((false, true));

        // Act & Assert
        await Assert.ThrowsAsync<EmailAlreadyUsedException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }

    [Fact]
    public async Task Handle_WhenUsernameAlreadyExists_ShouldThrowUsernameAlreadyUsedException()
    {
        // Arrange
        var command = new SignUpCommand(
            "new@example.com",
            "existinguser",
            "StrongPassword123!",
            "StrongPassword123!"
        );

        _mockUserRepository
            .Setup(x => x.IsUnique(command.Email, command.Username, It.IsAny<CancellationToken>()))
            .ReturnsAsync((true, false));

        // Act & Assert
        await Assert.ThrowsAsync<UsernameAlreadyUsedException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }
}