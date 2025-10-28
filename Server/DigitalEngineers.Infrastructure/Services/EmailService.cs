using DigitalEngineers.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Services;

/// <summary>
/// Email service implementation (stub for now)
/// </summary>
public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public async Task SendBidRequestNotificationAsync(
        string specialistEmail,
        string specialistName,
        string projectName,
        string description,
        decimal price,
        CancellationToken cancellationToken = default)
    {
        // TODO: Implement actual email sending (SMTP, SendGrid, etc.)
        
        _logger.LogWarning(
            "Email notification stub: Bid request sent to {SpecialistName} ({SpecialistEmail}) for project '{ProjectName}' with price {Price:C}",
            specialistName,
            specialistEmail,
            projectName,
            price);

        await Task.CompletedTask;
    }
}
