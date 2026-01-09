using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using DigitalEngineers.Domain.Configuration;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;

namespace DigitalEngineers.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly AwsS3Settings _settings;
    private readonly ILogger<FileStorageService> _logger;

    public FileStorageService(IOptions<AwsS3Settings> settings, ILogger<FileStorageService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
        
        var regionEndpoint = RegionEndpoint.GetBySystemName(_settings.Region);
        
        _logger.LogInformation("Initializing S3 client for region: {Region}, endpoint: {Endpoint}", 
            _settings.Region, regionEndpoint?.DisplayName ?? "Unknown");
        
        var config = new AmazonS3Config
        {
            RegionEndpoint = regionEndpoint,
            UseHttp = false,
            Timeout = TimeSpan.FromSeconds(30),
            MaxErrorRetry = 3
        };
        
        _s3Client = new AmazonS3Client(_settings.AccessKey, _settings.SecretKey, config);
    }

    public async Task<bool> EnsureBucketExistsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Checking if bucket exists: {BucketName}", _settings.BucketName);
            
            var bucketExists = await DoesBucketExistAsync(_settings.BucketName, cancellationToken);
            
            if (!bucketExists)
            {
                _logger.LogWarning("Bucket does not exist, creating: {BucketName}", _settings.BucketName);
                
                var putBucketRequest = new PutBucketRequest
                {
                    BucketName = _settings.BucketName,
                    UseClientRegion = true
                };

                await _s3Client.PutBucketAsync(putBucketRequest, cancellationToken);
                _logger.LogInformation("Bucket created successfully: {BucketName}", _settings.BucketName);
            }
            else
            {
                _logger.LogInformation("Bucket already exists: {BucketName}", _settings.BucketName);
            }

            return true;
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to ensure S3 bucket exists. Status: {Status}, Code: {Code}", 
                ex.StatusCode, ex.ErrorCode);
            throw new InvalidOperationException($"Failed to ensure S3 bucket exists: {ex.Message}", ex);
        }
    }

    private async Task<bool> DoesBucketExistAsync(string bucketName, CancellationToken cancellationToken = default)
    {
        try
        {
            var request = new ListObjectsV2Request
            {
                BucketName = bucketName,
                MaxKeys = 1
            };

            await _s3Client.ListObjectsV2Async(request, cancellationToken);
            return true;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return false;
        }
    }

    public async Task<string> UploadPortfolioFileAsync(
        Stream fileStream, 
        string fileName, 
        string contentType, 
        int specialistId, 
        CancellationToken cancellationToken = default)
    {
        var key = $"specialists/{specialistId}/portfolio/{Guid.NewGuid()}_{fileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);

        return key;
    }

    public async Task<string> UploadLicenseFileAsync(
        Stream fileStream, 
        string fileName, 
        string contentType, 
        int specialistId, 
        CancellationToken cancellationToken = default)
    {
        var key = $"specialists/{specialistId}/licenses/{Guid.NewGuid()}_{fileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);

        return key;
    }

    public async Task<string> UploadUserAvatarAsync(
        Stream fileStream, 
        string fileName, 
        string contentType, 
        string userId, 
        CancellationToken cancellationToken = default)
    {
        var key = $"users/{userId}/{fileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);

        return key;
    }

    public async Task<string> UploadTaskFileAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        int projectId,
        int taskId,
        CancellationToken cancellationToken = default)
    {
        var key = $"projects/{projectId}/tasks/{taskId}/{Guid.NewGuid()}_{fileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);

        return key;
    }

    public async Task<string> UploadProjectThumbnailAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        int projectId,
        CancellationToken cancellationToken = default)
    {
        var key = $"projects/{projectId}/thumbnail_{Guid.NewGuid()}_{fileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);

        return key;
    }

    public async Task<string> UploadProjectFileAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        int projectId,
        CancellationToken cancellationToken = default)
    {
        var key = $"projects/{projectId}/files/{Guid.NewGuid()}_{fileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);

        return key;
    }

    public async Task<string> UploadBidRequestFileAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        int bidRequestId,
        CancellationToken cancellationToken = default)
    {
        var sanitizedFileName = SanitizeFileName(fileName);
        var s3Key = $"bid-requests/{bidRequestId}/attachments/{Guid.NewGuid()}/{sanitizedFileName}";

        var request = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = s3Key,
            InputStream = fileStream,
            ContentType = contentType,
            ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
        };

        await _s3Client.PutObjectAsync(request, cancellationToken);
        return s3Key;
    }

    public async Task<string> UploadBidResponseFileAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        int bidResponseId,
        CancellationToken cancellationToken = default)
    {
        var sanitizedFileName = SanitizeFileName(fileName);
        var s3Key = $"bid-responses/{bidResponseId}/attachments/{Guid.NewGuid()}/{sanitizedFileName}";

        var request = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = s3Key,
            InputStream = fileStream,
            ContentType = contentType,
            ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
        };

        await _s3Client.PutObjectAsync(request, cancellationToken);
        return s3Key;
    }

    public async Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var key = ExtractKeyFromUrl(fileUrl);

            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(deleteRequest, cancellationToken);
            return true;
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to delete file: {FileUrl}", fileUrl);
            return false;
        }
    }

    public async Task<Stream> DownloadFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        var key = ExtractKeyFromUrl(fileUrl);

        var getRequest = new GetObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key
        };

        var response = await _s3Client.GetObjectAsync(getRequest, cancellationToken);
        
        var memoryStream = new MemoryStream();
        await response.ResponseStream.CopyToAsync(memoryStream, cancellationToken);
        memoryStream.Position = 0;
        
        return memoryStream;
    }

    public string GetPresignedUrl(string fileUrlOrKey, int expirationMinutes = 0)
    {
        try
        {
            // If null or empty, return as-is
            if (string.IsNullOrWhiteSpace(fileUrlOrKey))
            {
                return fileUrlOrKey;
            }

            // If it's already a full external URL (http/https), return as-is
            if (fileUrlOrKey.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || 
                fileUrlOrKey.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            {
                return fileUrlOrKey;
            }
            
            // Otherwise, it's a relative S3 key - generate presigned URL
            var expiration = expirationMinutes > 0 
                ? expirationMinutes 
                : _settings.PresignedUrlExpirationMinutes;

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _settings.BucketName,
                Key = fileUrlOrKey,
                Expires = DateTime.UtcNow.AddMinutes(expiration),
                Protocol = Protocol.HTTPS
            };

            var url = _s3Client.GetPreSignedURL(request);
            
            return url;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate presigned URL for: {FileUrl}", fileUrlOrKey);
            throw new InvalidOperationException($"Failed to generate presigned URL: {ex.Message}", ex);
        }
    }

    private string ExtractKeyFromUrl(string fileUrl)
    {
        var uri = new Uri(fileUrl);
        return uri.AbsolutePath.TrimStart('/');
    }

    private string SanitizeFileName(string fileName)
    {
        // Implement your sanitization logic here (e.g., remove invalid characters, etc.)
        return fileName;
    }

    public async Task<string> CopyFileAsync(
        string sourceKey,
        string destinationPrefix,
        CancellationToken cancellationToken = default)
    {
        var fileName = Path.GetFileName(sourceKey);
        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var destinationKey = $"{destinationPrefix.TrimEnd('/')}/{uniqueFileName}";

        var copyRequest = new CopyObjectRequest
        {
            SourceBucket = _settings.BucketName,
            SourceKey = sourceKey,
            DestinationBucket = _settings.BucketName,
            DestinationKey = destinationKey
        };

        await _s3Client.CopyObjectAsync(copyRequest, cancellationToken);
        
        _logger.LogInformation("File copied from {SourceKey} to {DestinationKey}", sourceKey, destinationKey);
        
        return destinationKey;
    }
}
