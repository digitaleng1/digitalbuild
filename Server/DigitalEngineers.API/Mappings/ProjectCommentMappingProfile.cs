using AutoMapper;
using DigitalEngineers.API.ViewModels.ProjectComment;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.DTOs.ProjectComment;

namespace DigitalEngineers.API.Mappings;

public class ProjectCommentMappingProfile : Profile
{
    public ProjectCommentMappingProfile()
    {
        // FileReference mappings
        CreateMap<FileReferenceDto, FileReferenceViewModel>();
        CreateMap<FileReferenceViewModel, FileReferenceDto>();
        
        // ProjectComment mappings
        CreateMap<ProjectCommentDto, ProjectCommentViewModel>()
            .ForMember(dest => dest.FileReferences, opt => opt.MapFrom(src => src.FileReferences));
        
        CreateMap<CreateProjectCommentViewModel, CreateProjectCommentDto>()
            .ForMember(dest => dest.ProjectFileIds, opt => opt.MapFrom(src => src.ProjectFileIds));
        
        CreateMap<UpdateProjectCommentViewModel, UpdateProjectCommentDto>();
        
        // MentionableUser mapping
        CreateMap<MentionableUserDto, MentionableUserViewModel>();
    }
}
