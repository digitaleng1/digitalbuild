namespace DigitalEngineers.Domain.Exceptions;

public class TaskNotFoundException : NotFoundException
{
    public int TaskId { get; }
    
    public TaskNotFoundException(int taskId) 
        : base($"Task with ID {taskId} not found")
    {
        TaskId = taskId;
    }
}
