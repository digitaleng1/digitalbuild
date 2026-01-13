using AutoMapper;
using DigitalEngineers.API.ViewModels;
using DigitalEngineers.API.ViewModels.Specialist;
using DigitalEngineers.API.ViewModels.Review;
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
        CreateMap<InviteSpecialistViewModel, InviteSpecialistDto>();
        
        // DTO to ViewModel
        CreateMap<SpecialistDto, SpecialistViewModel>();
        CreateMap<SpecialistDetailsDto, SpecialistDetailsViewModel>();
        CreateMap<SpecialistStatsDto, SpecialistStatsViewModel>();
        CreateMap<PortfolioItemDto, PortfolioItemViewModel>();
        CreateMap<AssignedProjectDto, AssignedProjectViewModel>();
        CreateMap<LicenseTypeDto, LicenseTypeViewModel>();
        CreateMap<AvailableSpecialistDto, AvailableSpecialistViewModel>();
        CreateMap<ReviewDto, ReviewViewModel>();
        CreateMap<InviteSpecialistResultDto, InviteSpecialistResultViewModel>();
        CreateMap<ProfessionInfo, ProfessionInfoViewModel>();
        CreateMap<ProfessionTypeInfo, ProfessionTypeInfoViewModel>();
    }
}
