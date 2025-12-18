using System.Security.Claims;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/profession-types")]
public class ProfessionTypesController : ControllerBase
{
    private readonly IProfessionTypeService _professionTypeService;

    public ProfessionTypesController(IProfessionTypeService professionTypeService)
    {
        _professionTypeService = professionTypeService;
    }

    /// <summary>
    /// Get all active profession types
    /// </summary>
    [HttpGet]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<IEnumerable<ProfessionTypeDto>>> GetProfessionTypes(CancellationToken cancellationToken)
    {
        var result = await _professionTypeService.GetProfessionTypesAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get profession types by profession ID
    /// </summary>
    [HttpGet("by-profession/{professionId}")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<IEnumerable<ProfessionTypeDto>>> GetProfessionTypesByProfession(int professionId, CancellationToken cancellationToken)
    {
        var result = await _professionTypeService.GetProfessionTypesByProfessionIdAsync(professionId, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get profession type by ID with full details
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProfessionTypeDetailDto>> GetProfessionType(int id, CancellationToken cancellationToken)
    {
        var result = await _professionTypeService.GetProfessionTypeByIdAsync(id, cancellationToken);
        if (result == null)
            return NotFound();
        
        return Ok(result);
    }

    /// <summary>
    /// Create a new profession type (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ProfessionTypeDto>> CreateProfessionType(
        [FromBody] CreateProfessionTypeDto dto,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _professionTypeService.CreateProfessionTypeAsync(dto, userId, cancellationToken);
        return CreatedAtAction(nameof(GetProfessionType), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update a profession type (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ProfessionTypeDto>> UpdateProfessionType(
        int id,
        [FromBody] UpdateProfessionTypeDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _professionTypeService.UpdateProfessionTypeAsync(id, dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Approve or reject a profession type (Admin only)
    /// </summary>
    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ProfessionTypeDto>> ApproveProfessionType(
        int id,
        [FromBody] ApproveProfessionTypeDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _professionTypeService.ApproveProfessionTypeAsync(id, dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Delete a profession type (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> DeleteProfessionType(int id, CancellationToken cancellationToken)
    {
        await _professionTypeService.DeleteProfessionTypeAsync(id, cancellationToken);
        return NoContent();
    }

    // ==================== LICENSE REQUIREMENTS ====================

    /// <summary>
    /// Add a license requirement to a profession type (Admin only)
    /// </summary>
    [HttpPost("{professionTypeId}/license-requirements")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<LicenseRequirementDto>> AddLicenseRequirement(
        int professionTypeId,
        [FromBody] CreateLicenseRequirementDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _professionTypeService.AddLicenseRequirementAsync(professionTypeId, dto, cancellationToken);
        return CreatedAtAction(nameof(GetProfessionType), new { id = professionTypeId }, result);
    }

    /// <summary>
    /// Update a license requirement (Admin only)
    /// </summary>
    [HttpPut("{professionTypeId}/license-requirements/{licenseTypeId}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<LicenseRequirementDto>> UpdateLicenseRequirement(
        int professionTypeId,
        int licenseTypeId,
        [FromBody] UpdateLicenseRequirementDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _professionTypeService.UpdateLicenseRequirementAsync(professionTypeId, licenseTypeId, dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Remove a license requirement from a profession type (Admin only)
    /// </summary>
    [HttpDelete("{professionTypeId}/license-requirements/{licenseTypeId}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> RemoveLicenseRequirement(
        int professionTypeId,
        int licenseTypeId,
        CancellationToken cancellationToken)
    {
        await _professionTypeService.RemoveLicenseRequirementAsync(professionTypeId, licenseTypeId, cancellationToken);
        return NoContent();
    }
}
