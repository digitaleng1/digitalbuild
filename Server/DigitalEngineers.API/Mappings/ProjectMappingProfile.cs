using AutoMapper;
using DigitalEngineers.API.ViewModels;
using DigitalEngineers.API.ViewModels.Project;
using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.API.Mappings;

public class ProjectMappingProfile : Profile
{
    public ProjectMappingProfile()
    {
        // ViewModel -> DTO
        CreateMap<CreateProjectViewModel, CreateProjectDto>();
        CreateMap<CreateQuoteViewModel, CreateQuoteDto>();

        // DTO -> ViewModel
        CreateMap<ProjectDto, ProjectViewModel>();
        
        CreateMap<ProjectDetailsDto, ProjectDetailsViewModel>();

        CreateMap<ProjectFileDto, ProjectFileViewModel>();

        CreateMap<LicenseTypeDto, LicenseTypeViewModel>();
        
        // Map Profession (use correct namespace)
        CreateMap<ProfessionDto, ViewModels.Project.ProfessionViewModel>();

        CreateMap<ProjectSpecialistDto, ProjectSpecialistViewModel>();

        CreateMap<SpecialistLicenseInfoDto, SpecialistLicenseInfoViewModel>();
        
        CreateMap<ProjectQuoteDto, ProjectQuoteViewModel>();
        
        CreateMap<AcceptedBidSummaryDto, AcceptedBidSummaryViewModel>();
    }
}
