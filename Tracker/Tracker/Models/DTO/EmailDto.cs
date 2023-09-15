namespace Tracker.Models.DTO
{
    public class EmailDto
    {
        public string To { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string? receiverUserName { get; set; }
        public string? senderUserName { get; set; }
        public string? ReciverId { get; set; }
    }
}
