using AutoMapper;
using DigitalEngineers.API.ViewModels.Specialist;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SpecialistsController : ControllerBase
{
    private readonly ISpecialistService _specialistService;
    private readonly IMapper _mapper;

    public SpecialistsController(ISpecialistService specialistService, IMapper mapper)
    {
        _specialistService = specialistService;
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
}
