using AutoMapper;
using DigitalEngineers.API.ViewModels.Project;
using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.API.Mappings;

public class ProjectMappingProfile : Profile
{
    public ProjectMappingProfile()
    {
        // ViewModel -> DTO
        CreateMap<CreateProjectViewModel, CreateProjectDto>()
            .ConstructUsing(src => new CreateProjectDto(
                src.Name,
                src.LicenseTypeIds,
                src.StreetAddress,
                src.City,
                src.State,
                src.ZipCode,
                src.ProjectScope,
                src.Description,
                src.DocumentUrls
            ));

        // DTO -> ViewModel
        CreateMap<ProjectDto, ProjectViewModel>();
        
        CreateMap<ProjectDetailsDto, ProjectDetailsViewModel>();
    }
}
