using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Project;

public class ProjectStatusChangedEmailBuilder : EmailBuilderBase
{
    public ProjectStatusChangedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Project Status Update - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Project Status Updated</h2>
            <p>Hello {{ClientName}},</p>
            <p>The status of your project <strong>{{ProjectName}}</strong> has been updated.</p>
            <p><strong>Previous Status:</strong> {{OldStatus}}</p>
            <p><strong>New Status:</strong> {{NewStatus}}</p>
            <p>We'll keep you updated on any further developments.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
