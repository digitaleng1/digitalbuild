using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;

public class PasswordChangedEmailBuilder : EmailBuilderBase
{
    public PasswordChangedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Your Password Has Been Changed - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Password Changed Successfully</h2>
            <p>Hello {{UserName}},</p>
            <p>Your password has been successfully changed on {{ChangeDate}}.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
            <p>For security reasons, you have been logged out from all devices.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
