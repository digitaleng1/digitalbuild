using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.Interfaces;

/// <summary>
/// Service for sending email notifications
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Send email using DTO
    /// </summary>
    Task SendEmailAsync(EmailDto emailDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Send templated email with placeholders
    /// </summary>
    Task SendTemplatedEmailAsync(
        string to,
        EmailTemplateType templateType,
        Dictionary<string, string> placeholders,
        CancellationToken cancellationToken = default);

    // Auth notifications
    Task SendWelcomeEmailAsync(
        string toEmail,
        string userName,
        string userRole,
        CancellationToken cancellationToken = default);

    Task SendAccountActivationEmailAsync(
        string toEmail,
        string userName,
        string activationUrl,
        CancellationToken cancellationToken = default);

    Task SendPasswordResetEmailAsync(
        string toEmail,
        string userName,
        string resetUrl,
        CancellationToken cancellationToken = default);

    Task SendPasswordChangedNotificationAsync(
        string toEmail,
        string userName,
        CancellationToken cancellationToken = default);

    Task SendAdminWelcomeEmailAsync(
        string toEmail,
        string userName,
        string email,
        string password,
        CancellationToken cancellationToken = default);

    Task SendClientWelcomeEmailAsync(
        string toEmail,
        string userName,
        string email,
        string password,
        CancellationToken cancellationToken = default);

    // Specialist Invitation
    Task SendSpecialistInvitationEmailAsync(
        string toEmail,
        string specialistName,
        string email,
        string password,
        string invitationUrl,
        string licenseTypeName,
        string? customMessage,
        CancellationToken cancellationToken = default);

    // Project notifications
    Task SendProjectCreatedNotificationAsync(
        string toEmail,
        string clientName,
        string projectName,
        string description,
        string address,
        CancellationToken cancellationToken = default);

    Task SendClientManagedProjectCreatedNotificationAsync(
        string toEmail,
        string clientName,
        string projectName,
        string description,
        string address,
        CancellationToken cancellationToken = default);

    Task SendProjectStatusChangedNotificationAsync(
        string toEmail,
        string clientName,
        string projectName,
        string oldStatus,
        string newStatus,
        CancellationToken cancellationToken = default);

    Task SendProjectAssignedNotificationAsync(
        string toEmail,
        string specialistName,
        string projectName,
        string role,
        string address,
        DateTime? deadline,
        string projectUrl,
        CancellationToken cancellationToken = default);

    // Quote notifications
    Task SendQuoteSubmittedNotificationAsync(
        string toEmail,
        string clientName,
        string projectName,
        decimal amount,
        string? notes,
        string quoteUrl,
        CancellationToken cancellationToken = default);

    Task SendQuoteAcceptedNotificationAsync(
        string toEmail,
        string adminName,
        string projectName,
        string clientName,
        decimal amount,
        CancellationToken cancellationToken = default);

    Task SendQuoteRejectedNotificationAsync(
        string toEmail,
        string adminName,
        string projectName,
        string clientName,
        string? reason,
        CancellationToken cancellationToken = default);

    // Bid Request & Response notifications
    Task SendBidRequestNotificationAsync(
        string specialistEmail,
        string specialistName,
        string projectName,
        string description,
        decimal price,
        CancellationToken cancellationToken = default);

    Task SendBidResponseReceivedNotificationAsync(
        string toEmail,
        string adminName,
        string projectName,
        string specialistName,
        decimal proposedPrice,
        int estimatedDays,
        string bidResponseUrl,
        CancellationToken cancellationToken = default);

    Task SendBidAcceptedNotificationAsync(
        string toEmail,
        string specialistName,
        string projectName,
        decimal finalPrice,
        string? adminComment,
        string projectUrl,
        CancellationToken cancellationToken = default);

    Task SendBidRejectedNotificationAsync(
        string toEmail,
        string specialistName,
        string projectName,
        string? reason,
        CancellationToken cancellationToken = default);

    // Task notifications
    Task SendTaskCreatedNotificationAsync(
        string toEmail,
        string userName,
        string taskTitle,
        string? description,
        string priority,
        DateTime? deadline,
        string projectName,
        string taskUrl,
        CancellationToken cancellationToken = default);

    Task SendTaskAssignedNotificationAsync(
        string toEmail,
        string userName,
        string taskTitle,
        string projectName,
        DateTime? deadline,
        string priority,
        string taskUrl,
        CancellationToken cancellationToken = default);

    Task SendTaskCompletedNotificationAsync(
        string toEmail,
        string userName,
        string taskTitle,
        string projectName,
        string completedBy,
        string taskUrl,
        CancellationToken cancellationToken = default);

    // License notifications
    Task SendLicenseRequestApprovedNotificationAsync(
        string toEmail,
        string specialistName,
        string licenseTypeName,
        string state,
        string? adminComment,
        CancellationToken cancellationToken = default);

    Task SendLicenseRequestRejectedNotificationAsync(
        string toEmail,
        string specialistName,
        string licenseTypeName,
        string state,
        string reason,
        CancellationToken cancellationToken = default);

    // Profession & License Type management notifications
    Task SendNewProfessionNotificationToAdminsAsync(string professionName, string description, string createdByUserName, string createdByEmail, CancellationToken cancellationToken = default);
    Task SendNewLicenseTypeNotificationToAdminsAsync(string licenseTypeName, string professionName, string description, string createdByUserName, string createdByEmail, CancellationToken cancellationToken = default);
    Task SendProfessionApprovalNotificationAsync(string userEmail, string userName, string professionName, CancellationToken cancellationToken = default);
    Task SendProfessionRejectionNotificationAsync(string userEmail, string userName, string professionName, string rejectionReason, CancellationToken cancellationToken = default);
    Task SendLicenseTypeApprovalNotificationAsync(string userEmail, string userName, string licenseTypeName, string professionName, CancellationToken cancellationToken = default);
    Task SendLicenseTypeRejectionNotificationAsync(string userEmail, string userName, string licenseTypeName, string professionName, string rejectionReason, CancellationToken cancellationToken = default);
}
