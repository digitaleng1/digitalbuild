using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;

public class WelcomeEmailBuilder : EmailBuilderBase
{
    public WelcomeEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Welcome to Digital Engineers!";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Welcome to Digital Engineers!</h2>
            <p>Hello {{UserName}},</p>
            <p>Thank you for joining Digital Engineers as a <strong>{{UserRole}}</strong>. We're excited to have you on board!</p>
            <p>Here are some things you can do to get started:</p>
            <ul>
                <li>Complete your profile</li>
                <li>Browse available projects</li>
                <li>Connect with other professionals</li>
            </ul>
            <a href=""{{DashboardUrl}}"" class=""button"">Go to Dashboard</a>
            <p>If you have any questions, our support team is here to help.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
