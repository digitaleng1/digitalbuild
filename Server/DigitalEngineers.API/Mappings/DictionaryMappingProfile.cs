using AutoMapper;
using DigitalEngineers.API.ViewModels;
using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.API.Mappings;

public class DictionaryMappingProfile : Profile
{
    public DictionaryMappingProfile()
    {
        // DTO to ViewModel
        CreateMap<StateDto, StateViewModel>();
        CreateMap<ProfessionDto, ProfessionViewModel>();
        CreateMap<LicenseTypeDto, LicenseTypeViewModel>();
    }
}
