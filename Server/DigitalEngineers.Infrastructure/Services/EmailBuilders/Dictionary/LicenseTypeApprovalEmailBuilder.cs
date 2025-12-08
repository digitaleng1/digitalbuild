using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Dictionary;

public class LicenseTypeApprovalEmailBuilder : EmailBuilderBase
{
    public LicenseTypeApprovalEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Your License Type Has Been Approved - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>License Type Approved!</h2>
            <p>Good news, {{UserName}}!</p>
            <p>Your license type submission has been approved by our team.</p>
            <ul>
                <li><strong>License Type Name:</strong> {{LicenseTypeName}}</li>
                <li><strong>Profession:</strong> {{ProfessionName}}</li>
            </ul>
            <p>You can now use this license type when creating projects.</p>
            <a href=""{{ProjectsUrl}}"" class=""button"">Create New Project</a>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
