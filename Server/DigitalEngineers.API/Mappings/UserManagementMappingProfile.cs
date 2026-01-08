using AutoMapper;
using DigitalEngineers.API.ViewModels.UserManagement;
using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.API.Mappings;

public class UserManagementMappingProfile : Profile
{
    public UserManagementMappingProfile()
    {
        CreateMap<UserManagementDto, UserManagementViewModel>();
        CreateMap<CreateAdminViewModel, CreateAdminDto>();
    }
}
