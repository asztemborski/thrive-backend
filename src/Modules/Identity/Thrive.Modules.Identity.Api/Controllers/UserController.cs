using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Thrive.Modules.Identity.Application.Commands.SignUp;

namespace Thrive.Modules.Identity.Api.Controllers;

[Controller]
[Route("user")]
public sealed class UserController : ControllerBase
{
    private readonly ISender _sender;

    public UserController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("sign-up")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Registers a new user.", Description = "Register a new user based on the request.")]
    public async Task SignUp([FromBody] SignUpCommand request, CancellationToken cancellationToken)
    {
        await _sender.Send(request, cancellationToken);
    }
}