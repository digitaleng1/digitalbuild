using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Application.Services;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Services;
using DigitalEngineers.Infrastructure.Services.EmailBuilders;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Auth;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Bid;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Dictionary;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.License;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Project;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Quote;
using DigitalEngineers.Infrastructure.Services.EmailBuilders.Task;
using DigitalEngineers.Infrastructure.Seeders;
using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Register HttpClientFactory for external HTTP calls (Auth0 JWKS, etc.)
        services.AddHttpClient();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequiredLength = 8;
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        // Configuration bindings
        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
        services.Configure<FirebaseSettings>(configuration.GetSection("FirebaseSettings"));
        services.Configure<DbInitSettings>(configuration.GetSection("DbInit"));

        // Email Builder Factory
        services.AddScoped<EmailBuilderFactory>();

        // Auth Email Builders
        services.AddScoped<WelcomeEmailBuilder>();
        services.AddScoped<PasswordResetEmailBuilder>();
        services.AddScoped<PasswordChangedEmailBuilder>();
        services.AddScoped<AccountActivationEmailBuilder>();
        services.AddScoped<SpecialistInvitationEmailBuilder>();
        services.AddScoped<AdminWelcomeEmailBuilder>();
        services.AddScoped<ClientWelcomeEmailBuilder>();

        // Project Email Builders
        services.AddScoped<ProjectCreatedEmailBuilder>();
        services.AddScoped<ProjectAssignedEmailBuilder>();
        services.AddScoped<ProjectStatusChangedEmailBuilder>();

        // Quote Email Builders
        services.AddScoped<QuoteSubmittedEmailBuilder>();
        services.AddScoped<QuoteAcceptedEmailBuilder>();
        services.AddScoped<QuoteRejectedEmailBuilder>();

        // Bid Email Builders
        services.AddScoped<BidRequestEmailBuilder>();
        services.AddScoped<BidResponseReceivedEmailBuilder>();
        services.AddScoped<BidAcceptedEmailBuilder>();
        services.AddScoped<BidRejectedEmailBuilder>();

        // Task Email Builders
        services.AddScoped<TaskCreatedEmailBuilder>();
        services.AddScoped<TaskAssignedEmailBuilder>();
        services.AddScoped<TaskCompletedEmailBuilder>();

        // License Email Builders
        services.AddScoped<LicenseRequestApprovedEmailBuilder>();
        services.AddScoped<LicenseRequestRejectedEmailBuilder>();

        // Dictionary Email Builders
        services.AddScoped<NewProfessionNotificationEmailBuilder>();
        services.AddScoped<NewLicenseTypeNotificationEmailBuilder>();
        services.AddScoped<ProfessionApprovalEmailBuilder>();
        services.AddScoped<ProfessionRejectionEmailBuilder>();
        services.AddScoped<LicenseTypeApprovalEmailBuilder>();
        services.AddScoped<LicenseTypeRejectionEmailBuilder>();

        // Service registrations
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ILookupService, LookupService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IFileStorageService, FileStorageService>();
        services.AddScoped<ISpecialistService, SpecialistService>();
        services.AddScoped<IClientService, ClientService>();
        services.AddScoped<IPortfolioService, PortfolioService>();
        services.AddScoped<IBidService, BidService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<ILicensesService, LicensesService>();
        services.AddScoped<IUserManagementService, UserManagementService>();
        services.AddScoped<ITaskService, TaskService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<ISpecialistInvitationService, SpecialistInvitationService>();
        services.AddScoped<IProfessionTypeService, ProfessionTypeService>();

        return services;
    }

    public static async Task SeedDatabaseAsync(this IServiceProvider serviceProvider)
    {
        await DataSeeder.SeedUsersAsync(serviceProvider);
    }
}
