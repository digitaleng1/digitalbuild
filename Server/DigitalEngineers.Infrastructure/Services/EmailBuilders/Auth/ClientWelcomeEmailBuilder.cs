using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;

public class ClientWelcomeEmailBuilder : EmailBuilderBase
{
    public ClientWelcomeEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Welcome to Novobid!";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Welcome to Novobid!</h2>
            <p>Hello {{UserName}},</p>
            <p>Your client account has been successfully created. You can now start creating projects and working with specialists.</p>
            
            <p><strong>Your Login Credentials:</strong></p>
            <ul>
                <li><strong>Email:</strong> {{Email}}</li>
                <li><strong>Password:</strong> {{Password}}</li>
            </ul>
            
            <p>Click the button below to log in and get started:</p>
            <a href=""{{LoginUrl}}"" class=""button"">Login to Your Account</a>
            
            <p style=""color: #6c757d; font-size: 14px; margin-top: 20px;"">
                <strong>Security Tip:</strong> We strongly recommend changing your password after your first login.
            </p>
            
            <p><strong>What you can do:</strong></p>
            <ul>
                <li>Create and manage construction projects</li>
                <li>Invite specialists to your projects</li>
                <li>Track project progress and tasks</li>
                <li>Communicate with your team</li>
            </ul>
            
            <p>If you have any questions, feel free to contact our support team.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
