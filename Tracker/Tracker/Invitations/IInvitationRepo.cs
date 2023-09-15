using Microsoft.EntityFrameworkCore.Metadata;
using Tracker.Models;
using Tracker.Models.DTO;

namespace Tracker.Invitations
{
    public interface IInvitationRepo
    {
        ICollection<FindUser> GetSpecificInvitations(string username,string senderId);
        ICollection<Invite> GetAllRegisteredPersons(string userId);
        public bool CreateInvitation(string senderId, string reciverId);
        public bool UpdateAction(string reciverId, string senderId, int action);
        public string? GetIdFromToken(string token);
        public ICollection<Invite> InvitationComesFromUser(string userId);
        public bool UpdateStatus(string reciverId, string senderId, int status);
    }
}
