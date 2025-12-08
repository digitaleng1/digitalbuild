using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Services.EmailBuilders.Bid;

public class BidAcceptedEmailBuilder : EmailBuilderBase
{
    public BidAcceptedEmailBuilder(IOptions<EmailSettings> settings) 
        : base(settings.Value) { }

    public override string GetSubject() => "Your Bid Was Accepted - Digital Engineers";

    protected override string GetEmailContent(Dictionary<string, string> placeholders)
    {
        var template = @"
            <h2>Congratulations! Your Bid Was Accepted</h2>
            <p>Hello {{SpecialistName}},</p>
            <p>Great news! Your bid for project <strong>{{ProjectName}}</strong> has been accepted.</p>
            <p><strong>Final Price:</strong> ${{FinalPrice}}</p>
            <p><strong>Admin Comment:</strong> {{AdminComment}}</p>
            <a href=""{{ProjectUrl}}"" class=""button"">View Project</a>
            <p>You can now start working on this project. Good luck!</p>
        ";
        
        return ReplacePlaceholders(template, placeholders);
    }
}
