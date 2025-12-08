using DigitalEngineers.Infrastructure.Configuration;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders;

/// <summary>
/// Base class for email builders with common HTML layout
/// </summary>
public abstract class EmailBuilderBase : IEmailBuilder
{
    protected readonly EmailSettings _settings;

    protected EmailBuilderBase(EmailSettings settings)
    {
        _settings = settings;
    }

    public abstract string GetSubject();
    
    public string GetHtmlBody(Dictionary<string, string> placeholders)
    {
        var content = GetEmailContent(placeholders);
        return GetEmailLayout(GetSubject(), content);
    }
    
    /// <summary>
    /// Get email content (to be implemented by derived classes)
    /// </summary>
    protected abstract string GetEmailContent(Dictionary<string, string> placeholders);
    
    /// <summary>
    /// Replace placeholders in template
    /// </summary>
    protected string ReplacePlaceholders(string template, Dictionary<string, string> placeholders)
    {
        var result = template;
        
        // Handle conditional sections {{#Key}}...{{/Key}}
        foreach (var placeholder in placeholders)
        {
            var conditionalStart = "{{#" + placeholder.Key + "}}";
            var conditionalEnd = "{{/" + placeholder.Key + "}}";
            
            if (result.Contains(conditionalStart))
            {
                var startIndex = result.IndexOf(conditionalStart);
                var endIndex = result.IndexOf(conditionalEnd);
                
                if (startIndex >= 0 && endIndex > startIndex)
                {
                    var sectionLength = endIndex + conditionalEnd.Length - startIndex;
                    
                    if (string.IsNullOrWhiteSpace(placeholder.Value))
                    {
                        result = result.Remove(startIndex, sectionLength);
                    }
                    else
                    {
                        result = result.Remove(endIndex, conditionalEnd.Length);
                        result = result.Remove(startIndex, conditionalStart.Length);
                    }
                }
            }
        }
        
        // Replace all {{Key}} placeholders
        foreach (var placeholder in placeholders)
        {
            result = result.Replace("{{" + placeholder.Key + "}}", placeholder.Value);
        }
        
        return result;
    }
    
    /// <summary>
    /// Get common HTML email layout
    /// </summary>
    private string GetEmailLayout(string title, string content)
    {
        return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{title}</title>
    <style>
        body {{ margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; }}
        .email-container {{ max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .email-header {{ background-color: #727cf5; color: #ffffff; padding: 30px 20px; text-align: center; }}
        .email-header h1 {{ margin: 0; font-size: 24px; }}
        .email-body {{ padding: 30px 20px; color: #333333; line-height: 1.6; }}
        .email-footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; }}
        .button {{ display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #727cf5; color: #ffffff; text-decoration: none; border-radius: 4px; }}
        .button:hover {{ background-color: #5a64d6; }}
        a {{ color: #727cf5; }}
    </style>
</head>
<body>
    <div class=""email-container"">
        <div class=""email-header"">
            <h1>Digital Engineers</h1>
        </div>
        <div class=""email-body"">
            {content}
        </div>
        <div class=""email-footer"">
            <p><strong>{_settings.FromName}</strong></p>
            <p>{_settings.CompanyAddress}</p>
            {(!string.IsNullOrEmpty(_settings.UnsubscribeUrl) ? $@"<p><a href=""{_settings.UnsubscribeUrl}"">Unsubscribe</a></p>" : "")}
            <p>&copy; {DateTime.UtcNow.Year} Digital Engineers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
    }
}
