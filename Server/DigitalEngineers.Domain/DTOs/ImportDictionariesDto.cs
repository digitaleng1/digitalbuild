namespace DigitalEngineers.Domain.DTOs;

public class ImportDictionariesDto
{
    public List<ImportProfessionDto> Professions { get; set; } = [];
    public List<ImportLicenseTypeDto> LicenseTypes { get; set; } = [];
}

public class ImportProfessionDto
{
    public int? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ImportLicenseTypeDto
{
    public int? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? ProfessionId { get; set; }
    public string? ProfessionName { get; set; }
    public bool IsActive { get; set; } = true;
}
