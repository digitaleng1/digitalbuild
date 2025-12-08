using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.License;

public class LicenseRequestRejectedEmailBuilder : EmailBuilderBase
{
    public LicenseRequestRejectedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "License Request Decision - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>License Request Update</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>Unfortunately, we cannot approve your license request at this time.</p>
            <p><strong>License Type:</strong> {{LicenseTypeName}}</p>
            <p><strong>State:</strong> {{State}}</p>
            <p><strong>Reason:</strong> {{Reason}}</p>
            <a href=""{{ProfileUrl}}"" class=""button"">Update Your Profile</a>
            <p>If you have questions or would like to resubmit your request, please contact our support team.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
