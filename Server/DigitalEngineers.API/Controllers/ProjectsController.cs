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
    /// Create a new project
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Client")]
    [ProducesResponseType(typeof(ProjectViewModel), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ProjectViewModel>> CreateProject(
        [FromBody] CreateProjectViewModel model,
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
            var result = await _projectService.CreateProjectAsync(dto, clientId, cancellationToken);
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
    /// Get all projects for the current client
    /// </summary>
    [HttpGet("my-projects")]
    [Authorize(Roles = "Client")]
    [ProducesResponseType(typeof(IEnumerable<ProjectViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ProjectViewModel>>> GetMyProjects(
        CancellationToken cancellationToken)
    {
        var clientId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(clientId))
        {
            return Unauthorized(new { message = "User ID not found in token" });
        }

        var projects = await _projectService.GetProjectsByClientIdAsync(clientId, cancellationToken);
        var viewModels = _mapper.Map<IEnumerable<ProjectViewModel>>(projects);
        
        return Ok(viewModels);
    }
}
