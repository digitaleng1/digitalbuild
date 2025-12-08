using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.License;

public class LicenseRequestApprovedEmailBuilder : EmailBuilderBase
{
    public LicenseRequestApprovedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "License Request Approved - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>License Request Approved</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>Great news! Your license request has been approved.</p>
            <p><strong>License Type:</strong> {{LicenseTypeName}}</p>
            <p><strong>State:</strong> {{State}}</p>
            {{#AdminComment}}
            <p><strong>Admin Comment:</strong> {{AdminComment}}</p>
            {{/AdminComment}}
            <a href=""{{ProfileUrl}}"" class=""button"">View Your Profile</a>
            <p>You can now start bidding on projects that require this license.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
