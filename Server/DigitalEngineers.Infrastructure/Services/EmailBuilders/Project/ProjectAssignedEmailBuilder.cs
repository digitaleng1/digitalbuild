using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Project;

public class ProjectAssignedEmailBuilder : EmailBuilderBase
{
    public ProjectAssignedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "You've Been Assigned to a Project - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>You've Been Assigned to a Project</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>You have been assigned to work on <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Project Details:</strong></p>
            <ul>
                <li>Your Role: {{Role}}</li>
                <li>Address: {{Address}}</li>
                <li>Deadline: {{Deadline}}</li>
            </ul>
            <a href=""{{ProjectUrl}}"" class=""button"">View Project</a>
            <p>Please review the project details and get started.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
