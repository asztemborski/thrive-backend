using Thrive.Shared.Abstractions.Exceptions;

namespace Thrive.Modules.Identity.Domain.Exceptions;

internal sealed class EmailAlreadyConfirmedException()
    : BaseException("Email is already confirmed.", "Identity.EmailConfirmed");

internal sealed class InvalidEmailException()
    : BaseException("Email address is not valid.", "Identity.InvalidEmail");

internal sealed class InvalidUsernameException()
    : BaseException("Username is not valid.", "Identity.InvalidUsername");

internal sealed class CannotUpdateEmailToCurrentEmailException()
    : BaseException("Cannot update email to the current account email address.", "Identity.SameEmail");

internal sealed class UserActiveException()
    : BaseException("User is active.", "Identity.UserActive");

internal sealed class UserInactiveException()
    : BaseException("User is inactive.", "Identity.Inactive");
