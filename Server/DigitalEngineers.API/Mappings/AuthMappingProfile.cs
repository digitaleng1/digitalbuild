using AutoMapper;
using DigitalEngineers.API.ViewModels.Auth;
using DigitalEngineers.Domain.DTOs;
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
        CreateMap<ValidateInvitationResultDto, ValidateInvitationResultViewModel>();
        CreateMap<AcceptInvitationResultDto, TokenResponseViewModel>()
            .ForMember(dest => dest.AccessToken, opt => opt.MapFrom(src => src.AccessToken))
            .ForMember(dest => dest.RefreshToken, opt => opt.MapFrom(src => src.RefreshToken))
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));
    }
}
