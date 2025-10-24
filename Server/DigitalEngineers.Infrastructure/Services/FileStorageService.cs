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

    public async Task<string> UploadFileAsync(
        Stream fileStream, 
        string fileName, 
        string contentType, 
        int projectId, 
        CancellationToken cancellationToken = default)
    {
        var key = $"projects/{projectId}/files/{Guid.NewGuid()}_{fileName}";
        
        _logger.LogInformation("Uploading file to S3: {Key}, ContentType: {ContentType}", key, contentType);

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);
        
        _logger.LogInformation("File uploaded successfully: {Key}", key);

        // Return S3 key instead of full URL
        return key;
    }

    public async Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var key = ExtractKeyFromUrl(fileUrl);
            
            _logger.LogInformation("Deleting file from S3: {Key}", key);

            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(deleteRequest, cancellationToken);
            
            _logger.LogInformation("File deleted successfully: {Key}", key);
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
        
        _logger.LogInformation("Downloading file from S3: {Key}", key);

        var getRequest = new GetObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key
        };

        var response = await _s3Client.GetObjectAsync(getRequest, cancellationToken);
        
        var memoryStream = new MemoryStream();
        await response.ResponseStream.CopyToAsync(memoryStream, cancellationToken);
        memoryStream.Position = 0;
        
        _logger.LogInformation("File downloaded successfully: {Key}, Size: {Size} bytes", key, memoryStream.Length);
        
        return memoryStream;
    }

    public string GetPresignedUrl(string fileUrlOrKey, int expirationMinutes = 0)
    {
        try
        {
            var key = fileUrlOrKey.StartsWith("http", StringComparison.OrdinalIgnoreCase) 
                ? ExtractKeyFromUrl(fileUrlOrKey) 
                : fileUrlOrKey;
            
            var expiration = expirationMinutes > 0 
                ? expirationMinutes 
                : _settings.PresignedUrlExpirationMinutes;
            
            _logger.LogInformation("Generating presigned URL for: {Key}, expiration: {Minutes} minutes", key, expiration);

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _settings.BucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(expiration),
                Protocol = Protocol.HTTPS
            };

            var url = _s3Client.GetPreSignedURL(request);
            
            _logger.LogInformation("Presigned URL generated successfully for: {Key}", key);
            
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
}
