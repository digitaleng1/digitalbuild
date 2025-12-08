using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;

public class PasswordResetEmailBuilder : EmailBuilderBase
{
    public PasswordResetEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Password Reset Request - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Password Reset Request</h2>
            <p>Hello {{UserName}},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href=""{{ResetUrl}}"" class=""button"">Reset Password</a>
            <p>This link will expire in {{ExpirationHours}} hours.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
