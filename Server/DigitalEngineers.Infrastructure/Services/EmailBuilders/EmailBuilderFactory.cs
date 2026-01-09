using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Bid;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Dictionary;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.License;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Project;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Quote;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Task;
using Microsoft.Extensions.DependencyInjection;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders;

/// <summary>
/// Factory to get email builders by template type
/// </summary>
public class EmailBuilderFactory
{
    private readonly IServiceProvider _serviceProvider;

    public EmailBuilderFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IEmailBuilder GetBuilder(EmailTemplateType templateType)
    {
        return templateType switch
        {
            // Auth
            EmailTemplateType.WelcomeEmail => _serviceProvider.GetRequiredService<WelcomeEmailBuilder>(),
            EmailTemplateType.PasswordReset => _serviceProvider.GetRequiredService<PasswordResetEmailBuilder>(),
            EmailTemplateType.PasswordChanged => _serviceProvider.GetRequiredService<PasswordChangedEmailBuilder>(),
            EmailTemplateType.AccountActivation => _serviceProvider.GetRequiredService<AccountActivationEmailBuilder>(),
            EmailTemplateType.SpecialistInvitation => _serviceProvider.GetRequiredService<SpecialistInvitationEmailBuilder>(),
            EmailTemplateType.AdminWelcome => _serviceProvider.GetRequiredService<AdminWelcomeEmailBuilder>(),
            EmailTemplateType.ClientWelcome => _serviceProvider.GetRequiredService<ClientWelcomeEmailBuilder>(),
            
            // Project
            EmailTemplateType.ProjectCreated => _serviceProvider.GetRequiredService<ProjectCreatedEmailBuilder>(),
            EmailTemplateType.ProjectAssigned => _serviceProvider.GetRequiredService<ProjectAssignedEmailBuilder>(),
            EmailTemplateType.ProjectStatusChanged => _serviceProvider.GetRequiredService<ProjectStatusChangedEmailBuilder>(),
            
            // Quote
            EmailTemplateType.QuoteSubmitted => _serviceProvider.GetRequiredService<QuoteSubmittedEmailBuilder>(),
            EmailTemplateType.QuoteAccepted => _serviceProvider.GetRequiredService<QuoteAcceptedEmailBuilder>(),
            EmailTemplateType.QuoteRejected => _serviceProvider.GetRequiredService<QuoteRejectedEmailBuilder>(),
            
            // Bid
            EmailTemplateType.BidRequest => _serviceProvider.GetRequiredService<BidRequestEmailBuilder>(),
            EmailTemplateType.BidResponseReceived => _serviceProvider.GetRequiredService<BidResponseReceivedEmailBuilder>(),
            EmailTemplateType.BidAccepted => _serviceProvider.GetRequiredService<BidAcceptedEmailBuilder>(),
            EmailTemplateType.BidRejected => _serviceProvider.GetRequiredService<BidRejectedEmailBuilder>(),
            
            // Task
            EmailTemplateType.TaskCreated => _serviceProvider.GetRequiredService<TaskCreatedEmailBuilder>(),
            EmailTemplateType.TaskAssigned => _serviceProvider.GetRequiredService<TaskAssignedEmailBuilder>(),
            EmailTemplateType.TaskCompleted => _serviceProvider.GetRequiredService<TaskCompletedEmailBuilder>(),
            
            // License
            EmailTemplateType.LicenseRequestApproved => _serviceProvider.GetRequiredService<LicenseRequestApprovedEmailBuilder>(),
            EmailTemplateType.LicenseRequestRejected => _serviceProvider.GetRequiredService<LicenseRequestRejectedEmailBuilder>(),
            
            _ => throw new ArgumentException($"Unknown template type: {templateType}")
        };
    }
}
