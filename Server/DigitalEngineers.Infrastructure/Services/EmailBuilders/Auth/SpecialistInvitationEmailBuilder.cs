using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;

public class SpecialistInvitationEmailBuilder : EmailBuilderBase
{
    public SpecialistInvitationEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "You're Invited to Novobid!";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>You've Been Invited to Novobid!</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>You have been invited to join Novobid as a specialist with <strong>{{LicenseTypeName}}</strong> license.</p>
            {{#CustomMessage}}
            <div style=""background-color: #f8f9fa; padding: 15px; border-left: 4px solid #727cf5; margin: 20px 0;"">
                <p style=""margin: 0;"">{{CustomMessage}}</p>
            </div>
            {{/CustomMessage}}
            <p><strong>Your Login Credentials:</strong></p>
            <ul>
                <li><strong>Email:</strong> {{Email}}</li>
                <li><strong>Password:</strong> {{Password}}</li>
            </ul>
            <p>Click the button below to automatically log in and get started:</p>
            <a href=""{{InvitationUrl}}"" class=""button"">Accept Invitation & Login</a>
            <p style=""color: #6c757d; font-size: 14px;"">This invitation link will expire in 7 days.</p>
            <p>We recommend changing your password after your first login for security reasons.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
