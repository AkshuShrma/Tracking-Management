using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Tracker.Data;
using Tracker.Models;

namespace Tracker.Repository
{
    public class BookRepo : IBookRepo
    {
        private readonly ApplicationDbContext _context;

        public BookRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBook(int id)
        {
            var booksInDb =await _context.Books.FindAsync(id);
            _context.Books.Remove(booksInDb);
            await _context.SaveChangesAsync();
            return true;
        }

        public Book GetBookById(int id)
        {
            var emp = _context.Books.FirstOrDefault(v => v.BookId == id);
            return emp;
        }

        public ICollection<Book> GetBooks(string userId)
        {
            var data = _context.Books.Where(u => u.UserId==userId).ToList();
            return data;
        }

        public async Task<bool> UpdateBook( Book book)
        {
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
