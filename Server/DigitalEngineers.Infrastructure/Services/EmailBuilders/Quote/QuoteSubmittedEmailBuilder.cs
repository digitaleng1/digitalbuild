using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Quote;

public class QuoteSubmittedEmailBuilder : EmailBuilderBase
{
    public QuoteSubmittedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Quote Ready for Review - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Quote Ready for Review</h2>
            <p>Hello {{ClientName}},</p>
            <p>We've prepared a quote for your project <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Quoted Amount:</strong> ${{Amount}}</p>
            <p><strong>Notes:</strong></p>
            <p>{{Notes}}</p>
            <a href=""{{QuoteUrl}}"" class=""button"">Review Quote</a>
            <p>Please review the quote and let us know if you'd like to proceed.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
