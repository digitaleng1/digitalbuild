namespace DigitalEngineers.Domain.DTOs;

public class CreateReviewDto
{
    public int ProjectId { get; set; }
    public int SpecialistId { get; set; }
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = string.Empty;
}
