using AutoMapper;
using DigitalEngineers.API.ViewModels.Bid;
using DigitalEngineers.API.ViewModels.Specialist;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BidsController : ControllerBase
{
    private readonly IBidService _bidService;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;

    public BidsController(IBidService bidService, IMapper mapper, ApplicationDbContext context)
    {
        _bidService = bidService;
        _mapper = mapper;
        _context = context;
    }

    [HttpPost("requests")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [ProducesResponseType(typeof(BidRequestViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BidRequestViewModel>> CreateBidRequest(
        [FromBody] CreateBidRequestViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<CreateBidRequestDto>(model);
        var result = await _bidService.CreateBidRequestAsync(dto, cancellationToken);
        var viewModel = _mapper.Map<BidRequestViewModel>(result);

        return CreatedAtAction(nameof(GetBidRequestById), new { id = viewModel.Id }, viewModel);
    }

    [HttpGet("requests/{id}")]
    [ProducesResponseType(typeof(BidRequestDetailsViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BidRequestDetailsViewModel>> GetBidRequestById(
        int id,
        CancellationToken cancellationToken)
    {
        var bidRequest = await _bidService.GetBidRequestByIdAsync(id, cancellationToken);
        var viewModel = _mapper.Map<BidRequestDetailsViewModel>(bidRequest);
        return Ok(viewModel);
    }

    [HttpGet("projects/{projectId}/requests")]
    [ProducesResponseType(typeof(IEnumerable<BidRequestViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BidRequestViewModel>>> GetBidRequestsByProject(
        int projectId,
        CancellationToken cancellationToken)
    {
        var bidRequests = await _bidService.GetBidRequestsByProjectIdAsync(projectId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<BidRequestViewModel>>(bidRequests);
        return Ok(viewModels);
    }

    [HttpPut("requests/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [ProducesResponseType(typeof(BidRequestViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BidRequestViewModel>> UpdateBidRequest(
        int id,
        [FromBody] UpdateBidRequestViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<UpdateBidRequestDto>(model);
        var result = await _bidService.UpdateBidRequestAsync(id, dto, cancellationToken);
        var viewModel = _mapper.Map<BidRequestViewModel>(result);
        return Ok(viewModel);
    }

    [HttpPatch("requests/{id}/status")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [ProducesResponseType(typeof(BidRequestViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BidRequestViewModel>> UpdateBidRequestStatus(
        int id,
        [FromBody] string status,
        CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<BidRequestStatus>(status, ignoreCase: true, out var parsedStatus))
            throw new ArgumentException($"Invalid status: {status}");

        var result = await _bidService.UpdateBidRequestStatusAsync(id, parsedStatus, cancellationToken);
        var viewModel = _mapper.Map<BidRequestViewModel>(result);
        return Ok(viewModel);
    }

    [HttpDelete("requests/{id}")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteBidRequest(int id, CancellationToken cancellationToken)
    {
        await _bidService.DeleteBidRequestAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPost("responses")]
    [Authorize(Roles = "Provider")]
    [ProducesResponseType(typeof(BidResponseViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BidResponseViewModel>> CreateBidResponse(
        [FromBody] CreateBidResponseViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<CreateBidResponseDto>(model);
        var result = await _bidService.CreateBidResponseAsync(dto, cancellationToken);
        var viewModel = _mapper.Map<BidResponseViewModel>(result);

        return CreatedAtAction(nameof(GetBidResponseById), new { id = viewModel.Id }, viewModel);
    }

    [HttpGet("responses/{id}")]
    [ProducesResponseType(typeof(BidResponseDetailsViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BidResponseDetailsViewModel>> GetBidResponseById(
        int id,
        CancellationToken cancellationToken)
    {
        var bidResponse = await _bidService.GetBidResponseByIdAsync(id, cancellationToken);
        var viewModel = _mapper.Map<BidResponseDetailsViewModel>(bidResponse);
        return Ok(viewModel);
    }

    [HttpGet("requests/{requestId}/responses")]
    [ProducesResponseType(typeof(IEnumerable<BidResponseViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BidResponseViewModel>>> GetBidResponsesByRequest(
        int requestId,
        CancellationToken cancellationToken)
    {
        var bidResponses = await _bidService.GetBidResponsesByRequestIdAsync(requestId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<BidResponseViewModel>>(bidResponses);
        return Ok(viewModels);
    }

    [HttpPut("responses/{id}")]
    [Authorize(Roles = "Provider")]
    [ProducesResponseType(typeof(BidResponseViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BidResponseViewModel>> UpdateBidResponse(
        int id,
        [FromBody] UpdateBidResponseViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<UpdateBidResponseDto>(model);
        var result = await _bidService.UpdateBidResponseAsync(id, dto, cancellationToken);
        var viewModel = _mapper.Map<BidResponseViewModel>(result);
        return Ok(viewModel);
    }

    [HttpPost("responses/{id}/accept")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AcceptBidResponse(int id, CancellationToken cancellationToken)
    {
        await _bidService.AcceptBidResponseAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPost("responses/{id}/reject")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RejectBidResponse(
        int id,
        [FromBody] RejectBidResponseViewModel model,
        CancellationToken cancellationToken)
    {
        await _bidService.RejectBidResponseAsync(id, model.Reason, cancellationToken);
        return NoContent();
    }

    [HttpPost("messages")]
    [ProducesResponseType(typeof(BidMessageViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BidMessageViewModel>> CreateMessage(
        [FromBody] CreateBidMessageViewModel model,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User ID not found in token");

        var dto = new CreateBidMessageDto
        {
            BidResponseId = model.BidResponseId,
            SenderId = userId,
            MessageText = model.MessageText
        };

        var result = await _bidService.CreateMessageAsync(dto, cancellationToken);
        var viewModel = _mapper.Map<BidMessageViewModel>(result);

        return CreatedAtAction(nameof(GetMessagesByBidResponse), new { responseId = model.BidResponseId }, viewModel);
    }

    [HttpGet("responses/{responseId}/messages")]
    [ProducesResponseType(typeof(IEnumerable<BidMessageViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BidMessageViewModel>>> GetMessagesByBidResponse(
        int responseId,
        CancellationToken cancellationToken)
    {
        var messages = await _bidService.GetMessagesByBidResponseIdAsync(responseId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<BidMessageViewModel>>(messages);
        return Ok(viewModels);
    }

    [HttpDelete("messages/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteMessage(int id, CancellationToken cancellationToken)
    {
        await _bidService.DeleteMessageAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPost("send")]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<int>> SendBidRequest(
        [FromBody] SendBidRequestViewModel model,
        CancellationToken cancellationToken)
    {
        var clientId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(clientId))
            throw new UnauthorizedAccessException("User ID not found in token");

        var dto = _mapper.Map<SendBidRequestDto>(model);
        await _bidService.SendBidRequestAsync(dto, clientId, cancellationToken);

        return Ok(new { message = $"Bid requests sent to {dto.SpecialistUserIds.Length} specialist(s)" });
    }
}
