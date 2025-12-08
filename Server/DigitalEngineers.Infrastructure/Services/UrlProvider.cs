using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services;

/// <summary>
/// Provides base URL from configuration or current HTTP request
/// </summary>
public class UrlProvider : IUrlProvider
{
    private readonly WebAppConfig _webAppConfig;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UrlProvider(
        IOptions<WebAppConfig> webAppConfig,
        IHttpContextAccessor httpContextAccessor)
    {
        _webAppConfig = webAppConfig.Value;
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetBaseUrl()
    {
        // 1. Try get from configuration
        if (!string.IsNullOrWhiteSpace(_webAppConfig.BaseUrl))
        {
            return _webAppConfig.BaseUrl.TrimEnd('/');
        }

        // 2. Try get from current HTTP request
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext != null)
        {
            var request = httpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";
            return baseUrl;
        }

        // 3. Cannot determine base URL
        throw new InvalidOperationException(
            "Cannot determine base URL: App:BaseUrl is not configured and HttpContext is not available");
    }
}
