using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Configuration;
using DigitalEngineers.Infrastructure.Services.EmailBuilders;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace DigitalEngineers.Infrastructure.Services;

/// <summary>
/// Email service implementation using SMTP
/// </summary>
public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly EmailSettings _emailSettings;
    private readonly IUrlProvider _urlProvider;
    private readonly EmailBuilderFactory _builderFactory;

    public EmailService(
        ILogger<EmailService> logger,
        IOptions<EmailSettings> emailSettings,
        IUrlProvider urlProvider,
        EmailBuilderFactory builderFactory)
    {
        _logger = logger;
        _emailSettings = emailSettings.Value;
        _urlProvider = urlProvider;
        _builderFactory = builderFactory;
    }

    public async Task SendEmailAsync(EmailDto emailDto, CancellationToken cancellationToken = default)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
            message.To.Add(MailboxAddress.Parse(emailDto.To));
            message.Subject = emailDto.Subject;

            var builder = new BodyBuilder();
            if (emailDto.IsHtml)
            {
                builder.HtmlBody = emailDto.Body;
                builder.TextBody = StripHtml(emailDto.Body);
            }
            else
            {
                builder.TextBody = emailDto.Body;
            }

            if (emailDto.Attachments != null)
            {
                foreach (var attachment in emailDto.Attachments)
                {
                    builder.Attachments.Add(attachment.FileName, attachment.Content, ContentType.Parse(attachment.ContentType));
                }
            }

            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            
            // Use STARTTLS for port 587 (Gmail standard)
            var secureSocketOptions = _emailSettings.SmtpPort == 587 
                ? SecureSocketOptions.StartTls 
                : (_emailSettings.EnableSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.None);
            
            await client.ConnectAsync(
                _emailSettings.SmtpHost, 
                _emailSettings.SmtpPort, 
                secureSocketOptions, 
                cancellationToken);

            if (!string.IsNullOrEmpty(_emailSettings.Username) && !string.IsNullOrEmpty(_emailSettings.Password))
            {
                await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password, cancellationToken);
            }

            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To} with subject '{Subject}'", emailDto.To, emailDto.Subject);
            throw;
        }
    }

    public async Task SendTemplatedEmailAsync(
        string to,
        EmailTemplateType templateType,
        Dictionary<string, string> placeholders,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var builder = _builderFactory.GetBuilder(templateType);
            var subject = builder.GetSubject();
            var htmlBody = builder.GetHtmlBody(placeholders);

            var emailDto = new EmailDto
            {
                To = to,
                Subject = subject,
                Body = htmlBody,
                IsHtml = true
            };

            await SendEmailAsync(emailDto, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send templated email to {To} with template type {TemplateType}", to, templateType);
            throw;
        }
    }

    // Auth notifications
    public async Task SendWelcomeEmailAsync(
        string toEmail,
        string userName,
        string userRole,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "UserRole", userRole },
            { "DashboardUrl", $"{GetBaseUrl()}/dashboard" }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.WelcomeEmail,
            placeholders,
            cancellationToken);
    }

    public async Task SendAccountActivationEmailAsync(
        string toEmail,
        string userName,
        string activationUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "ActivationUrl", activationUrl },
            { "ExpirationHours", "24" }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.AccountActivation,
            placeholders,
            cancellationToken);
    }

    public async Task SendPasswordResetEmailAsync(
        string toEmail,
        string userName,
        string resetUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "ResetUrl", resetUrl },
            { "ExpirationHours", "1" }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.PasswordReset,
            placeholders,
            cancellationToken);
    }

    public async Task SendPasswordChangedNotificationAsync(
        string toEmail,
        string userName,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "ChangeDate", DateTime.UtcNow.ToString("MMMM dd, yyyy HH:mm:ss UTC") }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.PasswordChanged,
            placeholders,
            cancellationToken);
    }

    public async Task SendAdminWelcomeEmailAsync(
        string toEmail,
        string userName,
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "Email", email },
            { "Password", password },
            { "LoginUrl", $"{GetBaseUrl()}/account/login" }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.AdminWelcome,
            placeholders,
            cancellationToken);
    }

    public async Task SendSpecialistInvitationEmailAsync(
        string toEmail,
        string specialistName,
        string email,
        string password,
        string invitationUrl,
        string licenseTypeName,
        string? customMessage,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "SpecialistName", specialistName },
            { "Email", email },
            { "Password", password },
            { "InvitationUrl", invitationUrl },
            { "LicenseTypeName", licenseTypeName },
            { "CustomMessage", customMessage ?? string.Empty }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.SpecialistInvitation,
            placeholders,
            cancellationToken);
    }

    // Project notifications
    public async Task SendProjectCreatedNotificationAsync(
        string toEmail,
        string clientName,
        string projectName,
        string description,
        string address,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "ClientName", clientName },
            { "ProjectName", projectName },
            { "Description", description },
            { "Address", address }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.ProjectCreated,
            placeholders,
            cancellationToken);
    }

    public async Task SendClientManagedProjectCreatedNotificationAsync(
        string toEmail,
        string clientName,
        string projectName,
        string description,
        string address,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "ClientName", clientName },
            { "ProjectName", projectName },
            { "Description", description },
            { "Address", address },
            { "ProjectUrl", $"{GetBaseUrl()}/client/projects" }
        };

        var emailDto = new EmailDto
        {
            To = toEmail,
            Subject = $"Project '{projectName}' is Ready to Use",
            Body = $@"
                <h2>Hello {clientName},</h2>
                <p>Your self-managed project <strong>{projectName}</strong> has been successfully created and is ready to use!</p>
                <p><strong>Project Details:</strong></p>
                <ul>
                    <li><strong>Name:</strong> {projectName}</li>
                    <li><strong>Description:</strong> {description}</li>
                    <li><strong>Location:</strong> {address}</li>
                    <li><strong>Management Type:</strong> Client Managed (Self-Managed)</li>
                </ul>
                <p><strong>What you can do now:</strong></p>
                <ul>
                    <li>Invite specialists to your project</li>
                    <li>Create and manage tasks</li>
                    <li>Upload project files</li>
                    <li>Track project progress</li>
                </ul>
                <p>
                    <a href='{placeholders["ProjectUrl"]}' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                        Go to Your Projects
                    </a>
                </p>
                <p>No approval is needed - you can start working on your project right away!</p>
                <p>Best regards,<br/>The Novobid Team</p>
            ",
            IsHtml = true
        };

        await SendEmailAsync(emailDto, cancellationToken);
    }

    public async Task SendProjectStatusChangedNotificationAsync(
        string toEmail,
        string clientName,
        string projectName,
        string oldStatus,
        string newStatus,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "ClientName", clientName },
            { "ProjectName", projectName },
            { "OldStatus", oldStatus },
            { "NewStatus", newStatus }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.ProjectStatusChanged,
            placeholders,
            cancellationToken);
    }

    public async Task SendProjectAssignedNotificationAsync(
        string toEmail,
        string specialistName,
        string projectName,
        string role,
        string address,
        DateTime? deadline,
        string projectUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "SpecialistName", specialistName },
            { "ProjectName", projectName },
            { "Role", role },
            { "Address", address },
            { "Deadline", deadline?.ToString("MMMM dd, yyyy") ?? "Not specified" },
            { "ProjectUrl", projectUrl }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.ProjectAssigned,
            placeholders,
            cancellationToken);
    }

    // Quote notifications
    public async Task SendQuoteSubmittedNotificationAsync(
        string toEmail,
        string clientName,
        string projectName,
        decimal amount,
        string? notes,
        string quoteUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "ClientName", clientName },
            { "ProjectName", projectName },
            { "Amount", amount.ToString("N2") },
            { "Notes", notes ?? "No additional notes" },
            { "QuoteUrl", quoteUrl }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.QuoteSubmitted,
            placeholders,
            cancellationToken);
    }

    public async Task SendQuoteAcceptedNotificationAsync(
        string toEmail,
        string adminName,
        string projectName,
        string clientName,
        decimal amount,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "AdminName", adminName },
            { "ProjectName", projectName },
            { "ClientName", clientName },
            { "Amount", amount.ToString("N2") }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.QuoteAccepted,
            placeholders,
            cancellationToken);
    }

    public async Task SendQuoteRejectedNotificationAsync(
        string toEmail,
        string adminName,
        string projectName,
        string clientName,
        string? reason,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "AdminName", adminName },
            { "ProjectName", projectName },
            { "ClientName", clientName },
            { "Reason", reason ?? "No reason provided" }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.QuoteRejected,
            placeholders,
            cancellationToken);
    }

    // Bid Request & Response notifications
    public async Task SendBidRequestNotificationAsync(
        string specialistEmail,
        string specialistName,
        string projectName,
        string description,
        decimal price,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "SpecialistName", specialistName },
            { "ProjectName", projectName },
            { "Description", description },
            { "ProjectUrl", $"{GetBaseUrl()}/specialist/bids" }
        };

        await SendTemplatedEmailAsync(
            specialistEmail,
            EmailTemplateType.BidRequest,
            placeholders,
            cancellationToken);
    }

    public async Task SendBidResponseReceivedNotificationAsync(
        string toEmail,
        string adminName,
        string projectName,
        string specialistName,
        decimal proposedPrice,
        int estimatedDays,
        string bidResponseUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "AdminName", adminName },
            { "ProjectName", projectName },
            { "SpecialistName", specialistName },
            { "ProposedPrice", proposedPrice.ToString("N2") },
            { "EstimatedDays", estimatedDays.ToString() },
            { "BidResponseUrl", bidResponseUrl }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.BidResponseReceived,
            placeholders,
            cancellationToken);
    }

    public async Task SendBidAcceptedNotificationAsync(
        string toEmail,
        string specialistName,
        string projectName,
        decimal finalPrice,
        string? adminComment,
        string projectUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "SpecialistName", specialistName },
            { "ProjectName", projectName },
            { "FinalPrice", finalPrice.ToString("N2") },
            { "AdminComment", adminComment ?? "No additional comments" },
            { "ProjectUrl", projectUrl }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.BidAccepted,
            placeholders,
            cancellationToken);
    }

    public async Task SendBidRejectedNotificationAsync(
        string toEmail,
        string specialistName,
        string projectName,
        string? reason,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "SpecialistName", specialistName },
            { "ProjectName", projectName },
            { "Reason", reason ?? "No specific reason provided" }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.BidRejected,
            placeholders,
            cancellationToken);
    }

    // Task notifications
    public async Task SendTaskCreatedNotificationAsync(
        string toEmail,
        string userName,
        string taskTitle,
        string? description,
        string priority,
        DateTime? deadline,
        string projectName,
        string taskUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "TaskTitle", taskTitle },
            { "Description", description ?? "No description provided" },
            { "Priority", priority },
            { "Deadline", deadline?.ToString("MMMM dd, yyyy") ?? "Not specified" },
            { "ProjectName", projectName },
            { "TaskUrl", taskUrl }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.TaskCreated,
            placeholders,
            cancellationToken);
    }

    public async Task SendTaskAssignedNotificationAsync(
        string toEmail,
        string userName,
        string taskTitle,
        string projectName,
        DateTime? deadline,
        string priority,
        string taskUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "TaskTitle", taskTitle },
            { "ProjectName", projectName },
            { "Deadline", deadline?.ToString("MMMM dd, yyyy") ?? "Not specified" },
            { "Priority", priority },
            { "TaskUrl", taskUrl }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.TaskAssigned,
            placeholders,
            cancellationToken);
    }

    public async Task SendTaskCompletedNotificationAsync(
        string toEmail,
        string userName,
        string taskTitle,
        string projectName,
        string completedBy,
        string taskUrl,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "TaskTitle", taskTitle },
            { "ProjectName", projectName },
            { "CompletedBy", completedBy },
            { "TaskUrl", taskUrl }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.TaskCompleted,
            placeholders,
            cancellationToken);
    }

    public async Task SendLicenseRequestApprovedNotificationAsync(
        string toEmail,
        string specialistName,
        string licenseTypeName,
        string state,
        string? adminComment,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "SpecialistName", specialistName },
            { "LicenseTypeName", licenseTypeName },
            { "State", state },
            { "AdminComment", adminComment ?? "No additional comments" },
            { "ProfileUrl", $"{GetBaseUrl()}/specialist/profile" }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.LicenseRequestApproved,
            placeholders,
            cancellationToken);
    }

    public async Task SendLicenseRequestRejectedNotificationAsync(
        string toEmail,
        string specialistName,
        string licenseTypeName,
        string state,
        string reason,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "SpecialistName", specialistName },
            { "LicenseTypeName", licenseTypeName },
            { "State", state },
            { "Reason", reason },
            { "ProfileUrl", $"{GetBaseUrl()}/specialist/profile" }
        };

        await SendTemplatedEmailAsync(
            toEmail,
            EmailTemplateType.LicenseRequestRejected,
            placeholders,
            cancellationToken);
    }

    // Profession and License Type Management notifications
    public async Task SendNewProfessionNotificationToAdminsAsync(
        string professionName,
        string description,
        string createdByUserName,
        string createdByEmail,
        CancellationToken cancellationToken = default)
    {
        var adminEmails = await GetAdminEmailsAsync(cancellationToken);
        
        var placeholders = new Dictionary<string, string>
        {
            { "ProfessionName", professionName },
            { "Description", description },
            { "CreatedByUserName", createdByUserName },
            { "CreatedByEmail", createdByEmail },
            { "SubmittedAt", DateTime.UtcNow.ToString("MMMM dd, yyyy HH:mm UTC") },
            { "AdminPanelUrl", $"{GetBaseUrl()}/admin/dictionaries" }
        };

        var builder = new EmailBuilders.Dictionary.NewProfessionNotificationEmailBuilder(
            Microsoft.Extensions.Options.Options.Create(_emailSettings));
        var subject = builder.GetSubject();
        var htmlBody = builder.GetHtmlBody(placeholders);

        foreach (var adminEmail in adminEmails)
        {
            await SendEmailAsync(new EmailDto
            {
                To = adminEmail,
                Subject = subject,
                Body = htmlBody,
                IsHtml = true
            }, cancellationToken);
        }
    }

    public async Task SendNewLicenseTypeNotificationToAdminsAsync(
        string licenseTypeName,
        string professionName,
        string description,
        string createdByUserName,
        string createdByEmail,
        CancellationToken cancellationToken = default)
    {
        var adminEmails = await GetAdminEmailsAsync(cancellationToken);
        
        var placeholders = new Dictionary<string, string>
        {
            { "LicenseTypeName", licenseTypeName },
            { "ProfessionName", professionName },
            { "Description", description },
            { "CreatedByUserName", createdByUserName },
            { "CreatedByEmail", createdByEmail },
            { "SubmittedAt", DateTime.UtcNow.ToString("MMMM dd, yyyy HH:mm UTC") },
            { "AdminPanelUrl", $"{GetBaseUrl()}/admin/dictionaries" }
        };

        var builder = new EmailBuilders.Dictionary.NewLicenseTypeNotificationEmailBuilder(
            Microsoft.Extensions.Options.Options.Create(_emailSettings));
        var subject = builder.GetSubject();
        var htmlBody = builder.GetHtmlBody(placeholders);

        foreach (var adminEmail in adminEmails)
        {
            await SendEmailAsync(new EmailDto
            {
                To = adminEmail,
                Subject = subject,
                Body = htmlBody,
                IsHtml = true
            }, cancellationToken);
        }
    }

    public async Task SendProfessionApprovalNotificationAsync(
        string userEmail,
        string userName,
        string professionName,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "ProfessionName", professionName },
            { "ProjectsUrl", $"{GetBaseUrl()}/client/projects" }
        };

        var builder = new EmailBuilders.Dictionary.ProfessionApprovalEmailBuilder(
            Microsoft.Extensions.Options.Options.Create(_emailSettings));
        var subject = builder.GetSubject();
        var htmlBody = builder.GetHtmlBody(placeholders);

        await SendEmailAsync(new EmailDto
        {
            To = userEmail,
            Subject = subject,
            Body = htmlBody,
            IsHtml = true
        }, cancellationToken);
    }

    public async Task SendProfessionRejectionNotificationAsync(
        string userEmail,
        string userName,
        string professionName,
        string rejectionReason,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "ProfessionName", professionName },
            { "RejectionReason", rejectionReason }
        };

        var builder = new EmailBuilders.Dictionary.ProfessionRejectionEmailBuilder(
            Microsoft.Extensions.Options.Options.Create(_emailSettings));
        var subject = builder.GetSubject();
        var htmlBody = builder.GetHtmlBody(placeholders);

        await SendEmailAsync(new EmailDto
        {
            To = userEmail,
            Subject = subject,
            Body = htmlBody,
            IsHtml = true
        }, cancellationToken);
    }

    public async Task SendLicenseTypeApprovalNotificationAsync(
        string userEmail,
        string userName,
        string licenseTypeName,
        string professionName,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "LicenseTypeName", licenseTypeName },
            { "ProfessionName", professionName },
            { "ProjectsUrl", $"{GetBaseUrl()}/client/projects" }
        };

        var builder = new EmailBuilders.Dictionary.LicenseTypeApprovalEmailBuilder(
            Microsoft.Extensions.Options.Options.Create(_emailSettings));
        var subject = builder.GetSubject();
        var htmlBody = builder.GetHtmlBody(placeholders);

        await SendEmailAsync(new EmailDto
        {
            To = userEmail,
            Subject = subject,
            Body = htmlBody,
            IsHtml = true
        }, cancellationToken);
    }

    public async Task SendLicenseTypeRejectionNotificationAsync(
        string userEmail,
        string userName,
        string licenseTypeName,
        string professionName,
        string rejectionReason,
        CancellationToken cancellationToken = default)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "UserName", userName },
            { "LicenseTypeName", licenseTypeName },
            { "ProfessionName", professionName },
            { "RejectionReason", rejectionReason }
        };

        var builder = new EmailBuilders.Dictionary.LicenseTypeRejectionEmailBuilder(
            Microsoft.Extensions.Options.Options.Create(_emailSettings));
        var subject = builder.GetSubject();
        var htmlBody = builder.GetHtmlBody(placeholders);

        await SendEmailAsync(new EmailDto
        {
            To = userEmail,
            Subject = subject,
            Body = htmlBody,
            IsHtml = true
        }, cancellationToken);
    }

    private async Task<List<string>> GetAdminEmailsAsync(CancellationToken cancellationToken = default)
    {
        // TODO: Get admin emails from database
        // For now, return configured admin emails
        return new List<string> { _emailSettings.FromEmail };
    }

    private string GetBaseUrl()
    {
        return _urlProvider.GetBaseUrl();
    }

    private string StripHtml(string html)
    {
        return System.Text.RegularExpressions.Regex.Replace(html, "<.*?>", string.Empty);
    }
}
