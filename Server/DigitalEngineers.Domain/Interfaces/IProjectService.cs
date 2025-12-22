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
    Task<IEnumerable<ProjectDto>> GetProjectsAsync(
        string userId, 
        string[] userRoles, 
        string[]? statuses = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        string? search = null,
        CancellationToken cancellationToken = default);
    
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

    /// <summary>
    /// Updates project management type (Admin/SuperAdmin only)
    /// </summary>
    /// <param name="projectId">Project ID</param>
    /// <param name="managementType">New management type</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <exception cref="Exceptions.ProjectNotFoundException">If project not found</exception>
    Task UpdateProjectManagementTypeAsync(
        int projectId,
        string managementType,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets project specialists (assigned + pending bids) with role-based filtering
    /// </summary>
    /// <param name="projectId">Project ID</param>
    /// <param name="userId">User ID</param>
    /// <param name="userRoles">User roles</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of specialists (assigned + pending bids for Admin, only assigned for Client)</returns>
    /// <exception cref="Exceptions.ProjectNotFoundException">If project not found</exception>
    Task<IEnumerable<ProjectSpecialistDto>> GetProjectSpecialistsAsync(
        int projectId,
        string userId,
        string[] userRoles,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Gets project quote data with accepted bids and suggested amount
    /// </summary>
    /// <param name="projectId">Project ID</param>
    /// <param name="userId">User ID (for authorization)</param>
    /// <param name="userRoles">User roles</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Project quote data</returns>
    /// <exception cref="Exceptions.ProjectNotFoundException">If project not found</exception>
    /// <exception cref="UnauthorizedAccessException">If user is not authorized to access quote data</exception>
    Task<ProjectQuoteDto> GetProjectQuoteDataAsync(int projectId, string? userId, string[] userRoles, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Submits quote to client
    /// </summary>
    /// <param name="dto">Quote data</param>
    /// <param name="userId">User ID (for authorization)</param>
    /// <param name="userRoles">User roles</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <exception cref="Exceptions.ProjectNotFoundException">If project not found</exception>
    /// <exception cref="Exceptions.InvalidProjectStatusForQuoteException">If project status is not valid</exception>
    /// <exception cref="UnauthorizedAccessException">If user is not authorized to submit quote</exception>
    Task SubmitQuoteToClientAsync(CreateQuoteDto dto, string? userId, string[] userRoles, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Updates existing quote (Admin can edit submitted quote)
    /// </summary>
    /// <param name="dto">Updated quote data</param>
    /// <param name="userId">User ID (for authorization)</param>
    /// <param name="userRoles">User roles</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <exception cref="Exceptions.ProjectNotFoundException">If project not found</exception>
    /// <exception cref="Exceptions.InvalidProjectStatusForQuoteException">If project status is not QuoteSubmitted</exception>
    /// <exception cref="UnauthorizedAccessException">If user is not authorized to update quote</exception>
    Task UpdateQuoteAsync(CreateQuoteDto dto, string? userId, string[] userRoles, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Client accepts quote
    /// </summary>
    /// <param name="projectId">Project ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <exception cref="Exceptions.ProjectNotFoundException">If project not found</exception>
    /// <exception cref="Exceptions.InvalidProjectStatusForQuoteException">If project status is not QuoteSubmitted</exception>
    Task AcceptQuoteAsync(int projectId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Client rejects quote
    /// </summary>
    /// <param name="projectId">Project ID</param>
    /// <param name="rejectionReason">Optional rejection reason</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <exception cref="Exceptions.ProjectNotFoundException">If project not found</exception>
    /// <exception cref="Exceptions.InvalidProjectStatusForQuoteException">If project status is not QuoteSubmitted</exception>
    Task RejectQuoteAsync(int projectId, string? rejectionReason, CancellationToken cancellationToken = default);
}
