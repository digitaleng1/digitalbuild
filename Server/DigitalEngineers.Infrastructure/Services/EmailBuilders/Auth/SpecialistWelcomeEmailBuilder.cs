using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;

public class SpecialistWelcomeEmailBuilder : EmailBuilderBase
{
    public SpecialistWelcomeEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Welcome to Novobid - Your Specialist Account is Ready!";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Welcome to Novobid!</h2>
            <p>Hello {{UserName}},</p>
            <p>Your specialist account has been successfully created by an administrator. You can now start working on projects and showcasing your expertise.</p>
            
            <p><strong>Your Login Credentials:</strong></p>
            <ul>
                <li><strong>Email:</strong> {{Email}}</li>
                <li><strong>Password:</strong> {{Password}}</li>
            </ul>
            
            <p><strong>Your Assigned Profession Types:</strong></p>
            <p>{{ProfessionTypeNames}}</p>
            
            <p>Click the button below to log in and complete your profile:</p>
            <a href=""{{LoginUrl}}"" class=""button"">Login to Your Account</a>
            
            <p style=""color: #6c757d; font-size: 14px; margin-top: 20px;"">
                <strong>Security Tip:</strong> We strongly recommend changing your password after your first login.
            </p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Complete your professional profile</li>
                <li>Add your licenses and certifications</li>
                <li>Start bidding on projects</li>
                <li>Build your portfolio</li>
            </ul>
            
            <p><strong>Note:</strong> Your assigned profession types require specific licenses. Please add and upload your license documents in your profile to get approved and start working on projects.</p>
            
            <p>If you have any questions, feel free to contact our support team.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
