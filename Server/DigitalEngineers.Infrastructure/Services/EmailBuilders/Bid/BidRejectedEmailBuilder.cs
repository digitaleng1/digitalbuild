using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Bid;

public class BidRejectedEmailBuilder : EmailBuilderBase
{
    public BidRejectedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Bid Response Update - Novobid";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Bid Response Update</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>Thank you for submitting your bid for project <strong>{{ProjectName}}</strong>.</p>
            <p>Unfortunately, we've decided to move forward with a different specialist for this project.</p>
            <p><strong>Reason:</strong> {{Reason}}</p>
            <p>We appreciate your interest and hope to work with you on future projects.</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
