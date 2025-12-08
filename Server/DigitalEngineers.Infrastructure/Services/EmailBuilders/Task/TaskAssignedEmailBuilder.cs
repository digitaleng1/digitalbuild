using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Task;

public class TaskAssignedEmailBuilder : EmailBuilderBase
{
    public TaskAssignedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "New Task Assignment - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>New Task Assignment</h2>
            <p>Hello {{UserName}},</p>
            <p>You have been assigned a new task: <strong>{{TaskTitle}}</strong></p>
            <p><strong>Project:</strong> {{ProjectName}}</p>
            <p><strong>Priority:</strong> {{Priority}}</p>
            <p><strong>Deadline:</strong> {{Deadline}}</p>
            <a href=""{{TaskUrl}}"" class=""button"">View Task</a>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
