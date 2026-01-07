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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User ID not found in token");

        var specialist = await _context.Specialists
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        
        if (specialist == null)
            throw new SpecialistNotFoundException($"Specialist profile not found for user {userId}");

        var dto = _mapper.Map<CreateBidResponseDto>(model);
        
        var dtoWithSpecialist = new CreateBidResponseDto
        {
            BidRequestId = dto.BidRequestId,
            SpecialistId = specialist.Id,
            CoverLetter = dto.CoverLetter,
            ProposedPrice = dto.ProposedPrice,
            EstimatedDays = dto.EstimatedDays
        };
        
        var result = await _bidService.CreateBidResponseAsync(dtoWithSpecialist, cancellationToken);
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
    public async Task<IActionResult> AcceptBidResponse(
        int id, 
        [FromBody] AcceptBidResponseViewModel model, 
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User ID not found in token");

        await _bidService.AcceptBidResponseAsync(
            id, 
            model.AdminMarkupPercentage, 
            model.AdminComment,
            userId,
            cancellationToken);
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
            BidRequestId = model.BidRequestId,
            SenderId = userId,
            MessageText = model.MessageText
        };

        var result = await _bidService.CreateMessageAsync(dto, cancellationToken);
        var viewModel = _mapper.Map<BidMessageViewModel>(result);

        return CreatedAtAction(nameof(GetMessagesByBidRequest), new { requestId = model.BidRequestId }, viewModel);
    }

    [HttpGet("requests/{requestId}/messages")]
    [ProducesResponseType(typeof(IEnumerable<BidMessageViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BidMessageViewModel>>> GetMessagesByBidRequest(
        int requestId,
        CancellationToken cancellationToken)
    {
        var messages = await _bidService.GetMessagesByBidRequestIdAsync(requestId, cancellationToken);
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
    [ProducesResponseType(typeof(SendBidResponseViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SendBidResponseViewModel>> SendBidRequest(
        [FromBody] SendBidRequestViewModel model,
        CancellationToken cancellationToken)
    {
        var clientId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(clientId))
            throw new UnauthorizedAccessException("User ID not found in token");

        var dto = _mapper.Map<SendBidRequestDto>(model);
        var bidRequestIds = await _bidService.SendBidRequestAsync(dto, clientId, cancellationToken);

        var response = new SendBidResponseViewModel
        {
            Message = $"Bid requests sent to {dto.SpecialistUserIds.Length} specialist(s)",
            BidRequestIds = bidRequestIds
        };

        return Ok(response);
    }

    [HttpGet("my-requests")]
    [Authorize(Roles = "Provider")]
    [ProducesResponseType(typeof(IEnumerable<BidRequestViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BidRequestViewModel>>> GetMyBidRequests(
        [FromQuery] string? status,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User ID not found in token");

        var specialist = await _context.Specialists
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        
        if (specialist == null)
            throw new SpecialistNotFoundException($"Specialist profile not found for user {userId}");

        IEnumerable<BidRequestDto> bidRequests;

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<BidRequestStatus>(status, ignoreCase: true, out var parsedStatus))
        {
            bidRequests = await _bidService.GetBidRequestsBySpecialistIdAndStatusAsync(
                specialist.Id, 
                parsedStatus, 
                cancellationToken);
        }
        else
        {
            bidRequests = await _bidService.GetBidRequestsBySpecialistIdAsync(
                specialist.Id, 
                cancellationToken);
        }

        var viewModels = _mapper.Map<IEnumerable<BidRequestViewModel>>(bidRequests);
        return Ok(viewModels);
    }

    [HttpGet("admin/project-statistics")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [ProducesResponseType(typeof(IEnumerable<ProjectBidStatisticsViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProjectBidStatisticsViewModel>>> GetProjectBidStatistics(
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User ID not found in token");

        var userRoles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
        var isAdmin = userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin");

        // Admin sees all projects, Client sees only their ClientManaged projects
        var statistics = await _bidService.GetProjectBidStatisticsAsync(
            clientId: isAdmin ? null : userId, 
            cancellationToken);

        var viewModels = _mapper.Map<IEnumerable<ProjectBidStatisticsViewModel>>(statistics);
        return Ok(viewModels);
    }

    [HttpGet("projects/{projectId}/responses")]
    public async Task<ActionResult<IEnumerable<BidResponseByProjectViewModel>>> GetBidResponsesByProjectId(int projectId, CancellationToken cancellationToken)
    {
        var dtos = await _bidService.GetBidResponsesByProjectIdAsync(projectId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<BidResponseByProjectViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpPost("requests/{bidRequestId}/attachments")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(BidRequestAttachmentViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BidRequestAttachmentViewModel>> UploadBidRequestAttachment(
        int bidRequestId,
        IFormFile file,
        string? description,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User ID not found in token");

        const long maxFileSize = 10 * 1024 * 1024; // 10MB
        if (file.Length > maxFileSize)
            return BadRequest("File size exceeds 10MB limit");

        var allowedContentTypes = new[]
        {
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/dwg",
            "application/dxf"
        };

        if (!allowedContentTypes.Contains(file.ContentType))
            return BadRequest($"File type {file.ContentType} is not allowed");

        using var stream = file.OpenReadStream();
        var dto = await _bidService.UploadBidRequestAttachmentAsync(
            bidRequestId,
            stream,
            file.FileName,
            file.ContentType,
            userId,
            description,
            cancellationToken);

        var viewModel = _mapper.Map<BidRequestAttachmentViewModel>(dto);
        return CreatedAtAction(nameof(GetBidRequestAttachments), new { bidRequestId }, viewModel);
    }

    [HttpGet("requests/{bidRequestId}/attachments")]
    [ProducesResponseType(typeof(IEnumerable<BidRequestAttachmentViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BidRequestAttachmentViewModel>>> GetBidRequestAttachments(
        int bidRequestId,
        CancellationToken cancellationToken)
    {
        var dtos = await _bidService.GetBidRequestAttachmentsAsync(bidRequestId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<BidRequestAttachmentViewModel>>(dtos);
        return Ok(viewModels);
    }

    [HttpDelete("attachments/{attachmentId}")]
    [Authorize(Roles = "Admin,SuperAdmin,Client")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteBidRequestAttachment(
        int attachmentId,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User ID not found in token");

        await _bidService.DeleteBidRequestAttachmentAsync(attachmentId, userId, cancellationToken);
        return NoContent();
    }

    [HttpPost("responses/{bidResponseId}/attachments")]
    [Authorize(Roles = "Provider")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadBidResponseAttachment(
        int bidResponseId,
        [FromForm] UploadBidResponseAttachmentViewModel model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User ID not found in token" });

        if (model.File.Length > 10 * 1024 * 1024)
            return BadRequest(new { message = "File size must not exceed 10MB" });

        var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".dwg", ".dxf", ".doc", ".docx" };
        var fileExtension = Path.GetExtension(model.File.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(fileExtension))
            return BadRequest(new { message = $"File type {fileExtension} is not allowed. Allowed types: {string.Join(", ", allowedExtensions)}" });

        using var stream = model.File.OpenReadStream();
        var attachmentDto = await _bidService.UploadBidResponseAttachmentAsync(
            bidResponseId,
            stream,
            model.File.FileName,
            model.File.ContentType,
            userId,
            model.Description);

        var viewModel = _mapper.Map<BidResponseAttachmentViewModel>(attachmentDto);
        return CreatedAtAction(
            nameof(GetBidResponseAttachments),
            new { bidResponseId },
            viewModel);
    }

    [HttpGet("responses/{bidResponseId}/attachments")]
    public async Task<IActionResult> GetBidResponseAttachments(int bidResponseId)
    {
        var attachments = await _bidService.GetBidResponseAttachmentsAsync(bidResponseId);
        var viewModels = _mapper.Map<IEnumerable<BidResponseAttachmentViewModel>>(attachments);
        return Ok(viewModels);
    }

    [HttpDelete("responses/attachments/{attachmentId}")]
    [Authorize(Roles = "Provider,Admin,SuperAdmin")]
    public async Task<IActionResult> DeleteBidResponseAttachment(int attachmentId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User ID not found in token" });

        await _bidService.DeleteBidResponseAttachmentAsync(attachmentId, userId);
        return NoContent();
    }
}
