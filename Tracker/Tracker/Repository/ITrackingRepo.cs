using Tracker.Models;

namespace Tracker.Repository
{
    public interface ITrackingRepo
    {
        ICollection<Tracking> GetBooks(string DataChangeUserId);
        public bool CreateTracking(Tracking tracking);
    }
}
