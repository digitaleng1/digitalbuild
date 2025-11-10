namespace DigitalEngineers.Domain.DTOs;

public class SpecialistStatsDto
{
    public int CompletedProjects { get; set; }
    public int TotalReviews { get; set; }
    public double AverageRating { get; set; }
    public int YearsOfExperience { get; set; }
    public decimal? HourlyRate { get; set; }
}
