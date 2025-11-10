namespace DigitalEngineers.Domain.Interfaces;

public interface IFileStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, int projectId, CancellationToken cancellationToken = default);
    Task<string> UploadPortfolioFileAsync(Stream fileStream, string fileName, string contentType, int specialistId, CancellationToken cancellationToken = default);
    Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<Stream> DownloadFileAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<bool> EnsureBucketExistsAsync(CancellationToken cancellationToken = default);
    string GetPresignedUrl(string fileUrl, int expirationMinutes = 0);
}
