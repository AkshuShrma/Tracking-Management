using System.Text.Json.Serialization;

namespace Tracker.Models.DTO
{
    public class BookViewModel
    {
        public BookViewModel()
        {
            TrackingDetails = new List<TrackingOutput>();
        }
        public int BookId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int Cost { get; set; } = 0;
        public string? UserId { get; set; } = string.Empty;
        public ApplicationUser? ApplicationUser { get; set; }
        public IList<TrackingOutput> TrackingDetails { get; set; }
    }
}
