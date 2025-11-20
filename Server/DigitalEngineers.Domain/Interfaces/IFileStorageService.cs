namespace DigitalEngineers.Domain.Interfaces;

public interface IFileStorageService
{
    Task<string> UploadProjectThumbnailAsync(Stream fileStream, string fileName, string contentType, int projectId, CancellationToken cancellationToken = default);
    Task<string> UploadProjectFileAsync(Stream fileStream, string fileName, string contentType, int projectId, CancellationToken cancellationToken = default);
    Task<string> UploadTaskFileAsync(Stream fileStream, string fileName, string contentType, int projectId, int taskId, CancellationToken cancellationToken = default);
    Task<string> UploadPortfolioFileAsync(Stream fileStream, string fileName, string contentType, int specialistId, CancellationToken cancellationToken = default);
    Task<string> UploadLicenseFileAsync(Stream fileStream, string fileName, string contentType, int specialistId, CancellationToken cancellationToken = default);
    Task<string> UploadUserAvatarAsync(Stream fileStream, string fileName, string contentType, string userId, CancellationToken cancellationToken = default);
    Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<Stream> DownloadFileAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<bool> EnsureBucketExistsAsync(CancellationToken cancellationToken = default);
    string GetPresignedUrl(string fileUrl, int expirationMinutes = 0);
}
