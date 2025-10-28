namespace DigitalEngineers.Domain.Interfaces;

/// <summary>
/// Service for sending email notifications
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Send bid request notification to specialist
    /// </summary>
    /// <param name="specialistEmail">Specialist email address</param>
    /// <param name="specialistName">Specialist full name</param>
    /// <param name="projectName">Project name</param>
    /// <param name="description">Bid description</param>
    /// <param name="price">Proposed price</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task SendBidRequestNotificationAsync(
        string specialistEmail,
        string specialistName,
        string projectName,
        string description,
        decimal price,
        CancellationToken cancellationToken = default);
}
