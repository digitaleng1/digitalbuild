using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Dictionary;

public class ProfessionApprovalEmailBuilder : EmailBuilderBase
{
    public ProfessionApprovalEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Your Profession Has Been Approved - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Profession Approved!</h2>
            <p>Good news, {{UserName}}!</p>
            <p>Your profession submission has been approved by our team.</p>
            <ul>
                <li><strong>Profession Name:</strong> {{ProfessionName}}</li>
            </ul>
            <p>You can now use this profession when creating projects.</p>
            <a href=""{{ProjectsUrl}}"" class=""button"">Create New Project</a>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
