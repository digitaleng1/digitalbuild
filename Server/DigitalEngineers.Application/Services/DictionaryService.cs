using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DigitalEngineers.Application.Services;

public class DictionaryService : IDictionaryService
{
    private readonly ApplicationDbContext _context;

    public DictionaryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<IEnumerable<ProfessionalTypeDto>> GetProfessionalTypesAsync(CancellationToken cancellationToken = default)
    {
        var professionalTypes = new List<ProfessionalTypeDto>
        {
            new() { Id = 1, Name = "Agricultural and Biological Engineering", Description = "Agricultural and Biological Engineering" },
            new() { Id = 2, Name = "Architectural Engineering", Description = "Architectural Engineering" },
            new() { Id = 3, Name = "Chemical Engineering", Description = "Chemical Engineering" },
            new() { Id = 4, Name = "Civil Engineering", Description = "Civil Engineering" },
            new() { Id = 5, Name = "Control Systems Engineering", Description = "Control Systems Engineering" },
            new() { Id = 6, Name = "Electrical and Computer Engineering", Description = "Electrical and Computer Engineering" },
            new() { Id = 7, Name = "Environmental Engineering", Description = "Environmental Engineering" },
            new() { Id = 8, Name = "Fire Protection Engineering", Description = "Fire Protection Engineering" },
            new() { Id = 9, Name = "Industrial and Systems Engineering", Description = "Industrial and Systems Engineering" },
            new() { Id = 10, Name = "Mechanical Engineering", Description = "Mechanical Engineering" },
            new() { Id = 11, Name = "Metallurgical and Materials Engineering", Description = "Metallurgical and Materials Engineering" },
            new() { Id = 12, Name = "Mining and Mineral Processing Engineering", Description = "Mining and Mineral Processing Engineering" },
            new() { Id = 13, Name = "Naval Architecture and Marine Engineering", Description = "Naval Architecture and Marine Engineering" },
            new() { Id = 14, Name = "Nuclear Engineering", Description = "Nuclear Engineering" },
            new() { Id = 15, Name = "Petroleum Engineering", Description = "Petroleum Engineering" }
        };

        return Task.FromResult<IEnumerable<ProfessionalTypeDto>>(professionalTypes);
    }

    public Task<IEnumerable<StateDto>> GetStatesAsync(CancellationToken cancellationToken = default)
    {
        var usStates = new List<StateDto>
        {
            new() { Value = "AL", Label = "Alabama" },
            new() { Value = "AK", Label = "Alaska" },
            new() { Value = "AZ", Label = "Arizona" },
            new() { Value = "AR", Label = "Arkansas" },
            new() { Value = "CA", Label = "California" },
            new() { Value = "CO", Label = "Colorado" },
            new() { Value = "CT", Label = "Connecticut" },
            new() { Value = "DE", Label = "Delaware" },
            new() { Value = "DC", Label = "District of Columbia" },
            new() { Value = "FL", Label = "Florida" },
            new() { Value = "GA", Label = "Georgia" },
            new() { Value = "HI", Label = "Hawaii" },
            new() { Value = "ID", Label = "Idaho" },
            new() { Value = "IL", Label = "Illinois" },
            new() { Value = "IN", Label = "Indiana" },
            new() { Value = "IA", Label = "Iowa" },
            new() { Value = "KS", Label = "Kansas" },
            new() { Value = "KY", Label = "Kentucky" },
            new() { Value = "LA", Label = "Louisiana" },
            new() { Value = "ME", Label = "Maine" },
            new() { Value = "MD", Label = "Maryland" },
            new() { Value = "MA", Label = "Massachusetts" },
            new() { Value = "MI", Label = "Michigan" },
            new() { Value = "MN", Label = "Minnesota" },
            new() { Value = "MS", Label = "Mississippi" },
            new() { Value = "MO", Label = "Missouri" },
            new() { Value = "MT", Label = "Montana" },
            new() { Value = "NE", Label = "Nebraska" },
            new() { Value = "NV", Label = "Nevada" },
            new() { Value = "NH", Label = "New Hampshire" },
            new() { Value = "NJ", Label = "New Jersey" },
            new() { Value = "NM", Label = "New Mexico" },
            new() { Value = "NY", Label = "New York" },
            new() { Value = "NC", Label = "North Carolina" },
            new() { Value = "ND", Label = "North Dakota" },
            new() { Value = "OH", Label = "Ohio" },
            new() { Value = "OK", Label = "Oklahoma" },
            new() { Value = "OR", Label = "Oregon" },
            new() { Value = "PA", Label = "Pennsylvania" },
            new() { Value = "RI", Label = "Rhode Island" },
            new() { Value = "SC", Label = "South Carolina" },
            new() { Value = "SD", Label = "South Dakota" },
            new() { Value = "TN", Label = "Tennessee" },
            new() { Value = "TX", Label = "Texas" },
            new() { Value = "UT", Label = "Utah" },
            new() { Value = "VT", Label = "Vermont" },
            new() { Value = "VA", Label = "Virginia" },
            new() { Value = "WA", Label = "Washington" },
            new() { Value = "WV", Label = "West Virginia" },
            new() { Value = "WI", Label = "Wisconsin" },
            new() { Value = "WY", Label = "Wyoming" }
        };

        return Task.FromResult<IEnumerable<StateDto>>(usStates);
    }

    public async Task<IEnumerable<ProfessionDto>> GetProfessionsAsync(CancellationToken cancellationToken = default)
    {
        var professions = await _context.Professions
            .AsNoTracking()
            .Select(p => new ProfessionDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description
            })
            .ToListAsync(cancellationToken);

        return professions;
    }

    public async Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesAsync(CancellationToken cancellationToken = default)
    {
        var licenseTypes = await _context.LicenseTypes
            .AsNoTracking()
            .Select(lt => new LicenseTypeDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Description = lt.Description,
                ProfessionId = lt.ProfessionId
            })
            .ToListAsync(cancellationToken);

        return licenseTypes;
    }

    public async Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesByProfessionIdAsync(int professionId, CancellationToken cancellationToken = default)
    {
        var licenseTypes = await _context.LicenseTypes
            .AsNoTracking()
            .Where(lt => lt.ProfessionId == professionId)
            .Select(lt => new LicenseTypeDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Description = lt.Description,
                ProfessionId = lt.ProfessionId
            })
            .ToListAsync(cancellationToken);

        return licenseTypes;
    }
}
