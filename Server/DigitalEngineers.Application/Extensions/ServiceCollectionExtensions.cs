using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Application.Services;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Services;
using DigitalEngineers.Infrastructure.Seeders;
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

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ILookupService, LookupService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IFileStorageService, FileStorageService>();
        services.AddScoped<ISpecialistService, SpecialistService>();
        services.AddScoped<IPortfolioService, PortfolioService>();
        services.AddScoped<IBidService, BidService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<ILicensesService, LicensesService>();
        services.AddScoped<IUserManagementService, UserManagementService>();
        services.AddScoped<ITaskService, TaskService>();

        return services;
    }

    public static async Task SeedDatabaseAsync(this IServiceProvider serviceProvider)
    {
        await DataSeeder.SeedUsersAsync(serviceProvider);
    }
}
