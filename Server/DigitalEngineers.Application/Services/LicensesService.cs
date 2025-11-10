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
    private readonly ILogger<LicensesService> _logger;

    public LicensesService(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        ILogger<LicensesService> logger)
    {
        _context = context;
        _fileStorageService = fileStorageService;
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

        var existingLicense = await _context.SpecialistLicenseTypes
            .FirstOrDefaultAsync(slt => slt.SpecialistId == specialistId 
                && slt.LicenseTypeId == dto.LicenseTypeId, 
                cancellationToken);

        if (existingLicense != null)
        {
            if (existingLicense.Status == LicenseRequestStatus.Pending)
                throw new InvalidOperationException("A pending license request for this license type already exists");
            
            if (existingLicense.Status == LicenseRequestStatus.Approved)
                throw new InvalidOperationException("This license type is already approved for this specialist");
        }

        var licenseRequest = new SpecialistLicenseType
        {
            SpecialistId = specialistId,
            LicenseTypeId = dto.LicenseTypeId,
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

        return MapToDto(licenseRequest, specialist, licenseType);
    }

    public async Task<IEnumerable<LicenseRequestDto>> GetSpecialistLicenseRequestsAsync(
        int specialistId,
        CancellationToken cancellationToken = default)
    {
        var requests = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .Where(slt => slt.SpecialistId == specialistId)
            .OrderByDescending(slt => slt.CreatedAt)
            .ToListAsync(cancellationToken);

        return requests.Select(slt => MapToDto(slt, slt.Specialist, slt.LicenseType));
    }

    public async Task<IEnumerable<LicenseRequestDto>> GetPendingLicenseRequestsAsync(
        CancellationToken cancellationToken = default)
    {
        var requests = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .Where(slt => slt.Status == LicenseRequestStatus.Pending)
            .OrderBy(slt => slt.CreatedAt)
            .ToListAsync(cancellationToken);

        return requests.Select(slt => MapToDto(slt, slt.Specialist, slt.LicenseType));
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
            .FirstOrDefaultAsync(slt => slt.SpecialistId == id, cancellationToken);

        if (request == null)
            throw new LicenseRequestNotFoundException(id);

        return MapToDto(request, request.Specialist, request.LicenseType);
    }

    public async Task<LicenseRequestDto> ApproveLicenseRequestAsync(
        int id,
        string adminId,
        ReviewLicenseRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        // ID is actually SpecialistId (composite key)
        var request = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .FirstOrDefaultAsync(slt => slt.SpecialistId == id, cancellationToken);

        if (request == null)
            throw new LicenseRequestNotFoundException(id);

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

        return MapToDto(request, request.Specialist, request.LicenseType);
    }

    public async Task<LicenseRequestDto> RejectLicenseRequestAsync(
        int id,
        string adminId,
        ReviewLicenseRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        // ID is actually SpecialistId (composite key)
        var request = await _context.SpecialistLicenseTypes
            .Include(slt => slt.Specialist)
                .ThenInclude(s => s.User)
            .Include(slt => slt.LicenseType)
            .FirstOrDefaultAsync(slt => slt.SpecialistId == id, cancellationToken);

        if (request == null)
            throw new LicenseRequestNotFoundException(id);

        if (request.Status != LicenseRequestStatus.Pending)
            throw new InvalidOperationException($"License request is already {request.Status}");

        request.Status = LicenseRequestStatus.Rejected;
        request.AdminComment = dto.AdminComment;
        request.IsVerified = false;
        request.VerifiedBy = adminId;
        request.ReviewedAt = DateTime.UtcNow;
        request.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(request, request.Specialist, request.LicenseType);
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

    private LicenseRequestDto MapToDto(SpecialistLicenseType request, Specialist specialist, LicenseType licenseType)
    {
        return new LicenseRequestDto
        {
            Id = request.SpecialistId, // Using SpecialistId as ID for API
            SpecialistId = request.SpecialistId,
            SpecialistName = $"{specialist.User.FirstName} {specialist.User.LastName}",
            SpecialistEmail = specialist.User.Email ?? string.Empty,
            LicenseTypeId = request.LicenseTypeId,
            LicenseTypeName = licenseType.Name,
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
