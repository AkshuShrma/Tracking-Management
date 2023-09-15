using Tracker.Data;
using Tracker.Models;

namespace Tracker.Repository
{
    public class TrackingRepo : ITrackingRepo
    {
        private readonly ApplicationDbContext _context;

        public TrackingRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public bool CreateTracking(Tracking tracking)
        {
            _context.Trackings.Add(tracking);
            _context.SaveChangesAsync();
            return true;
        }

        public ICollection<Tracking> GetBooks(string DataChangeUserId)
        {
            var data = _context.Trackings.Where(u => u.DataChangeId == DataChangeUserId).ToList();
            return data;
        }
    }
}
