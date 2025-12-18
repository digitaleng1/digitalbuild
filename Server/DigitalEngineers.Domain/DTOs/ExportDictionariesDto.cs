namespace DigitalEngineers.Domain.DTOs;

public class ExportDictionariesDto
{
    public List<ExportProfessionDto> Professions { get; set; } = [];
    public List<ExportProfessionTypeDto> ProfessionTypes { get; set; } = [];
    public List<ExportLicenseTypeDto> LicenseTypes { get; set; } = [];
    public List<ExportLicenseRequirementDto> LicenseRequirements { get; set; } = [];
}

public class ExportProfessionDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class ExportProfessionTypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProfessionId { get; set; }
    public string ProfessionCode { get; set; } = string.Empty;
    public bool RequiresStateLicense { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class ExportLicenseTypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsStateSpecific { get; set; }
    public bool IsActive { get; set; }
}

public class ExportLicenseRequirementDto
{
    public int Id { get; set; }
    public int ProfessionTypeId { get; set; }
    public string ProfessionTypeCode { get; set; } = string.Empty;
    public int LicenseTypeId { get; set; }
    public string LicenseTypeCode { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
    public string? Notes { get; set; }
}
