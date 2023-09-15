using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tracker.Models
{
    public class ApplicationUser:IdentityUser
    {
        [NotMapped]
        public string? Token { get; set; }
    }
}
