using AutoMapper;
using DigitalEngineers.API.ViewModels.UserManagement;
using DigitalEngineers.Domain.DTOs;
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

    [HttpPost("admin")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(UserManagementViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<UserManagementViewModel>> CreateAdmin(
        [FromBody] CreateAdminViewModel viewModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = _mapper.Map<CreateAdminDto>(viewModel);
            var result = await _userManagementService.CreateAdminAsync(dto, cancellationToken);
            var responseViewModel = _mapper.Map<UserManagementViewModel>(result);
            
            return CreatedAtAction(
                nameof(GetUsersByRole), 
                new { role = "Admin" }, 
                responseViewModel);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("client")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(UserManagementViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<UserManagementViewModel>> CreateClient(
        [FromBody] CreateClientViewModel viewModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var dto = _mapper.Map<CreateClientDto>(viewModel);
            var result = await _userManagementService.CreateClientAsync(dto, cancellationToken);
            var responseViewModel = _mapper.Map<UserManagementViewModel>(result);
            
            return CreatedAtAction(
                nameof(GetUsersByRole), 
                new { role = "Client" }, 
                responseViewModel);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
