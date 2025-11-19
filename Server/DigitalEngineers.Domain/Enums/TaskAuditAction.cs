namespace DigitalEngineers.Domain.Enums;

/// <summary>
/// Task audit log action types
/// </summary>
public enum TaskAuditAction
{
    Created,
    Updated,
    Deleted,
    StatusChanged,
    AssigneeChanged,
    CommentAdded,
    AttachmentAdded,
    WatcherAdded,
    WatcherRemoved,
    LabelAdded,
    LabelRemoved
}
