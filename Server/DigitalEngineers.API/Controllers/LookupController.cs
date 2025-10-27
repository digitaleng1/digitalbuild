using AutoMapper;
using DigitalEngineers.API.ViewModels;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupController : ControllerBase
{
    private readonly ILookupService _lookupService;
    private readonly IMapper _mapper;

    public LookupController(ILookupService lookupService, IMapper mapper)
    {
        _lookupService = lookupService;
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
}
