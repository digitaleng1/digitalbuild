using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Bid;

public class BidRequestEmailBuilder : EmailBuilderBase
{
    public BidRequestEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "New Bid Request - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Hello {{SpecialistName}},</h2>
            <p>You have received a new bid request for the following project:</p>
            <h3>{{ProjectName}}</h3>
            <p><strong>Description:</strong></p>
            <p>{{Description}}</p>
            <p>Please review this request and submit your response at your earliest convenience.</p>
            <a href=""{{ProjectUrl}}"" class=""button"">View Project Details</a>
            <p>If you have any questions, please don't hesitate to reach out.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
