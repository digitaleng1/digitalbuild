using AutoMapper;
using DigitalEngineers.API.ViewModels.Client;
using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.API.Mappings;

public class ClientMappingProfile : Profile
{
    public ClientMappingProfile()
    {
        CreateMap<ClientListDto, ClientListViewModel>();
    }
}
