using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Task;

public class TaskCompletedEmailBuilder : EmailBuilderBase
{
    public TaskCompletedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Task Completed - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Task Completed</h2>
            <p>Hello {{UserName}},</p>
            <p>The task <strong>{{TaskTitle}}</strong> has been marked as completed.</p>
            <p><strong>Project:</strong> {{ProjectName}}</p>
            <p><strong>Completed By:</strong> {{CompletedBy}}</p>
            <a href=""{{TaskUrl}}"" class=""button"">View Task</a>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
