using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DigitalEngineers.Application.Services;

public class LookupService : ILookupService
{
    private readonly ApplicationDbContext _context;

    public LookupService(ApplicationDbContext context)
    {
        _context = context;
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
