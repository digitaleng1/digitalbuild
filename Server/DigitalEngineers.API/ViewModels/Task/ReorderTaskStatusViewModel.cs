using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Task;

public class ReorderTaskStatusViewModel
{
    [Required]
    public int StatusId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Order must be greater than 0")]
    public int NewOrder { get; set; }
}

public class ReorderTaskStatusesViewModel
{
    [Required]
    public List<ReorderTaskStatusViewModel> Statuses { get; set; } = new();
}
