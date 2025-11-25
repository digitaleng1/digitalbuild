namespace DigitalEngineers.Domain.Exceptions;

public class TaskStatusNotFoundException : NotFoundException
{
    public int StatusId { get; }
    
    public TaskStatusNotFoundException(int statusId) 
        : base($"Task status with ID {statusId} not found")
    {
        StatusId = statusId;
    }
}
