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
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public AuthController(
        IAuthService authService,
        IFileStorageService fileStorageService,
        IMapper mapper)
    {
        _authService = authService;
        _fileStorageService = fileStorageService;
        _mapper = mapper;
    }

    [HttpPost("register")]
    public async Task<ActionResult<TokenResponseViewModel>> Register(
        [FromBody] RegisterViewModel viewModel,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<RegisterDto>(viewModel);
        var response = await _authService.RegisterAsync(dto, cancellationToken);
        var result = _mapper.Map<TokenResponseViewModel>(response);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<TokenResponseViewModel>> Login(
        [FromBody] LoginViewModel viewModel,
        CancellationToken cancellationToken)
    {
        var response = await _authService.LoginAsync(viewModel.Email, viewModel.Password, cancellationToken);
        var result = _mapper.Map<TokenResponseViewModel>(response);
        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<TokenResponseViewModel>> RefreshToken(
        [FromBody] RefreshTokenViewModel viewModel,
        CancellationToken cancellationToken)
    {
        var response = await _authService.RefreshTokenAsync(viewModel.AccessToken, viewModel.RefreshToken, cancellationToken);
        var result = _mapper.Map<TokenResponseViewModel>(response);
        return Ok(result);
    }

    [HttpPost("external-login")]
    public async Task<ActionResult<TokenResponseViewModel>> ExternalLogin(
        [FromBody] ExternalLoginViewModel viewModel,
        CancellationToken cancellationToken)
    {
        var response = await _authService.ExternalLoginAsync(viewModel.Provider, viewModel.IdToken, cancellationToken);
        var result = _mapper.Map<TokenResponseViewModel>(response);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("revoke-token")]
    public async Task<ActionResult> RevokeToken(CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        await _authService.RevokeTokenAsync(userId, cancellationToken);
        return Ok(new { message = "Token revoked successfully" });
    }

    /// <summary>
    /// Get current user's profile picture URL with presigned S3 URL
    /// </summary>
    [Authorize]
    [HttpGet("me/avatar")]
    [ProducesResponseType(typeof(UserAvatarViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserAvatarViewModel>> GetMyAvatarUrl(CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        var userData = await _authService.GetUserByIdAsync(userId, cancellationToken);

        string? avatarUrl = null;
        if (!string.IsNullOrWhiteSpace(userData.ProfilePictureUrl))
        {
            avatarUrl = _fileStorageService.GetPresignedUrl(userData.ProfilePictureUrl);
        }

        return Ok(new UserAvatarViewModel
        {
            ProfilePictureUrl = avatarUrl
        });
    }
}
