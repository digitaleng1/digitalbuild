namespace DigitalEngineers.Domain.Configuration;

public class AwsS3Settings
{
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string BucketName { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public int PresignedUrlExpirationMinutes { get; set; } = 10080; // 7 days default
}
