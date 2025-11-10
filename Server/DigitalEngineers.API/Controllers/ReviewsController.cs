using DigitalEngineers.API.ViewModels.Review;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/reviews")]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<ReviewViewModel>> CreateReview([FromBody] CreateReviewViewModel model, CancellationToken cancellationToken)
    {
        var clientId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var dto = new CreateReviewDto
        {
            ProjectId = model.ProjectId,
            SpecialistId = model.SpecialistId,
            Rating = model.Rating,
            Comment = model.Comment
        };

        var result = await _reviewService.CreateReviewAsync(dto, clientId, cancellationToken);

        var viewModel = new ReviewViewModel
        {
            Id = result.Id,
            ProjectId = result.ProjectId,
            ProjectName = result.ProjectName,
            ClientName = result.ClientName,
            ClientAvatar = result.ClientAvatar,
            Rating = result.Rating,
            Comment = result.Comment,
            CreatedAt = result.CreatedAt
        };

        return CreatedAtAction(nameof(GetReviewsBySpecialistId), new { specialistId = model.SpecialistId }, viewModel);
    }

    [HttpGet("specialists/{specialistId}")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ReviewViewModel>>> GetReviewsBySpecialistId(int specialistId, CancellationToken cancellationToken)
    {
        var reviews = await _reviewService.GetReviewsBySpecialistIdAsync(specialistId, cancellationToken);

        var viewModels = reviews.Select(r => new ReviewViewModel
        {
            Id = r.Id,
            ProjectId = r.ProjectId,
            ProjectName = r.ProjectName,
            ClientName = r.ClientName,
            ClientAvatar = r.ClientAvatar,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        });

        return Ok(viewModels);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<ReviewViewModel>> UpdateReview(int id, [FromBody] CreateReviewViewModel model, CancellationToken cancellationToken)
    {
        var clientId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var dto = new CreateReviewDto
        {
            ProjectId = model.ProjectId,
            SpecialistId = model.SpecialistId,
            Rating = model.Rating,
            Comment = model.Comment
        };

        var result = await _reviewService.UpdateReviewAsync(id, dto, clientId, cancellationToken);

        var viewModel = new ReviewViewModel
        {
            Id = result.Id,
            ProjectId = result.ProjectId,
            ProjectName = result.ProjectName,
            ClientName = result.ClientName,
            ClientAvatar = result.ClientAvatar,
            Rating = result.Rating,
            Comment = result.Comment,
            CreatedAt = result.CreatedAt
        };

        return Ok(viewModel);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> DeleteReview(int id, CancellationToken cancellationToken)
    {
        var clientId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _reviewService.DeleteReviewAsync(id, clientId, cancellationToken);
        return NoContent();
    }
}
