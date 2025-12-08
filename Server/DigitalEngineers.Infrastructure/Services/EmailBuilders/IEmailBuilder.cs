namespace DigitalEngineers.Infrastructure.Services.EmailBuilders;

/// <summary>
/// Base interface for all email builders
/// </summary>
public interface IEmailBuilder
{
    /// <summary>
    /// Get email subject
    /// </summary>
    string GetSubject();
    
    /// <summary>
    /// Get email HTML body
    /// </summary>
    /// <param name="placeholders">Placeholder values</param>
    string GetHtmlBody(Dictionary<string, string> placeholders);
}
