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
    private readonly ISpecialistInvitationService _specialistInvitationService;
    private readonly IMapper _mapper;

    public AuthController(
        IAuthService authService,
        IFileStorageService fileStorageService,
        ISpecialistInvitationService specialistInvitationService,
        IMapper mapper)
    {
        _authService = authService;
        _fileStorageService = fileStorageService;
        _specialistInvitationService = specialistInvitationService;
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

    /// <summary>
    /// Validate invitation token
    /// </summary>
    [AllowAnonymous]
    [HttpGet("invite/validate/{token}")]
    [ProducesResponseType(typeof(ValidateInvitationResultViewModel), StatusCodes.Status200OK)]
    public async Task<ActionResult<ValidateInvitationResultViewModel>> ValidateInvitation(
        string token,
        CancellationToken cancellationToken)
    {
        var result = await _specialistInvitationService.ValidateInvitationTokenAsync(token, cancellationToken);
        var viewModel = _mapper.Map<ValidateInvitationResultViewModel>(result);
        return Ok(viewModel);
    }

    /// <summary>
    /// Accept invitation and auto-login
    /// </summary>
    [AllowAnonymous]
    [HttpPost("invite/accept")]
    [ProducesResponseType(typeof(TokenResponseViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponseViewModel>> AcceptInvitation(
        [FromBody] AcceptInvitationViewModel model,
        CancellationToken cancellationToken)
    {
        var result = await _specialistInvitationService.AcceptInvitationAsync(model.Token, cancellationToken);
        var viewModel = _mapper.Map<TokenResponseViewModel>(result);
        return Ok(viewModel);
    }

    /// <summary>
    /// Confirms email and performs auto-login
    /// </summary>
    [AllowAnonymous]
    [HttpGet("confirm-email")]
    [ProducesResponseType(typeof(TokenResponseViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponseViewModel>> ConfirmEmail(
        [FromQuery] string userId,
        [FromQuery] string token,
        CancellationToken cancellationToken)
    {
        var tokenData = await _authService.ConfirmEmailAsync(userId, token, cancellationToken);
        var result = _mapper.Map<TokenResponseViewModel>(tokenData);
        return Ok(result);
    }

    /// <summary>
    /// Resends email confirmation
    /// </summary>
    [AllowAnonymous]
    [HttpPost("resend-email-confirmation")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ResendEmailConfirmation(
        [FromBody] ResendEmailConfirmationViewModel viewModel,
        CancellationToken cancellationToken)
    {
        await _authService.ResendEmailConfirmationAsync(viewModel.Email, cancellationToken);
        return Ok(new { message = "Confirmation email sent. Please check your inbox." });
    }

    /// <summary>
    /// Initiates password reset process (sends email with reset link)
    /// Accessible only to authenticated users
    /// </summary>
    [Authorize]
    [HttpPost("initiate-password-reset")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> InitiatePasswordReset(CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        await _authService.InitiatePasswordResetAsync(userId, cancellationToken);
        return Ok(new { message = "Password reset email has been sent. Please check your inbox." });
    }

    /// <summary>
    /// Resets password and performs auto-login
    /// </summary>
    [AllowAnonymous]
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(TokenResponseViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponseViewModel>> ResetPassword(
        [FromBody] ResetPasswordViewModel viewModel,
        CancellationToken cancellationToken)
    {
        var tokenData = await _authService.ResetPasswordAsync(
            viewModel.UserId,
            viewModel.Token,
            viewModel.NewPassword,
            cancellationToken);

        var result = _mapper.Map<TokenResponseViewModel>(tokenData);
        return Ok(result);
    }
}
