using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Dictionary;

public class ProfessionRejectionEmailBuilder : EmailBuilderBase
{
    public ProfessionRejectionEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Your Profession Submission - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Profession Submission Update</h2>
            <p>Hello {{UserName}},</p>
            <p>Unfortunately, we cannot approve your profession submission at this time.</p>
            <ul>
                <li><strong>Profession Name:</strong> {{ProfessionName}}</li>
                <li><strong>Reason:</strong> {{RejectionReason}}</li>
            </ul>
            <p>If you have questions, please contact our support team.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
