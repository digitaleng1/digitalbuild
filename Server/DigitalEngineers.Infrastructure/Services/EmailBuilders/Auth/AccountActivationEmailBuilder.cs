using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;

public class AccountActivationEmailBuilder : EmailBuilderBase
{
    public AccountActivationEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Activate Your Account - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Activate Your Account</h2>
            <p>Hello {{UserName}},</p>
            <p>Thank you for registering with Digital Engineers!</p>
            <p>Please click the button below to activate your account:</p>
            <a href=""{{ActivationUrl}}"" class=""button"">Activate Account</a>
            <p>This link will expire in {{ExpirationHours}} hours.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
