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
public class PortfolioController : ControllerBase
{
    private readonly IPortfolioService _portfolioService;
    private readonly IMapper _mapper;

    public PortfolioController(IPortfolioService portfolioService, IMapper mapper)
    {
        _portfolioService = portfolioService;
        _mapper = mapper;
    }

    [HttpPost("specialists/{specialistId}")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(PortfolioItemViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PortfolioItemViewModel>> CreatePortfolioItem(
        int specialistId,
        [FromForm] CreatePortfolioItemViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<CreatePortfolioItemDto>(model);

        Stream? thumbnailStream = model.Thumbnail?.OpenReadStream();
        string? fileName = model.Thumbnail?.FileName;
        string? contentType = model.Thumbnail?.ContentType;

        var result = await _portfolioService.CreatePortfolioItemAsync(
            specialistId,
            dto,
            thumbnailStream,
            fileName,
            contentType,
            cancellationToken);

        var viewModel = _mapper.Map<PortfolioItemViewModel>(result);

        return CreatedAtAction(
            nameof(GetPortfolioItemById),
            new { id = viewModel.Id },
            viewModel);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PortfolioItemViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortfolioItemViewModel>> GetPortfolioItemById(
        int id,
        CancellationToken cancellationToken)
    {
        var portfolioItem = await _portfolioService.GetPortfolioItemByIdAsync(id, cancellationToken);
        var viewModel = _mapper.Map<PortfolioItemViewModel>(portfolioItem);
        return Ok(viewModel);
    }

    [HttpGet("specialists/{specialistId}")]
    [ProducesResponseType(typeof(IEnumerable<PortfolioItemViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PortfolioItemViewModel>>> GetPortfolioItemsBySpecialist(
        int specialistId,
        CancellationToken cancellationToken)
    {
        var portfolioItems = await _portfolioService.GetPortfolioItemsBySpecialistIdAsync(specialistId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<PortfolioItemViewModel>>(portfolioItems);
        return Ok(viewModels);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PortfolioItemViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PortfolioItemViewModel>> UpdatePortfolioItem(
        int id,
        [FromBody] CreatePortfolioItemViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<CreatePortfolioItemDto>(model);
        var result = await _portfolioService.UpdatePortfolioItemAsync(id, dto, cancellationToken);
        var viewModel = _mapper.Map<PortfolioItemViewModel>(result);
        return Ok(viewModel);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletePortfolioItem(
        int id,
        CancellationToken cancellationToken)
    {
        await _portfolioService.DeletePortfolioItemAsync(id, cancellationToken);
        return NoContent();
    }
}
