using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Task;

public class TaskCreatedEmailBuilder : EmailBuilderBase
{
    public TaskCreatedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "New Task Created - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>New Task Created</h2>
            <p>Hello {{UserName}},</p>
            <p>A new task has been created and assigned to you: <strong>{{TaskTitle}}</strong></p>
            <p><strong>Project:</strong> {{ProjectName}}</p>
            <p><strong>Priority:</strong> {{Priority}}</p>
            <p><strong>Deadline:</strong> {{Deadline}}</p>
            <p><strong>Description:</strong></p>
            <p>{{Description}}</p>
            <a href=""{{TaskUrl}}"" class=""button"">View Task</a>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
