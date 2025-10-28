using AutoMapper;
using DigitalEngineers.API.ViewModels.Bid;
using DigitalEngineers.API.ViewModels.Specialist;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;

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

        CreateMap<CreateBidResponseViewModel, CreateBidResponseDto>();
        CreateMap<UpdateBidResponseViewModel, UpdateBidResponseDto>();
        CreateMap<BidResponseDto, BidResponseViewModel>();
        CreateMap<BidResponseDetailsDto, BidResponseDetailsViewModel>();

        CreateMap<CreateBidMessageViewModel, CreateBidMessageDto>();
        CreateMap<BidMessageDto, BidMessageViewModel>();
        
        CreateMap<SendBidRequestViewModel, SendBidRequestDto>();
        CreateMap<AvailableSpecialistDto, AvailableSpecialistViewModel>();
    }
}
