using Tracker.Models;

namespace Tracker.Repository
{
    public interface IBookRepo
    {
        ICollection<Book> GetBooks(string userId);
        public Book GetBookById(int id);
        Task<bool> AddBook(Book book);
        Task<bool> UpdateBook( Book book);
        Task<bool> DeleteBook(int id);
    }
}
