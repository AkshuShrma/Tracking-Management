using Tracker.Models;
using Tracker.Models.DTO;

namespace Tracker.Repository
{
    public interface IUserRepo
    {
        Task<ApplicationUser?> AuthenticateUser(string userName, string userPassword);
        Task<bool> RegisterUser(ApplicationUser request);
        Task<bool> IsUnique(string userName);
        Task<ApplicationUser?> CheckUserInDb(string userName);
    }
}
