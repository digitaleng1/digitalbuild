using AutoMapper;
using DigitalEngineers.API.ViewModels.Task;
using DigitalEngineers.API.ViewModels.TaskComment;
using DigitalEngineers.API.ViewModels.TaskLabel;
using DigitalEngineers.API.ViewModels.TaskAuditLog;
using DigitalEngineers.API.ViewModels.TaskAttachment;
using DigitalEngineers.API.ViewModels.TaskWatcher;
using DigitalEngineers.Domain.DTOs.Task;
using DigitalEngineers.Domain.DTOs.TaskComment;
using DigitalEngineers.Domain.DTOs.TaskLabel;
using DigitalEngineers.Domain.DTOs.TaskAuditLog;
using DigitalEngineers.Domain.DTOs.TaskAttachment;
using DigitalEngineers.Domain.DTOs.TaskWatcher;

namespace DigitalEngineers.API.Mappings;

public class TaskMappingProfile : Profile
{
    public TaskMappingProfile()
    {
        // ViewModel -> DTO (Request)
        CreateMap<CreateTaskViewModel, CreateTaskDto>()
            .ForMember(dest => dest.LabelIds, opt => opt.Ignore()); // Handled in controller
        CreateMap<UpdateTaskViewModel, UpdateTaskDto>();
        CreateMap<CreateTaskCommentViewModel, CreateTaskCommentDto>();
        CreateMap<UpdateTaskCommentViewModel, UpdateTaskCommentDto>();
        CreateMap<CreateTaskLabelViewModel, CreateTaskLabelDto>();

        // DTO -> ViewModel (Response)
        CreateMap<TaskDto, TaskViewModel>();
        
        CreateMap<TaskDetailDto, TaskDetailViewModel>()
            .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => src.Comments.Length))
            .ForMember(dest => dest.FilesCount, opt => opt.MapFrom(src => src.Attachments.Length))
            .ForMember(dest => dest.WatchersCount, opt => opt.MapFrom(src => src.Watchers.Length));
        
        CreateMap<TaskCommentDto, TaskCommentViewModel>();
        CreateMap<TaskLabelDto, TaskLabelViewModel>();
        CreateMap<TaskAuditLogDto, TaskAuditLogViewModel>();
        CreateMap<TaskAttachmentDto, TaskAttachmentViewModel>();
        CreateMap<TaskWatcherDto, TaskWatcherViewModel>();
        CreateMap<TaskStatusDto, TaskStatusViewModel>();
    }
}
