using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.API.ViewModels.Client;
using AutoMapper;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;
    private readonly IMapper _mapper;

    public ClientsController(IClientService clientService, IMapper mapper)
    {
        _clientService = clientService;
        _mapper = mapper;
    }

    /// <summary>
    /// Get list of clients for selection (Admin/SuperAdmin only)
    /// </summary>
    [HttpGet("list")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(IEnumerable<ClientListViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<ClientListViewModel>>> GetClientList(
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var clients = await _clientService.GetClientListAsync(search, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ClientListViewModel>>(clients);
        return Ok(viewModels);
    }

    /// <summary>
    /// Get current client profile
    /// </summary>
    [HttpGet("profile/me")]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<ClientProfileDto>> GetMyProfile(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var profile = await _clientService.GetCurrentClientProfileAsync(userId, cancellationToken);
        return Ok(profile);
    }

    /// <summary>
    /// Get client profile by ID
    /// </summary>
    [HttpGet("{id}/profile")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ClientProfileDto>> GetClientProfile(int id, CancellationToken cancellationToken)
    {
        var profile = await _clientService.GetClientProfileAsync(id, cancellationToken);
        return Ok(profile);
    }

    /// <summary>
    /// Update current client profile
    /// </summary>
    [HttpPut("profile/me")]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<ClientProfileDto>> UpdateMyProfile(
        [FromBody] UpdateClientProfileViewModel viewModel,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        
        var client = await _clientService.GetCurrentClientProfileAsync(userId, cancellationToken);
        var dto = _mapper.Map<UpdateClientProfileDto>(viewModel);
        
        var updatedProfile = await _clientService.UpdateClientProfileAsync(client.Id, dto, cancellationToken);
        return Ok(updatedProfile);
    }

    /// <summary>
    /// Upload profile picture for current client
    /// </summary>
    [HttpPost("profile/me/avatar")]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<object>> UploadMyProfilePicture(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        
        var client = await _clientService.GetCurrentClientProfileAsync(userId, cancellationToken);
        
        using var stream = file.OpenReadStream();
        var presignedUrl = await _clientService.UploadProfilePictureAsync(
            client.Id, 
            stream, 
            file.FileName, 
            file.ContentType, 
            cancellationToken);
        
        return Ok(new { profilePictureUrl = presignedUrl });
    }
}
