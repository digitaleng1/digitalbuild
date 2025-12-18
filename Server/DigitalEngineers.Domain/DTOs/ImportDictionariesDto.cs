namespace DigitalEngineers.Domain.DTOs;

public class ImportDictionariesDto
{
    public List<ImportProfessionDto> Professions { get; set; } = [];
    public List<ImportProfessionTypeDto> ProfessionTypes { get; set; } = [];
    public List<ImportLicenseTypeDto> LicenseTypes { get; set; } = [];
    public List<ImportLicenseRequirementDto> LicenseRequirements { get; set; } = [];
}

public class ImportProfessionDto
{
    public int? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ImportProfessionTypeDto
{
    public int? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ProfessionCode { get; set; } = string.Empty;
    public int? ProfessionId { get; set; }
    public bool RequiresStateLicense { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ImportLicenseTypeDto
{
    public int? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsStateSpecific { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ImportLicenseRequirementDto
{
    public string ProfessionTypeCode { get; set; } = string.Empty;
    public string LicenseTypeCode { get; set; } = string.Empty;
    public bool IsRequired { get; set; } = true;
    public string? Notes { get; set; }
}
