using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Bid;

public class BidResponseReceivedEmailBuilder : EmailBuilderBase
{
    public BidResponseReceivedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "New Bid Response Received - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>New Bid Response Received</h2>
            <p>Hello {{AdminName}},</p>
            <p><strong>{{SpecialistName}}</strong> has submitted a bid response for project <strong>{{ProjectName}}</strong>.</p>
            <p><strong>Proposed Price:</strong> ${{ProposedPrice}}</p>
            <p><strong>Estimated Duration:</strong> {{EstimatedDays}} days</p>
            <a href=""{{BidResponseUrl}}"" class=""button"">Review Bid Response</a>
            <p>Please review and take appropriate action.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
