using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Quote;

public class QuoteAcceptedEmailBuilder : EmailBuilderBase
{
    public QuoteAcceptedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Quote Accepted - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Quote Accepted</h2>
            <p>Hello {{AdminName}},</p>
            <p>Great news! <strong>{{ClientName}}</strong> has accepted the quote for project <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Accepted Amount:</strong> ${{Amount}}</p>
            <p>You can now proceed with project planning and specialist assignment.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
