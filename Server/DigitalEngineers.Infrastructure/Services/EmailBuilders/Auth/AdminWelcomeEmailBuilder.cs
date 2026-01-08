using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;

public class AdminWelcomeEmailBuilder : EmailBuilderBase
{
    public AdminWelcomeEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Welcome to Novobid - Administrator Account Created";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Welcome to Novobid, Administrator!</h2>
            <p>Hello {{UserName}},</p>
            <p>Your administrator account has been created by the system Super Administrator.</p>
            
            <p><strong>Your login credentials:</strong></p>
            <ul>
                <li><strong>Email:</strong> {{Email}}</li>
                <li><strong>Password:</strong> {{Password}}</li>
            </ul>
            
            <p><strong>Important:</strong> For security reasons, we recommend changing your password after your first login.</p>
            
            <p>As an administrator, you have access to:</p>
            <ul>
                <li>User management (Providers and Clients)</li>
                <li>Project management</li>
                <li>Bid management</li>
                <li>License request approvals</li>
                <li>System dashboards and analytics</li>
            </ul>
            
            <a href=""{{LoginUrl}}"" class=""button"">Login to Admin Panel</a>
            
            <p>If you have any questions about your role or responsibilities, please contact the Super Administrator.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
