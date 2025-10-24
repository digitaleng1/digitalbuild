using AutoMapper;
using DigitalEngineers.API.ViewModels.Project;
using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.API.Mappings;

public class ProjectMappingProfile : Profile
{
    public ProjectMappingProfile()
    {
        // ViewModel -> DTO
        CreateMap<CreateProjectViewModel, CreateProjectDto>();

        // DTO -> ViewModel
        CreateMap<ProjectDto, ProjectViewModel>();
        
        CreateMap<ProjectDetailsDto, ProjectDetailsViewModel>();
    }
}
