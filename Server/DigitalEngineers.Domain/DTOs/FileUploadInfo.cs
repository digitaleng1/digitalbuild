namespace DigitalEngineers.Domain.DTOs;

public record FileUploadInfo(
    Stream FileStream,
    string FileName,
    string ContentType,
    long FileSize
);
