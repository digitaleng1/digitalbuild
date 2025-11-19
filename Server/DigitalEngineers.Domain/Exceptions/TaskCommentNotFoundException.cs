namespace DigitalEngineers.Domain.Exceptions;

public class TaskCommentNotFoundException : NotFoundException
{
    public int CommentId { get; }
    
    public TaskCommentNotFoundException(int commentId) 
        : base($"Task comment with ID {commentId} not found")
    {
        CommentId = commentId;
    }
}
