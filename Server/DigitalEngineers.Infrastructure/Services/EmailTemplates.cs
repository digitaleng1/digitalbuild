using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Infrastructure.Configuration;

namespace DigitalEngineers.Infrastructure.Services;

/// <summary>
/// HTML email templates with anti-spam compliance
/// </summary>
public class EmailTemplates
{
    private readonly EmailSettings _settings;

    public EmailTemplates(EmailSettings settings)
    {
        _settings = settings;
    }

    public string GetTemplate(EmailTemplateType templateType, Dictionary<string, string> placeholders)
    {
        var template = templateType switch
        {
            // Auth
            EmailTemplateType.WelcomeEmail => GetWelcomeEmailTemplate(),
            EmailTemplateType.PasswordReset => GetPasswordResetTemplate(),
            EmailTemplateType.AccountActivation => GetAccountActivationTemplate(),
            
            // Project
            EmailTemplateType.ProjectCreated => GetProjectCreatedTemplate(),
            EmailTemplateType.ProjectAssigned => GetProjectAssignedTemplate(),
            EmailTemplateType.ProjectStatusChanged => GetProjectStatusChangedTemplate(),
            
            // Quote
            EmailTemplateType.QuoteSubmitted => GetQuoteSubmittedTemplate(),
            EmailTemplateType.QuoteAccepted => GetQuoteAcceptedTemplate(),
            EmailTemplateType.QuoteRejected => GetQuoteRejectedTemplate(),
            
            // Bid
            EmailTemplateType.BidRequest => GetBidRequestTemplate(),
            EmailTemplateType.BidResponseReceived => GetBidResponseReceivedTemplate(),
            EmailTemplateType.BidAccepted => GetBidAcceptedTemplate(),
            EmailTemplateType.BidRejected => GetBidRejectedTemplate(),
            
            // Task
            EmailTemplateType.TaskCreated => GetTaskCreatedTemplate(),
            EmailTemplateType.TaskAssigned => GetTaskAssignedTemplate(),
            EmailTemplateType.TaskCompleted => GetTaskCompletedTemplate(),
            
            _ => throw new ArgumentException($"Unknown template type: {templateType}")
        };

        return ReplacePlaceholders(template, placeholders);
    }

    private string ReplacePlaceholders(string template, Dictionary<string, string> placeholders)
    {
        var result = template;
        foreach (var placeholder in placeholders)
        {
            result = result.Replace($"{{{{{placeholder.Key}}}}}", placeholder.Value);
        }
        return result;
    }

    private string GetEmailLayout(string title, string content)
    {
        return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{title}</title>
    <style>
        body {{
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f4f4f4;
        }}
        .email-container {{
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .email-header {{
            background-color: #727cf5;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }}
        .email-header h1 {{
            margin: 0;
            font-size: 24px;
        }}
        .email-body {{
            padding: 30px 20px;
            color: #333333;
            line-height: 1.6;
        }}
        .email-footer {{
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
        }}
        .button {{
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            background-color: #727cf5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
        }}
        .button:hover {{
            background-color: #5a64d6;
        }}
        a {{
            color: #727cf5;
        }}
    </style>
</head>
<body>
    <div class=""email-container"">
        <div class=""email-header"">
            <h1>Digital Engineers</h1>
        </div>
        <div class=""email-body"">
            {content}
        </div>
        <div class=""email-footer"">
            <p><strong>{_settings.FromName}</strong></p>
            <p>{_settings.CompanyAddress}</p>
            {(!string.IsNullOrEmpty(_settings.UnsubscribeUrl) ? $@"<p><a href=""{_settings.UnsubscribeUrl}"">Unsubscribe</a></p>" : "")}
            <p>&copy; {DateTime.UtcNow.Year} Digital Engineers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
    }

    // Auth Templates
    private string GetWelcomeEmailTemplate()
    {
        var content = @"
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
        return GetEmailLayout("Welcome!", content);
    }

    private string GetPasswordResetTemplate()
    {
        var content = @"
            <h2>Password Reset Request</h2>
            <p>Hello {{UserName}},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href=""{{ResetUrl}}"" class=""button"">Reset Password</a>
            <p>This link will expire in {{ExpirationHours}} hours.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
        ";
        return GetEmailLayout("Password Reset", content);
    }

    private string GetAccountActivationTemplate()
    {
        var content = @"
            <h2>Activate Your Account</h2>
            <p>Hello {{UserName}},</p>
            <p>Thank you for registering with Digital Engineers!</p>
            <p>Please click the button below to activate your account:</p>
            <a href=""{{ActivationUrl}}"" class=""button"">Activate Account</a>
            <p>This link will expire in {{ExpirationHours}} hours.</p>
        ";
        return GetEmailLayout("Account Activation", content);
    }

    // Project Templates
    private string GetProjectCreatedTemplate()
    {
        var content = @"
            <h2>Project Created Successfully</h2>
            <p>Hello {{ClientName}},</p>
            <p>Your project <strong>{{ProjectName}}</strong> has been created successfully.</p>
            <p><strong>Description:</strong> {{Description}}</p>
            <p><strong>Address:</strong> {{Address}}</p>
            <p>Our team will review your project and get back to you shortly with a quote.</p>
            <p>Thank you for choosing Digital Engineers!</p>
        ";
        return GetEmailLayout("Project Created", content);
    }

    private string GetProjectAssignedTemplate()
    {
        var content = @"
            <h2>You've Been Assigned to a Project</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>You have been assigned to work on <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Project Details:</strong></p>
            <ul>
                <li>Your Role: {{Role}}</li>
                <li>Address: {{Address}}</li>
                <li>Deadline: {{Deadline}}</li>
            </ul>
            <a href=""{{ProjectUrl}}"" class=""button"">View Project</a>
            <p>Please review the project details and get started.</p>
        ";
        return GetEmailLayout("Project Assignment", content);
    }

    private string GetProjectStatusChangedTemplate()
    {
        var content = @"
            <h2>Project Status Updated</h2>
            <p>Hello {{ClientName}},</p>
            <p>The status of your project <strong>{{ProjectName}}</strong> has been updated.</p>
            <p><strong>Previous Status:</strong> {{OldStatus}}</p>
            <p><strong>New Status:</strong> {{NewStatus}}</p>
            <p>We'll keep you updated on any further developments.</p>
        ";
        return GetEmailLayout("Project Status Update", content);
    }

    // Quote Templates
    private string GetQuoteSubmittedTemplate()
    {
        var content = @"
            <h2>Quote Ready for Review</h2>
            <p>Hello {{ClientName}},</p>
            <p>We've prepared a quote for your project <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Quoted Amount:</strong> ${{Amount}}</p>
            <p><strong>Notes:</strong></p>
            <p>{{Notes}}</p>
            <a href=""{{QuoteUrl}}"" class=""button"">Review Quote</a>
            <p>Please review the quote and let us know if you'd like to proceed.</p>
        ";
        return GetEmailLayout("Quote Submitted", content);
    }

    private string GetQuoteAcceptedTemplate()
    {
        var content = @"
            <h2>Quote Accepted</h2>
            <p>Hello {{AdminName}},</p>
            <p>Great news! <strong>{{ClientName}}</strong> has accepted the quote for project <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Accepted Amount:</strong> ${{Amount}}</p>
            <p>You can now proceed with project planning and specialist assignment.</p>
        ";
        return GetEmailLayout("Quote Accepted", content);
    }

    private string GetQuoteRejectedTemplate()
    {
        var content = @"
            <h2>Quote Rejected</h2>
            <p>Hello {{AdminName}},</p>
            <p><strong>{{ClientName}}</strong> has rejected the quote for project <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Reason:</strong> {{Reason}}</p>
            <p>You may want to reach out to the client to discuss alternatives.</p>
        ";
        return GetEmailLayout("Quote Rejected", content);
    }

    // Bid Templates
    private string GetBidRequestTemplate()
    {
        var content = @"
            <h2>Hello {{SpecialistName}},</h2>
            <p>You have received a new bid request for the following project:</p>
            <h3>{{ProjectName}}</h3>
            <p><strong>Description:</strong></p>
            <p>{{Description}}</p>
            <p>Please review this request and submit your response at your earliest convenience.</p>
            <a href=""{{ProjectUrl}}"" class=""button"">View Project Details</a>
            <p>If you have any questions, please don't hesitate to reach out.</p>
        ";
        return GetEmailLayout("New Bid Request", content);
    }

    private string GetBidResponseReceivedTemplate()
    {
        var content = @"
            <h2>New Bid Response Received</h2>
            <p>Hello {{AdminName}},</p>
            <p><strong>{{SpecialistName}}</strong> has submitted a bid response for project <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Proposed Price:</strong> ${{ProposedPrice}}</p>
            <p><strong>Estimated Duration:</strong> {{EstimatedDays}} days</p>
            <a href=""{{BidResponseUrl}}"" class=""button"">Review Bid Response</a>
            <p>Please review and take appropriate action.</p>
        ";
        return GetEmailLayout("Bid Response Received", content);
    }

    private string GetBidAcceptedTemplate()
    {
        var content = @"
            <h2>Congratulations! Your Bid Was Accepted</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>Great news! Your bid for project <strong>{{ProjectName}}</strong> has been accepted.</p>
            <p><strong>Final Price:</strong> ${{FinalPrice}}</p>
            <p><strong>Admin Comment:</strong> {{AdminComment}}</p>
            <a href=""{{ProjectUrl}}"" class=""button"">View Project</a>
            <p>You can now start working on this project. Good luck!</p>
        ";
        return GetEmailLayout("Bid Accepted", content);
    }

    private string GetBidRejectedTemplate()
    {
        var content = @"
            <h2>Bid Response Update</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>Thank you for submitting your bid for project <strong>{{ProjectName}}</strong>.</p>
            <p>Unfortunately, we've decided to move forward with a different specialist for this project.</p>
            <p><strong>Reason:</strong> {{Reason}}</p>
            <p>We appreciate your interest and hope to work with you on future projects.</p>
        ";
        return GetEmailLayout("Bid Response Decision", content);
    }

    // Task Templates
    private string GetTaskCreatedTemplate()
    {
        var content = @"
            <h2>New Task Created</h2>
            <p>Hello {{UserName}},</p>
            <p>A new task has been created and assigned to you: <strong>{{TaskTitle}}</strong></p>
            <p><strong>Project:</strong> {{ProjectName}}</p>
            <p><strong>Priority:</strong> {{Priority}}</p>
            <p><strong>Deadline:</strong> {{Deadline}}</p>
            <p><strong>Description:</strong></p>
            <p>{{Description}}</p>
            <a href=""{{TaskUrl}}"" class=""button"">View Task</a>
        ";
        return GetEmailLayout("New Task", content);
    }

    private string GetTaskAssignedTemplate()
    {
        var content = @"
            <h2>New Task Assignment</h2>
            <p>Hello {{UserName}},</p>
            <p>You have been assigned a new task: <strong>{{TaskTitle}}</strong></p>
            <p><strong>Project:</strong> {{ProjectName}}</p>
            <p><strong>Priority:</strong> {{Priority}}</p>
            <p><strong>Deadline:</strong> {{Deadline}}</p>
            <a href=""{{TaskUrl}}"" class=""button"">View Task</a>
        ";
        return GetEmailLayout("Task Assignment", content);
    }

    private string GetTaskCompletedTemplate()
    {
        var content = @"
            <h2>Task Completed</h2>
            <p>Hello {{UserName}},</p>
            <p>The task <strong>{{TaskTitle}}</strong> has been marked as completed.</p>
            <p><strong>Project:</strong> {{ProjectName}}</p>
            <p><strong>Completed By:</strong> {{CompletedBy}}</p>
            <a href=""{{TaskUrl}}"" class=""button"">View Task</a>
        ";
        return GetEmailLayout("Task Completed", content);
    }
}
