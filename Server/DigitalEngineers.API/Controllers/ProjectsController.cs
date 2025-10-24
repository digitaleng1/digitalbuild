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
    private readonly ILogger<ProjectsController> _logger;

    public ProjectsController(
        IProjectService projectService,
        IMapper mapper,
        ILogger<ProjectsController> logger)
    {
        _projectService = projectService;
        _mapper = mapper;
        _logger = logger;
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
            return Unauthorized(new { message = "User ID not found in token" });
        }

        try
        {
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
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid project data submitted");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating project");
            return StatusCode(500, new { message = "An error occurred while creating the project" });
        }
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
        
        if (project == null)
        {
            return NotFound(new { message = "Project not found" });
        }

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
            return Unauthorized(new { message = "User ID not found in token" });
        }

        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();

        var projects = await _projectService.GetProjectsAsync(userId, roles, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ProjectViewModel>>(projects);
        
        return Ok(viewModels);
    }
}
