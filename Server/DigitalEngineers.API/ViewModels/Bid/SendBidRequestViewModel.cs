using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class SendBidRequestViewModel
{
    [Required]
    public int ProjectId { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "At least one specialist must be selected")]
    public string[] SpecialistUserIds { get; set; } = [];

    [Required]
    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string Description { get; set; } = string.Empty;
}
