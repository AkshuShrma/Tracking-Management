using Tracker.Models.DTO;

namespace Tracker.Repository
{
    public interface IEmailSender
    {
        void SendEmail(EmailDto request);
    }
}
