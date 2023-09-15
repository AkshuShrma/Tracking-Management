using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using Tracker.Models.DTO;

namespace Tracker.Repository
{
    public class EmailSender:IEmailSender
    {
        private readonly IConfiguration _config;

        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public void SendEmail(EmailDto request)
        {
            var email = new MimeMessage();

            email.From.Add(MailboxAddress.Parse(_config.GetSection("EmailUsername").Value));
            email.To.Add(MailboxAddress.Parse(request.To));
            email.Subject = request.Subject;
            var template = Directory.GetCurrentDirectory() + "\\Template\\Email.html";
            using (StreamReader stream = new StreamReader(template))
            {
                var mailText = stream.ReadToEnd();
                mailText = mailText.Replace("[senderUserName]", request.senderUserName)
                    .Replace("[receiverUserName]", request.receiverUserName)
                    .Replace("[date]", DateTime.UtcNow.ToString())
                    .Replace("[time]", DateTime.Now.ToShortTimeString())
                    .Replace("[reciverId]", request.ReciverId);

                email.Body = new TextPart(TextFormat.Html) { Text = mailText };
            }

            using var smtp = new SmtpClient();
            smtp.Connect(_config.GetSection("EmailHost").Value, 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_config.GetSection("EmailUsername").Value, _config.GetSection("EmailPassword").Value);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}
