using AutoMapper;
using DigitalEngineers.API.ViewModels.Project;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;
    private readonly IMapper _mapper;

    public ProjectsController(
        IProjectService projectService,
        IMapper mapper)
    {
        _projectService = projectService;
        _mapper = mapper;
    }

    /// <summary>
    /// Create a new project with files
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Client")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ProjectViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ProjectViewModel>> CreateProject(
        [FromForm] CreateProjectViewModel model,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var clientId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(clientId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        var dto = _mapper.Map<CreateProjectDto>(model);
        
        // Convert IFormFile to FileUploadInfo
        List<FileUploadInfo>? files = null;
        if (model.Files != null && model.Files.Count > 0)
        {
            files = model.Files.Select(f => new FileUploadInfo(
                f.OpenReadStream(),
                f.FileName,
                f.ContentType,
                f.Length
            )).ToList();
        }

        FileUploadInfo? thumbnail = null;
        if (model.Thumbnail != null)
        {
            thumbnail = new FileUploadInfo(
                model.Thumbnail.OpenReadStream(),
                model.Thumbnail.FileName,
                model.Thumbnail.ContentType,
                model.Thumbnail.Length
            );
        }

        var result = await _projectService.CreateProjectAsync(
            dto, 
            clientId, 
            files, 
            thumbnail, 
            cancellationToken);
            
        var viewModel = _mapper.Map<ProjectViewModel>(result);

        return CreatedAtAction(
            nameof(GetProjectById),
            new { id = viewModel.Id },
            viewModel
        );
    }

    /// <summary>
    /// Get project by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProjectDetailsViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectDetailsViewModel>> GetProjectById(
        int id,
        CancellationToken cancellationToken)
    {
        var project = await _projectService.GetProjectByIdAsync(id, cancellationToken);
        
        var viewModel = _mapper.Map<ProjectDetailsViewModel>(project);
        return Ok(viewModel);
    }

    /// <summary>
    /// Get projects based on user role (Client -> their projects, Admin/SuperAdmin -> all projects)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProjectViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ProjectViewModel>>> GetProjects(
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();

        var projects = await _projectService.GetProjectsAsync(userId, roles, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ProjectViewModel>>(projects);
        
        return Ok(viewModels);
    }

    /// <summary>
    /// Update project status (Admin/SuperAdmin only)
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateProjectStatus(
        int id,
        [FromBody] UpdateProjectStatusViewModel model,
        CancellationToken cancellationToken)
    {
        await _projectService.UpdateProjectStatusAsync(id, model.Status, cancellationToken);
        return NoContent();
    }

    /// <summary>
    /// Get project specialists (assigned + pending bids) with role-based filtering
    /// </summary>
    [HttpGet("{id}/specialists")]
    [ProducesResponseType(typeof(IEnumerable<ProjectSpecialistViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ProjectSpecialistViewModel>>> GetProjectSpecialists(
        int id,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();

        var specialists = await _projectService.GetProjectSpecialistsAsync(id, userId, roles, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ProjectSpecialistViewModel>>(specialists);
        
        return Ok(viewModels);
    }

    /// <summary>
    /// Get project team members (assigned specialists + pending bid specialists)
    /// Alias for GetProjectSpecialists for backward compatibility
    /// </summary>
    [HttpGet("{id}/team-members")]
    [ProducesResponseType(typeof(IEnumerable<ProjectSpecialistViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ProjectSpecialistViewModel>>> GetProjectTeamMembers(
        int id,
        CancellationToken cancellationToken)
    {
        // Redirect to GetProjectSpecialists
        return await GetProjectSpecialists(id, cancellationToken);
    }
    
    /// <summary>
    /// Get project quote data (Admin/SuperAdmin only)
    /// </summary>
    [HttpGet("{id}/quote-data")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ProjectQuoteViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ProjectQuoteViewModel>> GetProjectQuoteData(
        int id,
        CancellationToken cancellationToken)
    {
        var quoteData = await _projectService.GetProjectQuoteDataAsync(id, cancellationToken);
        var viewModel = _mapper.Map<ProjectQuoteViewModel>(quoteData);
        return Ok(viewModel);
    }
    
    /// <summary>
    /// Submit quote to client (Admin/SuperAdmin only)
    /// </summary>
    [HttpPost("{id}/quote/submit")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SubmitQuote(
        int id,
        [FromBody] CreateQuoteViewModel model,
        CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<CreateQuoteDto>(model);
        dto.ProjectId = id;
        
        await _projectService.SubmitQuoteToClientAsync(dto, cancellationToken);
        return NoContent();
    }
    
    /// <summary>
    /// Accept quote (Client only)
    /// </summary>
    [HttpPost("{id}/quote/accept")]
    [Authorize(Roles = "Client")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AcceptQuote(
        int id,
        CancellationToken cancellationToken)
    {
        await _projectService.AcceptQuoteAsync(id, cancellationToken);
        return NoContent();
    }
    
    /// <summary>
    /// Reject quote (Client only)
    /// </summary>
    [HttpPost("{id}/quote/reject")]
    [Authorize(Roles = "Client")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RejectQuote(
        int id,
        [FromBody] RejectQuoteViewModel? model,
        CancellationToken cancellationToken)
    {
        await _projectService.RejectQuoteAsync(id, model?.RejectionReason, cancellationToken);
        return NoContent();
    }
}
