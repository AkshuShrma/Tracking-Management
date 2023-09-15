namespace Tracker.Models.DTO
{
    public class TrackingViewModel
    {
        public string TrackingId { get; set; } = Guid.NewGuid().ToString();
        public int BookId { get; set; } = 0;
        public string UserId { get; set; } = string.Empty;

        public DateTime TrackingDate { get; set; } = DateTime.Now;
    }
}
