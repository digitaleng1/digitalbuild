using AutoMapper;
using DigitalEngineers.API.ViewModels.UserManagement;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class UserManagementController : ControllerBase
{
    private readonly IUserManagementService _userManagementService;
    private readonly IMapper _mapper;

    public UserManagementController(IUserManagementService userManagementService, IMapper mapper)
    {
        _userManagementService = userManagementService;
        _mapper = mapper;
    }

    [HttpGet("role/{role}")]
    [ProducesResponseType(typeof(IEnumerable<UserManagementViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UserManagementViewModel>>> GetUsersByRole(
        string role,
        CancellationToken cancellationToken)
    {
        var users = await _userManagementService.GetUsersByRoleAsync(role, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<UserManagementViewModel>>(users);
        return Ok(viewModels);
    }

    [HttpPut("{userId}/toggle-status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleUserStatus(
        string userId,
        [FromBody] ToggleUserStatusViewModel viewModel,
        CancellationToken cancellationToken)
    {
        var result = await _userManagementService.ToggleUserStatusAsync(userId, viewModel.IsActive, cancellationToken);
        
        if (!result)
            return NotFound(new { message = "User not found" });

        return Ok(new { message = "User status updated successfully" });
    }
}
