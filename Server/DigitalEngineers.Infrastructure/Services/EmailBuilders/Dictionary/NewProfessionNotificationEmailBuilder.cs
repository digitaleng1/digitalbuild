using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Dictionary;

public class NewProfessionNotificationEmailBuilder : EmailBuilderBase
{
    public NewProfessionNotificationEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "New Profession Submission - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>New Profession Submission</h2>
            <p>A new profession has been submitted by <strong>{{CreatedByUserName}}</strong> ({{CreatedByEmail}}):</p>
            <ul>
                <li><strong>Profession Name:</strong> {{ProfessionName}}</li>
                <li><strong>Description:</strong> {{Description}}</li>
                <li><strong>Submitted At:</strong> {{SubmittedAt}}</li>
            </ul>
            <p>Please review and approve/reject this submission in the admin panel.</p>
            <a href=""{{AdminPanelUrl}}"" class=""button"">Go to Admin Panel</a>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
