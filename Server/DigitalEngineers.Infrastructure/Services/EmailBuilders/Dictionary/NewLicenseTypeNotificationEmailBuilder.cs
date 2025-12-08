using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Dictionary;

public class NewLicenseTypeNotificationEmailBuilder : EmailBuilderBase
{
    public NewLicenseTypeNotificationEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "New License Type Submission - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>New License Type Submission</h2>
            <p>A new license type has been submitted by <strong>{{CreatedByUserName}}</strong> ({{CreatedByEmail}}):</p>
            <ul>
                <li><strong>License Type Name:</strong> {{LicenseTypeName}}</li>
                <li><strong>Profession:</strong> {{ProfessionName}}</li>
                <li><strong>Description:</strong> {{Description}}</li>
                <li><strong>Submitted At:</strong> {{SubmittedAt}}</li>
            </ul>
            <p>Please review and approve/reject this submission in the admin panel.</p>
            <a href=""{{AdminPanelUrl}}"" class=""button"">Go to Admin Panel</a>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
