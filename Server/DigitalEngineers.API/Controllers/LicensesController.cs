using DigitalEngineers.API.ViewModels.License;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LicensesController : ControllerBase
{
    private readonly ILicensesService _licensesService;
    private readonly ISpecialistService _specialistService;
    private readonly IFileStorageService _fileStorageService;

    public LicensesController(
        ILicensesService licensesService,
        ISpecialistService specialistService,
        IFileStorageService fileStorageService)
    {
        _licensesService = licensesService;
        _specialistService = specialistService;
        _fileStorageService = fileStorageService;
    }

    [HttpPost("requests")]
    [Authorize(Roles = "Provider")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<LicenseRequestViewModel>> CreateLicenseRequest(
        [FromForm] CreateLicenseRequestViewModel model,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var specialist = await _specialistService.GetSpecialistByUserIdAsync(userId, cancellationToken);

        if (model.File.Length > 10 * 1024 * 1024)
            throw new ArgumentException("File size must not exceed 10MB");

        var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
        var fileExtension = Path.GetExtension(model.File.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
            throw new ArgumentException($"Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}");

        string licenseFileUrl;
        using (var fileStream = model.File.OpenReadStream())
        {
            var fileName = $"{Path.GetFileNameWithoutExtension(model.File.FileName)}{fileExtension}";
            licenseFileUrl = await _fileStorageService.UploadLicenseFileAsync(
                fileStream,
                fileName,
                model.File.ContentType,
                specialist.Id,
                cancellationToken);
        }

        var dto = new CreateLicenseRequestDto
        {
            ProfessionTypeId = model.ProfessionTypeId,
            LicenseTypeId = model.LicenseTypeId,
            State = model.State,
            IssuingAuthority = model.IssuingAuthority,
            IssueDate = model.IssueDate,
            ExpirationDate = model.ExpirationDate,
            LicenseNumber = model.LicenseNumber,
            LicenseFileUrl = licenseFileUrl
        };

        var result = await _licensesService.CreateLicenseRequestAsync(specialist.Id, dto, cancellationToken);
        var viewModel = MapToViewModel(result);

        return CreatedAtAction(nameof(GetLicenseRequestById), new { id = viewModel.Id }, viewModel);
    }

    [HttpGet("requests/me")]
    [Authorize(Roles = "Provider")]
    public async Task<ActionResult<IEnumerable<LicenseRequestViewModel>>> GetMyLicenseRequests(
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var specialist = await _specialistService.GetSpecialistByUserIdAsync(userId, cancellationToken);

        var requests = await _licensesService.GetSpecialistLicenseRequestsAsync(specialist.Id, cancellationToken);
        var viewModels = requests.Select(MapToViewModel);

        return Ok(viewModels);
    }

    [HttpGet("requests/pending")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IEnumerable<LicenseRequestViewModel>>> GetPendingLicenseRequests(
        CancellationToken cancellationToken)
    {
        var requests = await _licensesService.GetPendingLicenseRequestsAsync(cancellationToken);
        var viewModels = requests.Select(MapToViewModel);

        return Ok(viewModels);
    }

    [HttpGet("requests/{id}")]
    public async Task<ActionResult<LicenseRequestViewModel>> GetLicenseRequestById(
        int id,
        CancellationToken cancellationToken)
    {
        var request = await _licensesService.GetLicenseRequestByIdAsync(id, cancellationToken);
        var viewModel = MapToViewModel(request);

        return Ok(viewModel);
    }

    [HttpPut("requests/{id}/approve")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<LicenseRequestViewModel>> ApproveLicenseRequest(
        int id,
        [FromBody] ReviewLicenseRequestViewModel model,
        CancellationToken cancellationToken)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var dto = new ReviewLicenseRequestDto
        {
            SpecialistId = model.SpecialistId,
            LicenseTypeId = model.LicenseTypeId,
            ProfessionTypeId = model.ProfessionTypeId,
            AdminComment = model.AdminComment
        };

        var result = await _licensesService.ApproveLicenseRequestAsync(
            model.SpecialistId, 
            model.LicenseTypeId,
            model.ProfessionTypeId,
            adminId, 
            dto, 
            cancellationToken);
        var viewModel = MapToViewModel(result);

        return Ok(viewModel);
    }

    [HttpPut("requests/{id}/reject")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<LicenseRequestViewModel>> RejectLicenseRequest(
        int id,
        [FromBody] ReviewLicenseRequestViewModel model,
        CancellationToken cancellationToken)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var dto = new ReviewLicenseRequestDto
        {
            SpecialistId = model.SpecialistId,
            LicenseTypeId = model.LicenseTypeId,
            ProfessionTypeId = model.ProfessionTypeId,
            AdminComment = model.AdminComment
        };

        var result = await _licensesService.RejectLicenseRequestAsync(
            model.SpecialistId, 
            model.LicenseTypeId,
            model.ProfessionTypeId,
            adminId, 
            dto, 
            cancellationToken);
        var viewModel = MapToViewModel(result);

        return Ok(viewModel);
    }

    [HttpPut("requests/{specialistId}/{licenseTypeId}/{professionTypeId}/resubmit")]
    [Authorize(Roles = "Provider")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<LicenseRequestViewModel>> ResubmitLicenseRequest(
        int specialistId,
        int licenseTypeId,
        int professionTypeId,
        [FromForm] ResubmitLicenseRequestViewModel model,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var specialist = await _specialistService.GetSpecialistByUserIdAsync(userId, cancellationToken);

        // Verify the specialist owns this license request
        if (specialist.Id != specialistId)
            return Forbid();

        string? licenseFileUrl = null;
        if (model.File != null)
        {
            if (model.File.Length > 10 * 1024 * 1024)
                throw new ArgumentException("File size must not exceed 10MB");

            var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(model.File.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
                throw new ArgumentException($"Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}");

            using var fileStream = model.File.OpenReadStream();
            var fileName = $"{Path.GetFileNameWithoutExtension(model.File.FileName)}{fileExtension}";
            licenseFileUrl = await _fileStorageService.UploadLicenseFileAsync(
                fileStream,
                fileName,
                model.File.ContentType,
                specialist.Id,
                cancellationToken);
        }

        var dto = new ResubmitLicenseRequestDto
        {
            State = model.State,
            IssuingAuthority = model.IssuingAuthority,
            IssueDate = model.IssueDate,
            ExpirationDate = model.ExpirationDate,
            LicenseNumber = model.LicenseNumber,
            LicenseFileUrl = licenseFileUrl
        };

        var result = await _licensesService.ResubmitLicenseRequestAsync(specialistId, licenseTypeId, professionTypeId, dto, cancellationToken);
        var viewModel = MapToViewModel(result);

        return Ok(viewModel);
    }

    [HttpDelete("requests/{id}")]
    [Authorize(Roles = "Provider")]
    public async Task<IActionResult> DeleteLicenseRequest(
        int id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var specialist = await _specialistService.GetSpecialistByUserIdAsync(userId, cancellationToken);

        await _licensesService.DeleteLicenseRequestAsync(id, specialist.Id, cancellationToken);

        return NoContent();
    }

    private static LicenseRequestViewModel MapToViewModel(LicenseRequestDto dto)
    {
        return new LicenseRequestViewModel
        {
            Id = dto.Id,
            SpecialistId = dto.SpecialistId,
            SpecialistName = dto.SpecialistName,
            SpecialistEmail = dto.SpecialistEmail,
            LicenseTypeId = dto.LicenseTypeId,
            LicenseTypeName = dto.LicenseTypeName,
            ProfessionTypeId = dto.ProfessionTypeId,
            ProfessionTypeName = dto.ProfessionTypeName,
            State = dto.State,
            IssuingAuthority = dto.IssuingAuthority,
            IssueDate = dto.IssueDate,
           ExpirationDate = dto.ExpirationDate,
            LicenseNumber = dto.LicenseNumber,
            LicenseFileUrl = dto.LicenseFileUrl,
            Status = dto.Status.ToString(),
            AdminComment = dto.AdminComment,
            ReviewedBy = dto.ReviewedBy,
            ReviewedAt = dto.ReviewedAt,
            CreatedAt = dto.CreatedAt,
            UpdatedAt = dto.UpdatedAt
        };
    }
}
