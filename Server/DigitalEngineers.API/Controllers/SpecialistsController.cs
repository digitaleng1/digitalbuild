using AutoMapper;
using DigitalEngineers.API.ViewModels.Specialist;
using DigitalEngineers.API.ViewModels.Project;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SpecialistsController : ControllerBase
{
    private readonly ISpecialistService _specialistService;
    private readonly IProjectService _projectService;
    private readonly IMapper _mapper;

    public SpecialistsController(ISpecialistService specialistService, IProjectService projectService, IMapper mapper)
    {
        _specialistService = specialistService;
        _projectService = projectService;
        _mapper = mapper;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(SpecialistViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SpecialistViewModel>> CreateSpecialist(
        [FromBody] CreateSpecialistViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<CreateSpecialistDto>(model);
        var result = await _specialistService.CreateSpecialistAsync(dto, cancellationToken);
        var viewModel = _mapper.Map<SpecialistViewModel>(result);

        return CreatedAtAction(nameof(GetSpecialistById), new { id = viewModel.Id }, viewModel);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(SpecialistDetailsViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpecialistDetailsViewModel>> GetSpecialistById(
        int id,
        CancellationToken cancellationToken)
    {
        var specialist = await _specialistService.GetSpecialistByIdAsync(id, cancellationToken);
        var viewModel = _mapper.Map<SpecialistDetailsViewModel>(specialist);
        return Ok(viewModel);
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(SpecialistDetailsViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpecialistDetailsViewModel>> GetSpecialistByUserId(
        string userId,
        CancellationToken cancellationToken)
    {
        var specialist = await _specialistService.GetSpecialistByUserIdAsync(userId, cancellationToken);
        var viewModel = _mapper.Map<SpecialistDetailsViewModel>(specialist);
        return Ok(viewModel);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SpecialistViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SpecialistViewModel>>> GetSpecialists(
        CancellationToken cancellationToken)
    {
        var specialists = await _specialistService.GetSpecialistsAsync(cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<SpecialistViewModel>>(specialists);
        return Ok(viewModels);
    }

    [HttpGet("license-type/{licenseTypeId}")]
    [ProducesResponseType(typeof(IEnumerable<SpecialistViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SpecialistViewModel>>> GetSpecialistsByLicenseType(
        int licenseTypeId,
        CancellationToken cancellationToken)
    {
        var specialists = await _specialistService.GetSpecialistsByLicenseTypeAsync(licenseTypeId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<SpecialistViewModel>>(specialists);
        return Ok(viewModels);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(SpecialistViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpecialistViewModel>> UpdateSpecialist(
        int id,
        [FromBody] UpdateSpecialistViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<UpdateSpecialistDto>(model);
        var result = await _specialistService.UpdateSpecialistAsync(id, dto, cancellationToken);
        var viewModel = _mapper.Map<SpecialistViewModel>(result);
        return Ok(viewModel);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSpecialist(int id, CancellationToken cancellationToken)
    {
        await _specialistService.DeleteSpecialistAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPost("projects/{projectId}/assign")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignSpecialistToProject(
        int projectId,
        [FromBody] AssignSpecialistViewModel model,
        CancellationToken cancellationToken)
    {
        await _specialistService.AssignSpecialistToProjectAsync(
            projectId,
            model.SpecialistId,
            model.Role,
            cancellationToken);
        return NoContent();
    }

    [HttpDelete("projects/{projectId}/specialists/{specialistId}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveSpecialistFromProject(
        int projectId,
        int specialistId,
        CancellationToken cancellationToken)
    {
        await _specialistService.RemoveSpecialistFromProjectAsync(projectId, specialistId, cancellationToken);
        return NoContent();
    }

    [HttpGet("by-license-types")]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(IEnumerable<AvailableSpecialistViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AvailableSpecialistViewModel>>> GetSpecialistsByLicenseTypes(
        [FromQuery] int[] licenseTypeIds,
        CancellationToken cancellationToken)
    {
        var specialists = await _specialistService.GetSpecialistsByLicenseTypesAsync(licenseTypeIds, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<AvailableSpecialistViewModel>>(specialists);

        return Ok(viewModels);
    }

    /// <summary>
    /// Get available specialists for a project based on required license types
    /// </summary>
    [HttpGet("projects/{projectId}/available")]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(IEnumerable<AvailableSpecialistViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<AvailableSpecialistViewModel>>> GetAvailableSpecialistsForProject(
        int projectId,
        CancellationToken cancellationToken)
    {
        var project = await _projectService.GetProjectByIdAsync(projectId, cancellationToken);
        
        var specialists = await _specialistService.GetSpecialistsByLicenseTypesAsync(
            project.LicenseTypeIds.ToArray(), 
            cancellationToken);
        
        var viewModels = _mapper.Map<IEnumerable<AvailableSpecialistViewModel>>(specialists);

        return Ok(viewModels);
    }

    /// <summary>
    /// Get projects assigned to a specific specialist
    /// </summary>
    [HttpGet("{specialistId}/projects")]
    [Authorize(Roles = "Provider,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(IEnumerable<ProjectViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<ProjectViewModel>>> GetMyProjects(
        int specialistId,
        CancellationToken cancellationToken)
    {
        var projects = await _specialistService.GetSpecialistProjectsAsync(specialistId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ProjectViewModel>>(projects);
        return Ok(viewModels);
    }

    /// <summary>
    /// Get specialist statistics
    /// </summary>
    [HttpGet("{specialistId}/stats")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(SpecialistStatsViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpecialistStatsViewModel>> GetSpecialistStats(
        int specialistId,
        CancellationToken cancellationToken)
    {
        var stats = await _specialistService.GetSpecialistStatsAsync(specialistId, cancellationToken);
        var viewModel = _mapper.Map<SpecialistStatsViewModel>(stats);
        return Ok(viewModel);
    }

    /// <summary>
    /// Get current specialist profile (for Provider role)
    /// </summary>
    [HttpGet("me")]
    [Authorize(Roles = "Provider")]
    [ProducesResponseType(typeof(SpecialistDetailsViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpecialistDetailsViewModel>> GetCurrentSpecialistProfile(
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var specialist = await _specialistService.GetSpecialistByUserIdAsync(userId, cancellationToken);
        var viewModel = _mapper.Map<SpecialistDetailsViewModel>(specialist);
        return Ok(viewModel);
    }

    /// <summary>
    /// Update current specialist profile (for Provider role)
    /// </summary>
    [HttpPut("me")]
    [Authorize(Roles = "Provider")]
    [ProducesResponseType(typeof(SpecialistDetailsViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SpecialistDetailsViewModel>> UpdateMyProfile(
        [FromBody] UpdateSpecialistViewModel model,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var specialist = await _specialistService.GetSpecialistByUserIdAsync(userId, cancellationToken);
        
        var dto = _mapper.Map<UpdateSpecialistDto>(model);
        await _specialistService.UpdateSpecialistAsync(specialist.Id, dto, cancellationToken);
        
        // Get updated full profile
        var updatedSpecialist = await _specialistService.GetSpecialistByIdAsync(specialist.Id, cancellationToken);
        var viewModel = _mapper.Map<SpecialistDetailsViewModel>(updatedSpecialist);
        return Ok(viewModel);
    }
}
