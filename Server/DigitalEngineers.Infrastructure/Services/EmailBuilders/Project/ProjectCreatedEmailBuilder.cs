using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Project;

public class ProjectCreatedEmailBuilder : EmailBuilderBase
{
    public ProjectCreatedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Project Created Successfully - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Project Created Successfully</h2>
            <p>Hello {{ClientName}},</p>
            <p>Your project <strong>{{ProjectName}}</strong> has been created successfully.</p>
            <p><strong>Description:</strong> {{Description}}</p>
            <p><strong>Address:</strong> {{Address}}</p>
            <p>Our team will review your project and get back to you shortly with a quote.</p>
            <p>Thank you for choosing Novobid!</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
