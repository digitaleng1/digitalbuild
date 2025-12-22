using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using DigitalEngineers.Infrastructure.Entities.Identity;
using DigitalEngineers.API.ViewModels.User;
using DigitalEngineers.Domain.Interfaces;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/user/profile")]
[Authorize]
public class UserProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<UserProfileController> _logger;

    public UserProfileController(
        UserManager<ApplicationUser> userManager,
        IFileStorageService fileStorageService,
        ILogger<UserProfileController> logger)
    {
        _userManager = userManager;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    /// <summary>
    /// Get current user profile (works for all roles)
    /// </summary>
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileViewModel>> GetMyProfile(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
            return NotFound(new { message = "User not found" });
        
        var roles = await _userManager.GetRolesAsync(user);
        
        var viewModel = new UserProfileViewModel
        {
            UserId = user.Id,
            FirstName = user.FirstName ?? string.Empty,
            LastName = user.LastName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            ProfilePictureUrl = !string.IsNullOrWhiteSpace(user.ProfilePictureUrl)
                ? _fileStorageService.GetPresignedUrl(user.ProfilePictureUrl)
                : null,
            PhoneNumber = user.PhoneNumber,
            Location = user.Location,
            Biography = user.Biography,
            Website = user.Website,
            Roles = roles,
            CreatedAt = user.CreatedAt,
            LastActive = user.LastActive
        };
        
        return Ok(viewModel);
    }

    /// <summary>
    /// Update current user profile (works for all roles)
    /// </summary>
    [HttpPut("me")]
    public async Task<ActionResult<UserProfileViewModel>> UpdateMyProfile(
        [FromBody] UpdateUserProfileViewModel model,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
            return NotFound(new { message = "User not found" });
        
        user.FirstName = model.FirstName;
        user.LastName = model.LastName;
        user.PhoneNumber = model.PhoneNumber;
        user.Location = model.Location;
        user.Biography = model.Biography;
        user.Website = model.Website;
        user.UpdatedAt = DateTime.UtcNow;
        
        var result = await _userManager.UpdateAsync(user);
        
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors });
        
        return await GetMyProfile(cancellationToken);
    }

    /// <summary>
    /// Upload avatar for current user (works for all roles)
    /// </summary>
    [HttpPost("me/avatar")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<UserProfileViewModel>> UploadAvatar(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file provided" });
        
        if (!file.ContentType.StartsWith("image/"))
            return BadRequest(new { message = "Only image files are allowed" });
        
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "File size must be less than 5MB" });
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
            return NotFound(new { message = "User not found" });
        
        // Delete old avatar if exists
        if (!string.IsNullOrWhiteSpace(user.ProfilePictureUrl))
        {
            try
            {
                await _fileStorageService.DeleteFileAsync(user.ProfilePictureUrl, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete old avatar for user {UserId}", userId);
            }
        }
        
        await using var stream = file.OpenReadStream();
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"user-avatar{fileExtension}";
        
        var s3Key = await _fileStorageService.UploadUserAvatarAsync(
            stream,
            fileName,
            file.ContentType,
            userId,
            cancellationToken);
        
        user.ProfilePictureUrl = s3Key;
        user.UpdatedAt = DateTime.UtcNow;
        
        await _userManager.UpdateAsync(user);
        
        return await GetMyProfile(cancellationToken);
    }
}
