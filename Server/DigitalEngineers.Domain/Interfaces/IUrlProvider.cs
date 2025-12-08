namespace DigitalEngineers.Domain.Interfaces;

/// <summary>
/// Provides base URL for generating frontend links
/// Priority: Config -> Current Request -> Exception
/// </summary>
public interface IUrlProvider
{
    /// <summary>
    /// Gets the base URL from configuration or current HTTP request
    /// </summary>
    /// <returns>Base URL (e.g., "http://localhost:5173")</returns>
    /// <exception cref="InvalidOperationException">When URL cannot be determined</exception>
    string GetBaseUrl();
}
