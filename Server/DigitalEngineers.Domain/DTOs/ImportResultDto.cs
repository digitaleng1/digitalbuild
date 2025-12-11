namespace DigitalEngineers.Domain.DTOs;

public class ImportResultDto
{
    public int ProfessionsCreated { get; set; }
    public int ProfessionsUpdated { get; set; }
    public int LicenseTypesCreated { get; set; }
    public int LicenseTypesUpdated { get; set; }
    public List<string> Warnings { get; set; } = [];
    public List<string> Errors { get; set; } = [];
    public bool Success => Errors.Count == 0;
}
