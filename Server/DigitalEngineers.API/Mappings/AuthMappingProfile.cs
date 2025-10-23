using AutoMapper;
using DigitalEngineers.API.ViewModels.Auth;
using DigitalEngineers.Domain.DTOs.Auth;

namespace DigitalEngineers.API.Mappings;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        // ViewModel to DTO (Request) - only for RegisterDto (6 fields)
        CreateMap<RegisterViewModel, RegisterDto>();

        // DTO to ViewModel (Response)
        CreateMap<UserDto, UserViewModel>();
        CreateMap<TokenData, TokenResponseViewModel>();
    }
}
