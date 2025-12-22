using System.Security.Claims;
using AutoMapper;
using DigitalEngineers.API.ViewModels;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupController : ControllerBase
{
    private readonly ILookupService _lookupService;
    private readonly IProfessionTypeService _professionTypeService;
    private readonly IMapper _mapper;

    public LookupController(
        ILookupService lookupService, 
        IProfessionTypeService professionTypeService,
        IMapper mapper)
    {
        _lookupService = lookupService;
        _professionTypeService = professionTypeService;
        _mapper = mapper;
    }

    [HttpGet("states")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetUSStates(CancellationToken cancellationToken)
    {
        var dtos = await _lookupService.GetStatesAsync(cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<StateViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpGet("professions")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetProfessions(CancellationToken cancellationToken)
    {
        var dtos = await _lookupService.GetProfessionsAsync(cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ProfessionViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpGet("professions/{professionId}/profession-types")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetProfessionTypesByProfession(int professionId, CancellationToken cancellationToken)
    {
        var dtos = await _professionTypeService.GetProfessionTypesByProfessionIdAsync(professionId, cancellationToken);
        return Ok(dtos);
    }

    [HttpGet("license-types")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetLicenseTypes(CancellationToken cancellationToken)
    {
        var dtos = await _lookupService.GetLicenseTypesAsync(cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<LicenseTypeViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpGet("professions/{professionId}/license-types")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetLicenseTypesByProfessionId(int professionId, CancellationToken cancellationToken)
    {
        var dtos = await _lookupService.GetLicenseTypesByProfessionIdAsync(professionId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<LicenseTypeViewModel>>(dtos);
        return Ok(viewModels);
    }
    
    // ==================== ADMIN ENDPOINTS ====================
    
    /// <summary>
    /// Admin gets all professions with management info
    /// </summary>
    [HttpGet("professions/management")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetProfessionsForManagement(CancellationToken cancellationToken)
    {
        var result = await _lookupService.GetAllProfessionsForManagementAsync(cancellationToken);
        return Ok(result);
    }
    
    /// <summary>
    /// Admin gets all license types with management info
    /// </summary>
    [HttpGet("license-types/management")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetLicenseTypesForManagement(CancellationToken cancellationToken)
    {
        var result = await _lookupService.GetAllLicenseTypesForManagementAsync(cancellationToken);
        return Ok(result);
    }
    
    /// <summary>
    /// Admin creates a new profession
    /// </summary>
    [HttpPost("professions")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> CreateProfession(
        [FromBody] CreateProfessionDto dto, 
        CancellationToken cancellationToken)
    {
        var result = await _lookupService.CreateProfessionAsync(dto, cancellationToken);
        var viewModel = _mapper.Map<ProfessionViewModel>(result);
        return CreatedAtAction(nameof(GetProfessions), new { id = result.Id }, viewModel);
    }
    
    /// <summary>
    /// Admin creates a new license type
    /// </summary>
    [HttpPost("license-types")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> CreateLicenseType(
        [FromBody] CreateLicenseTypeDto dto, 
        CancellationToken cancellationToken)
    {
        var result = await _lookupService.CreateLicenseTypeAsync(dto, cancellationToken);
        var viewModel = _mapper.Map<LicenseTypeViewModel>(result);
        return CreatedAtAction(nameof(GetLicenseTypes), new { id = result.Id }, viewModel);
    }
    
    /// <summary>
    /// Admin updates a profession
    /// </summary>
    [HttpPut("professions/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> UpdateProfession(
        int id, 
        [FromBody] UpdateProfessionDto dto, 
        CancellationToken cancellationToken)
    {
        var result = await _lookupService.UpdateProfessionAsync(id, dto, cancellationToken);
        return Ok(result);
    }
    
    /// <summary>
    /// Admin deletes a profession
    /// </summary>
    [HttpDelete("professions/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> DeleteProfession(int id, CancellationToken cancellationToken)
    {
        await _lookupService.DeleteProfessionAsync(id, cancellationToken);
        return NoContent();
    }
    
    /// <summary>
    /// Admin updates a license type
    /// </summary>
    [HttpPut("license-types/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> UpdateLicenseType(
        int id, 
        [FromBody] UpdateLicenseTypeDto dto, 
        CancellationToken cancellationToken)
    {
        var result = await _lookupService.UpdateLicenseTypeAsync(id, dto, cancellationToken);
        return Ok(result);
    }
    
    /// <summary>
    /// Admin deletes a license type
    /// </summary>
    [HttpDelete("license-types/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> DeleteLicenseType(int id, CancellationToken cancellationToken)
    {
        await _lookupService.DeleteLicenseTypeAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("export")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<ExportDictionariesDto>> ExportDictionaries(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var data = await _lookupService.ExportDictionariesAsync(userId, cancellationToken);
        return Ok(data);
    }

    [HttpPost("import")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<ImportResultDto>> ImportDictionaries(
        [FromBody] ImportDictionariesDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _lookupService.ImportDictionariesAsync(dto, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
