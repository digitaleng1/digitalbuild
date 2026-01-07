using AutoMapper;
using DigitalEngineers.API.ViewModels.Bid;
using DigitalEngineers.API.ViewModels.Specialist;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Infrastructure.Entities;

namespace DigitalEngineers.API.Mappings;

public class BidMappingProfile : Profile
{
    public BidMappingProfile()
    {
        CreateMap<CreateBidRequestViewModel, CreateBidRequestDto>();
        CreateMap<UpdateBidRequestViewModel, UpdateBidRequestDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => 
                string.IsNullOrEmpty(src.Status) ? (BidRequestStatus?)null : Enum.Parse<BidRequestStatus>(src.Status)));
        
        CreateMap<BidRequestDto, BidRequestViewModel>();
        CreateMap<BidRequestDetailsDto, BidRequestDetailsViewModel>();

        CreateMap<CreateBidResponseViewModel, CreateBidResponseDto>()
            .ForMember(dest => dest.SpecialistId, opt => opt.Ignore());
        CreateMap<UpdateBidResponseViewModel, UpdateBidResponseDto>();
        CreateMap<BidResponseDto, BidResponseViewModel>()
            .ForMember(dest => dest.FinalPrice, opt => opt.MapFrom(src => 
                src.AdminMarkupPercentage.HasValue 
                    ? src.ProposedPrice * (1 + src.AdminMarkupPercentage.Value / 100) 
                    : (decimal?)null));
        CreateMap<BidResponseDetailsDto, BidResponseDetailsViewModel>();
        CreateMap<BidResponseByProjectDto, BidResponseByProjectViewModel>();

        CreateMap<CreateBidMessageViewModel, CreateBidMessageDto>();
        CreateMap<BidMessageDto, BidMessageViewModel>();
        
        CreateMap<SendBidRequestViewModel, SendBidRequestDto>();
        CreateMap<AvailableSpecialistDto, AvailableSpecialistViewModel>();
        
        CreateMap<ProjectBidStatisticsDto, ProjectBidStatisticsViewModel>();
        
        CreateMap<BidRequestAttachmentDto, BidRequestAttachmentViewModel>();
        CreateMap<BidResponseAttachmentDto, BidResponseAttachmentViewModel>();

        CreateMap<BidRequestAttachment, BidRequestAttachmentDto>()
            .ForMember(dest => dest.DownloadUrl, opt => opt.Ignore())
            .ForMember(dest => dest.UploadedByName, opt => opt.MapFrom(src => $"{src.UploadedByUser.FirstName} {src.UploadedByUser.LastName}"));

        CreateMap<BidResponseAttachment, BidResponseAttachmentDto>()
            .ForMember(dest => dest.DownloadUrl, opt => opt.Ignore())
            .ForMember(dest => dest.UploadedByName, opt => opt.MapFrom(src => $"{src.UploadedByUser.FirstName} {src.UploadedByUser.LastName}"));
    }
}
