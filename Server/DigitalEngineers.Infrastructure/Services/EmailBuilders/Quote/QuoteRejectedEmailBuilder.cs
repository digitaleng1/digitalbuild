using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Quote;

public class QuoteRejectedEmailBuilder : EmailBuilderBase
{
    public QuoteRejectedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Quote Rejected - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Quote Rejected</h2>
            <p>Hello {{AdminName}},</p>
            <p><strong>{{ClientName}}</strong> has rejected the quote for project <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Reason:</strong> {{Reason}}</p>
            <p>You may want to reach out to the client to discuss alternatives.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
