namespace DigitalEngineers.Infrastructure.Configuration;

public class FirebaseSettings
{
    // Server-side (Admin SDK)
    public string ServiceAccountKeyPath { get; set; } = string.Empty;
    public string ProjectId { get; set; } = string.Empty;
    
    // Client-side (Firebase JS SDK)
    public string ApiKey { get; set; } = string.Empty;
    public string AuthDomain { get; set; } = string.Empty;
    public string StorageBucket { get; set; } = string.Empty;
    public string MessagingSenderId { get; set; } = string.Empty;
    public string AppId { get; set; } = string.Empty;
    public string MeasurementId { get; set; } = string.Empty;
}
