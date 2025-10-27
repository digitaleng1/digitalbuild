using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface IProjectService
{
    Task<ProjectDto> CreateProjectAsync(
        CreateProjectDto dto,
        string clientId,
        List<FileUploadInfo>? files = null,
        FileUploadInfo? thumbnail = null,
        CancellationToken cancellationToken = default);

    Task<ProjectDetailsDto?> GetProjectByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectDto>> GetProjectsAsync(string userId, string[] userRoles, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Updates project status (Admin/SuperAdmin only)
    /// </summary>
    /// <param name="projectId">Project ID</param>
    /// <param name="status">New project status</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <exception cref="Exceptions.ProjectNotFoundException">If project not found</exception>
    /// <exception cref="Exceptions.InvalidProjectStatusException">If status is invalid</exception>
    Task UpdateProjectStatusAsync(
        int projectId, 
        string status, 
        CancellationToken cancellationToken = default);
}
