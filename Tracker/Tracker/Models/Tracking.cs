using System.ComponentModel.DataAnnotations;

namespace Tracker.Models
{
    public class Tracking
    {
        [Key]
        public string TrackingId { get; set; } = Guid.NewGuid().ToString();
        public DateTime TrackingDate { get; set; } = DateTime.Now;
        public int BookId { get; set; } = 0;
        public Book? Book { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? ApplicationUser { get; set; }
        public string DataChangeId { get; set; } = string.Empty;
        public ApplicationUser? DataChangeUser { get; set; }
        public Action UserActions { get; set; }
        public enum Action
        {
            Add = 1,
            Update = 2,
            Delete = 3
        };
    }
}
