using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Configuration;
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
    private readonly EmailTemplates _emailTemplates;
    private readonly WebAppConfig _webAppConfig;

    public EmailService(
        ILogger<EmailService> logger,
        IOptions<EmailSettings> emailSettings,
        IOptions<WebAppConfig> webAppConfig)
    {
        _logger = logger;
        _emailSettings = emailSettings.Value;
        _webAppConfig = webAppConfig.Value;
        _emailTemplates = new EmailTemplates(_emailSettings);
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
            var subject = GetSubjectForTemplate(templateType);
            var htmlBody = _emailTemplates.GetTemplate(templateType, placeholders);

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

    private string GetSubjectForTemplate(EmailTemplateType templateType)
    {
        return templateType switch
        {
            // Auth
            EmailTemplateType.WelcomeEmail => "Welcome to Digital Engineers!",
            EmailTemplateType.PasswordReset => "Password Reset Request - Digital Engineers",
            EmailTemplateType.PasswordChanged => "Your Password Has Been Changed - Digital Engineers",
            EmailTemplateType.AccountActivation => "Activate Your Account - Digital Engineers",
            EmailTemplateType.SpecialistInvitation => "You're Invited to Digital Engineers!",

            // Project
            EmailTemplateType.ProjectCreated => "Project Created Successfully - Digital Engineers",
            EmailTemplateType.ProjectAssigned => "You've Been Assigned to a Project - Digital Engineers",
            EmailTemplateType.ProjectStatusChanged => "Project Status Update - Digital Engineers",

            // Quote
            EmailTemplateType.QuoteSubmitted => "Quote Ready for Review - Digital Engineers",
            EmailTemplateType.QuoteAccepted => "Quote Accepted - Digital Engineers",
            EmailTemplateType.QuoteRejected => "Quote Rejected - Digital Engineers",

            // Bid
            EmailTemplateType.BidRequest => "New Bid Request - Digital Engineers",
            EmailTemplateType.BidResponseReceived => "New Bid Response Received - Digital Engineers",
            EmailTemplateType.BidAccepted => "Your Bid Was Accepted - Digital Engineers",
            EmailTemplateType.BidRejected => "Bid Response Update - Digital Engineers",

            // Task
            EmailTemplateType.TaskCreated => "New Task Created - Digital Engineers",
            EmailTemplateType.TaskAssigned => "New Task Assignment - Digital Engineers",
            EmailTemplateType.TaskCompleted => "Task Completed - Digital Engineers",

            _ => "Notification - Digital Engineers"
        };
    }

    private string GetBaseUrl()
    {
        return _webAppConfig.BaseUrl;
    }

    private string StripHtml(string html)
    {
        return System.Text.RegularExpressions.Regex.Replace(html, "<.*?>", string.Empty);
    }
}
