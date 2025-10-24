namespace DigitalEngineers.Domain.DTOs;

public record ProjectFileDto(
    int Id,
    string FileName,
    string FileUrl,
    long FileSize,
    string ContentType,
    DateTime UploadedAt
);
