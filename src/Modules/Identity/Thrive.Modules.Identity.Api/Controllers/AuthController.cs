using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Thrive.Modules.Identity.Application.Commands.Authenticate;
using Thrive.Modules.Identity.Application.DTOs;

namespace Thrive.Modules.Identity.Api.Controllers;

[Controller]
[Route("auth")]
public sealed class AuthController : ControllerBase
{
    private readonly ISender _sender;

    public AuthController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("authenticate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Authenticates user.", Description = "Authenticates and retrieves user auth tokens.")]
    public async Task<AuthenticationResult> Authenticate([FromBody] AuthenticateCommand request,
        CancellationToken cancellationToken)
    {
        return await _sender.Send(request, cancellationToken);
    }
}