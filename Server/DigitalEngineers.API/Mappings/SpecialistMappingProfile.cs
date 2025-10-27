using AutoMapper;
using DigitalEngineers.API.ViewModels;
using DigitalEngineers.API.ViewModels.Specialist;
using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.API.Mappings;

public class SpecialistMappingProfile : Profile
{
    public SpecialistMappingProfile()
    {
        // ViewModel to DTO
        CreateMap<CreateSpecialistViewModel, CreateSpecialistDto>();
        CreateMap<UpdateSpecialistViewModel, UpdateSpecialistDto>();
        CreateMap<CreatePortfolioItemViewModel, CreatePortfolioItemDto>();
        
        // DTO to ViewModel
        CreateMap<SpecialistDto, SpecialistViewModel>();
        CreateMap<SpecialistDetailsDto, SpecialistDetailsViewModel>();
        CreateMap<PortfolioItemDto, PortfolioItemViewModel>();
        CreateMap<AssignedProjectDto, AssignedProjectViewModel>();
        CreateMap<LicenseTypeDto, LicenseTypeViewModel>();
    }
}
