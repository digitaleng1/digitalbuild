using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Dictionary;

public class LicenseTypeRejectionEmailBuilder : EmailBuilderBase
{
    public LicenseTypeRejectionEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Your License Type Submission - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>License Type Submission Update</h2>
            <p>Hello {{UserName}},</p>
            <p>Unfortunately, we cannot approve your license type submission at this time.</p>
            <ul>
                <li><strong>License Type Name:</strong> {{LicenseTypeName}}</li>
                <li><strong>Profession:</strong> {{ProfessionName}}</li>
                <li><strong>Reason:</strong> {{RejectionReason}}</li>
            </ul>
            <p>If you have questions, please contact our support team.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
