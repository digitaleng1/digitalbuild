using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.Domain.DTOs;

public class CreateQuoteDto
{
    [Required]
    public int ProjectId { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Quoted amount must be greater than 0")]
    public decimal QuotedAmount { get; set; }
    
    [MaxLength(1000, ErrorMessage = "Quote notes cannot exceed 1000 characters")]
    public string? QuoteNotes { get; set; }
}
