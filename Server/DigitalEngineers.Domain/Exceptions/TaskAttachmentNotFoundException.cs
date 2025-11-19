namespace DigitalEngineers.Domain.Exceptions;

public class TaskAttachmentNotFoundException : NotFoundException
{
    public int AttachmentId { get; }
    
    public TaskAttachmentNotFoundException(int attachmentId) 
        : base($"Task attachment with ID {attachmentId} not found")
    {
        AttachmentId = attachmentId;
    }
}
