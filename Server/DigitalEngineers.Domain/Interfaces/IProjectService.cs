using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface IProjectService
{
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto, string clientId, CancellationToken cancellationToken = default);
    Task<ProjectDetailsDto?> GetProjectByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectDto>> GetProjectsByClientIdAsync(string clientId, CancellationToken cancellationToken = default);
}
