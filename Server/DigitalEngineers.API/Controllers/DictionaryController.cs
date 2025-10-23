using AutoMapper;
using DigitalEngineers.API.ViewModels.Dictionary;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DictionaryController : ControllerBase
{
    private readonly IDictionaryService _dictionaryService;
    private readonly IMapper _mapper;

    public DictionaryController(IDictionaryService dictionaryService, IMapper mapper)
    {
        _dictionaryService = dictionaryService;
        _mapper = mapper;
    }

    [HttpGet("professional-types")]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetProfessionalTypes(CancellationToken cancellationToken)
    {
        var dtos = await _dictionaryService.GetProfessionalTypesAsync(cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ProfessionalTypeViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpGet("us-states")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetUSStates(CancellationToken cancellationToken)
    {
        var dtos = await _dictionaryService.GetStatesAsync(cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<StateViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpGet("professions")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetProfessions(CancellationToken cancellationToken)
    {
        var dtos = await _dictionaryService.GetProfessionsAsync(cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ProfessionViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpGet("license-types")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetLicenseTypes(CancellationToken cancellationToken)
    {
        var dtos = await _dictionaryService.GetLicenseTypesAsync(cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<LicenseTypeViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpGet("professions/{professionId}/license-types")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetLicenseTypesByProfessionId(int professionId, CancellationToken cancellationToken)
    {
        var dtos = await _dictionaryService.GetLicenseTypesByProfessionIdAsync(professionId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<LicenseTypeViewModel>>(dtos);
        return Ok(viewModels);
    }
}
