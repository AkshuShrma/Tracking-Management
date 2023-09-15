using AutoMapper;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Tracker.Models.DTO
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserDto, ApplicationUser>().ReverseMap();
            CreateMap<BookViewModel,Book>().ReverseMap();
        }
    }
}
