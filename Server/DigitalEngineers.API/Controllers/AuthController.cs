using AutoMapper;
using DigitalEngineers.API.ViewModels.Auth;
using DigitalEngineers.Domain.DTOs.Auth;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IMapper _mapper;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, IMapper mapper, ILogger<AuthController> logger)
    {
        _authService = authService;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<TokenResponseViewModel>> Register(
        [FromBody] RegisterViewModel viewModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = _mapper.Map<RegisterDto>(viewModel);
            var response = await _authService.RegisterAsync(dto, cancellationToken);
            var result = _mapper.Map<TokenResponseViewModel>(response);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<TokenResponseViewModel>> Login(
        [FromBody] LoginViewModel viewModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _authService.LoginAsync(viewModel.Email, viewModel.Password, cancellationToken);
            var result = _mapper.Map<TokenResponseViewModel>(response);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<TokenResponseViewModel>> RefreshToken(
        [FromBody] RefreshTokenViewModel viewModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _authService.RefreshTokenAsync(viewModel.AccessToken, viewModel.RefreshToken, cancellationToken);
            var result = _mapper.Map<TokenResponseViewModel>(response);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, new { message = "An error occurred during token refresh" });
        }
    }

    [HttpPost("external-login")]
    public async Task<ActionResult<TokenResponseViewModel>> ExternalLogin(
        [FromBody] ExternalLoginViewModel viewModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _authService.ExternalLoginAsync(viewModel.Provider, viewModel.IdToken, cancellationToken);
            var result = _mapper.Map<TokenResponseViewModel>(response);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (NotSupportedException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during external login");
            return StatusCode(500, new { message = "An error occurred during external login" });
        }
    }

    [Authorize]
    [HttpPost("revoke-token")]
    public async Task<ActionResult> RevokeToken(CancellationToken cancellationToken)
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _authService.RevokeTokenAsync(userId, cancellationToken);
            if (!result)
            {
                return BadRequest(new { message = "Failed to revoke token" });
            }

            return Ok(new { message = "Token revoked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token revocation");
            return StatusCode(500, new { message = "An error occurred during token revocation" });
        }
    }
}
