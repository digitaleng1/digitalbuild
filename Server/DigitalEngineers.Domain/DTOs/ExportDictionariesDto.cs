namespace DigitalEngineers.Domain.DTOs;

public class ExportDictionariesDto
{
    public List<ExportProfessionDto> Professions { get; set; } = [];
    public List<ExportLicenseTypeDto> LicenseTypes { get; set; } = [];
}

public class ExportProfessionDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}

public class ExportLicenseTypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProfessionId { get; set; }
    public string ProfessionName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
