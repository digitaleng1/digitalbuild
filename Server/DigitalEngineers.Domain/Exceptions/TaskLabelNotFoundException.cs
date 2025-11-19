namespace DigitalEngineers.Domain.Exceptions;

public class TaskLabelNotFoundException : NotFoundException
{
    public int LabelId { get; }
    
    public TaskLabelNotFoundException(int labelId) 
        : base($"Task label with ID {labelId} not found")
    {
        LabelId = labelId;
    }
}
