using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class LicensesService : ILicensesService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly IEmailService _emailService;
    private readonly ILogger<LicensesService> _logger;

    public LicensesService(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        IEmailService emailService,
        ILogger<LicensesService> logger)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<LicenseRequestDto> CreateLicenseRequestAsync(
        int specialistId,
        CreateLicenseRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Specialists
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == specialistId, cancellationToken);

        if (specialist == null)
            throw new SpecialistNotFoundException(specialistId);

        var licenseType = await _context.LicenseTypes
            .FirstOrDefaultAsync(lt => lt.Id == dto.LicenseTypeId, cancellationToken);

        if (licenseType == null)
            throw new ArgumentException($"License type with ID {dto.LicenseTypeId} not found");

        var professionType = await _context.ProfessionTypes
            .FirstOrDefaultAsync(pt => pt.Id == dto.ProfessionTypeId, cancellationToken);

        if (professionType == null)
            throw new ArgumentException($"Profession type with ID {dto.ProfessionTypeId} not found");

        var existingLicense = await _context.SpecialistLicenseTypes
            .FirstOrDefaultAsync(slt => slt.SpecialistId == specialistId 
                && slt.LicenseTypeId == dto.LicenseTypeId
                && slt.ProfessionTypeId == dto.ProfessionTypeId, 
                cancellationToken);

        if (existingLicense != null)
        {
            if (existingLicense.Status == LicenseRequestStatus.Pending)
                throw new InvalidOperationException("A pending license request for this license type and profession type already exists");
            
            if (existingLicense.Status == LicenseRequestStatus.Approved)
                throw new InvalidOperationException("This license type is already approved for this specialist and profession type");
        }

        var licenseRequest = new SpecialistLicenseType
        {
            SpecialistId = specialistId,
            LicenseTypeId = dto.LicenseTypeId,
            ProfessionTypeId = dto.ProfessionTypeId,
            State = dto.State,
            IssuingAuthority = dto.IssuingAuthority,
            IssueDate = DateTime.SpecifyKind(dto.IssueDate, DateTimeKind.Utc),
            ExpirationDate = DateTime.SpecifyKind(dto.ExpirationDate, DateTimeKind.Utc),
            LicenseNumber = dto.LicenseNumber,
            LicenseFileUrl = dto.LicenseFileUrl,
            Status = LicenseRequestStatus.Pending,
            IsVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.SpecialistLicenseTypes.Add(licenseRequest);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(licenseRequest, specialist, licenseType, professionType);
    }

    public async Task<IEnumerable<LicenseRequestDto>> GetSpecialistLicenseRequestsAsync(
        int specialistId,
        CancellationToken cancellationToken = default)
    {
        var requests = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .Include(slt => slt.ProfessionType)
            .Where(slt => slt.SpecialistId == specialistId)
            .OrderByDescending(slt => slt.CreatedAt)
            .ToListAsync(cancellationToken);

        return requests.Select(slt => MapToDto(slt, slt.Specialist, slt.LicenseType, slt.ProfessionType));
    }

    public async Task<IEnumerable<LicenseRequestDto>> GetPendingLicenseRequestsAsync(
        CancellationToken cancellationToken = default)
    {
        var requests = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .Include(slt => slt.ProfessionType)
            .Where(slt => slt.Status == LicenseRequestStatus.Pending)
            .OrderBy(slt => slt.CreatedAt)
            .ToListAsync(cancellationToken);

        return requests.Select(slt => MapToDto(slt, slt.Specialist, slt.LicenseType, slt.ProfessionType));
    }

    public async Task<LicenseRequestDto> GetLicenseRequestByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        // ID is actually SpecialistId in this case (composite key)
        var request = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .Include(slt => slt.ProfessionType)
            .FirstOrDefaultAsync(slt => slt.SpecialistId == id, cancellationToken);

        if (request == null)
            throw new LicenseRequestNotFoundException(id);

        return MapToDto(request, request.Specialist, request.LicenseType, request.ProfessionType);
    }

    public async Task<LicenseRequestDto> ApproveLicenseRequestAsync(
        int specialistId,
        int licenseTypeId,
        int professionTypeId,
        string adminId,
        ReviewLicenseRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var request = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .Include(slt => slt.ProfessionType)
            .FirstOrDefaultAsync(slt => slt.SpecialistId == specialistId 
                && slt.LicenseTypeId == licenseTypeId
                && slt.ProfessionTypeId == professionTypeId, cancellationToken);

        if (request == null)
            throw new LicenseRequestNotFoundException(specialistId);

        if (request.Status != LicenseRequestStatus.Pending)
            throw new InvalidOperationException($"License request is already {request.Status}");

        request.Status = LicenseRequestStatus.Approved;
        request.AdminComment = dto.AdminComment;
        request.IsVerified = true;
        request.VerifiedBy = adminId;
        request.VerifiedAt = DateTime.UtcNow;
        request.ReviewedAt = DateTime.UtcNow;
        request.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Send approval email
        try
        {
            var specialistName = $"{request.Specialist.User.FirstName} {request.Specialist.User.LastName}";
            await _emailService.SendLicenseRequestApprovedNotificationAsync(
                request.Specialist.User.Email!,
                specialistName,
                request.LicenseType.Name,
                request.State ?? string.Empty,
                request.AdminComment,
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send license approval email to {Email}", request.Specialist.User.Email);
        }

        return MapToDto(request, request.Specialist, request.LicenseType, request.ProfessionType);
    }

    public async Task<LicenseRequestDto> RejectLicenseRequestAsync(
        int specialistId,
        int licenseTypeId,
        int professionTypeId,
        string adminId,
        ReviewLicenseRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var request = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .Include(slt => slt.ProfessionType)
            .FirstOrDefaultAsync(slt => slt.SpecialistId == specialistId 
                && slt.LicenseTypeId == licenseTypeId
                && slt.ProfessionTypeId == professionTypeId, cancellationToken);

        if (request == null)
            throw new LicenseRequestNotFoundException(specialistId);

        if (request.Status != LicenseRequestStatus.Pending)
            throw new InvalidOperationException($"License request is already {request.Status}");

        if (string.IsNullOrWhiteSpace(dto.AdminComment))
            throw new ArgumentException("Admin comment (reason) is required when rejecting a license request", nameof(dto.AdminComment));

        request.Status = LicenseRequestStatus.Rejected;
        request.AdminComment = dto.AdminComment;
        request.IsVerified = false;
        request.VerifiedBy = adminId;
        request.ReviewedAt = DateTime.UtcNow;
        request.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Send rejection email
        try
        {
            var specialistName = $"{request.Specialist.User.FirstName} {request.Specialist.User.LastName}";
            await _emailService.SendLicenseRequestRejectedNotificationAsync(
                request.Specialist.User.Email!,
                specialistName,
                request.LicenseType.Name,
                request.State ?? string.Empty,
                request.AdminComment,
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send license rejection email to {Email}", request.Specialist.User.Email);
        }

        return MapToDto(request, request.Specialist, request.LicenseType, request.ProfessionType);
    }

    public async Task<LicenseRequestDto> ResubmitLicenseRequestAsync(
        int specialistId,
        int licenseTypeId,
        int professionTypeId,
        ResubmitLicenseRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var request = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .Include(slt => slt.ProfessionType)
            .FirstOrDefaultAsync(slt => slt.SpecialistId == specialistId 
                && slt.LicenseTypeId == licenseTypeId
                && slt.ProfessionTypeId == professionTypeId, cancellationToken);

        if (request == null)
            throw new LicenseRequestNotFoundException(specialistId);

        if (request.Status != LicenseRequestStatus.Rejected)
            throw new InvalidOperationException("Only rejected license requests can be resubmitted");

        // Update license request data
        request.State = dto.State;
        request.IssuingAuthority = dto.IssuingAuthority;
        request.IssueDate = DateTime.SpecifyKind(dto.IssueDate, DateTimeKind.Utc);
        request.ExpirationDate = DateTime.SpecifyKind(dto.ExpirationDate, DateTimeKind.Utc);
        request.LicenseNumber = dto.LicenseNumber;
        
        // Update file if provided
        if (!string.IsNullOrEmpty(dto.LicenseFileUrl))
        {
            // Delete old file if exists
            if (!string.IsNullOrEmpty(request.LicenseFileUrl))
            {
                try
                {
                    await _fileStorageService.DeleteFileAsync(request.LicenseFileUrl, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to delete old license file from S3: {FileUrl}", request.LicenseFileUrl);
                }
            }
            request.LicenseFileUrl = dto.LicenseFileUrl;
        }

        // Reset status to Pending
        request.Status = LicenseRequestStatus.Pending;
        request.AdminComment = null;
        request.IsVerified = false;
        request.VerifiedBy = null;
        request.VerifiedAt = null;
        request.ReviewedAt = null;
        request.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(request, request.Specialist, request.LicenseType, request.ProfessionType);
    }

    public async Task DeleteLicenseRequestAsync(
        int id,
        int specialistId,
        CancellationToken cancellationToken = default)
    {
        // Find by composite key
        var request = await _context.SpecialistLicenseTypes
            .FirstOrDefaultAsync(slt => slt.SpecialistId == specialistId && slt.LicenseTypeId == id, 
                cancellationToken);

        if (request == null)
            throw new LicenseRequestNotFoundException(id);

        if (request.Status != LicenseRequestStatus.Pending)
            throw new InvalidOperationException("Cannot delete non-pending license request");

        if (!string.IsNullOrEmpty(request.LicenseFileUrl))
        {
            try
            {
                await _fileStorageService.DeleteFileAsync(request.LicenseFileUrl, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete license file from S3: {FileUrl}", request.LicenseFileUrl);
            }
        }

        _context.SpecialistLicenseTypes.Remove(request);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private LicenseRequestDto MapToDto(SpecialistLicenseType request, Specialist specialist, LicenseType licenseType, ProfessionType professionType)
    {
        return new LicenseRequestDto
        {
            Id = request.SpecialistId,
            SpecialistId = request.SpecialistId,
            SpecialistName = $"{specialist.User.FirstName} {specialist.User.LastName}",
            SpecialistEmail = specialist.User.Email ?? string.Empty,
            LicenseTypeId = request.LicenseTypeId,
            LicenseTypeName = licenseType.Name,
            ProfessionTypeId = request.ProfessionTypeId,
            ProfessionTypeName = professionType.Name,
            State = request.State,
            IssuingAuthority = request.IssuingAuthority,
            IssueDate = request.IssueDate ?? DateTime.MinValue,
            ExpirationDate = request.ExpirationDate ?? DateTime.MinValue,
            LicenseNumber = request.LicenseNumber,
            LicenseFileUrl = !string.IsNullOrEmpty(request.LicenseFileUrl) 
                ? _fileStorageService.GetPresignedUrl(request.LicenseFileUrl) 
                : null,
            Status = request.Status,
            AdminComment = request.AdminComment,
            ReviewedBy = request.VerifiedBy,
            ReviewedAt = request.ReviewedAt,
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt
        };
    }
}
