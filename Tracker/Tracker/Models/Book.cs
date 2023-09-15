using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tracker.Models
{
    public class Book
    {
        public int BookId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int Cost { get; set; } = 0;
        public bool isDeleted { get; set; } = false;
        public string? UserId { get; set; } = string.Empty;
        [ForeignKey("UserId")]
        public ApplicationUser? ApplicationUser { get; set; }
    }
}
