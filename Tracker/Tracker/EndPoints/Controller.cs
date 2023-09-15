using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Tracker.Invitations;
using Tracker.Models;
using Tracker.Models.DTO;
using Tracker.Repository;

namespace Tracker.EndPoints
{
    public static class Controller
    {
        public static RouteGroupBuilder BooksAPI(this RouteGroupBuilder app)
        {

            app.MapGet("/Books", GetAllBooks);
            app.MapGet("/getBooks/{id}", GetBooksById);
            app.MapPost("/newBooks", NewBooks);
            app.MapPut("/updateBooks", UpdateBooks);
            app.MapDelete("/deleteBooks/{bookId}", DeleteBooks);
            
            return app;
        }

        public async static Task<IResult> GetAllBooks(ITrackingRepo trackingRepo, IMapper mapper, IBookRepo bookRepo, IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor,UnitOfWork unit)
        {
            if (bookRepo == null)
            {
                return Results.BadRequest("First add the books.");
            }

            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);
            var data = bookRepo.GetBooks(getSenderId);

            // now i will do mapping ......................
            IList<BookViewModel> shipping = mapper.Map<IList<BookViewModel>>(data);
            if (data.Count == 0) return Results.Ok(data);

            var findTracking = trackingRepo.GetBooks(data.FirstOrDefault().UserId);
            foreach (var tracking in findTracking)
            {
                shipping.FirstOrDefault(u => u.BookId == tracking.BookId).TrackingDetails.Add(
                    new TrackingOutput()
                    {
                        TrackingId = tracking.TrackingId,
                        BookId = tracking.BookId,
                        DataChangeId = tracking.TrackingId,
                        DataChangeUser = unit.CheckPersonsId(tracking.UserId),
                        UserActions = (TrackingOutput.Action)tracking.UserActions,
                        TrackingDate = tracking.TrackingDate
                    });
            }
            return Results.Ok(shipping);
        }

        public async static Task<IResult> GetBooksById(int id,IBookRepo bookRepo)
        {
            if (id == 0) Results.BadRequest("Id Not Matched");
            return Results.Ok( bookRepo.GetBookById(id));
        }

        public async  static Task<IResult> NewBooks(UnitOfWork unit, ITrackingRepo trackingRepo, IMapper mapper, BookViewModel book, IBookRepo bookRepo, IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);
            if (getSenderId == null) return Results.BadRequest();
            var checkSenderInDatabase = unit.CheckPersonsId(getSenderId);
            if (checkSenderInDatabase == null) return Results.BadRequest();
            if (book.UserId != ""){
                var data = unit.CheckPersonsId(book.UserId);
                if (data == null) return Results.BadRequest();
                book.UserId = data.Id;
            }else{
                book.UserId = checkSenderInDatabase.Id;
            }
            Book booking = mapper.Map<Book>(book);
            var addBooking = await bookRepo.AddBook(booking);
            if (!addBooking){
                return Results.StatusCode(StatusCodes.Status500InternalServerError);
            }
            if (book.UserId != getSenderId)
            {
                // here we will perform tracking.................
                Tracking tracking = new Tracking()
                {
                    BookId = booking.BookId,
                    UserId = getSenderId,
                    TrackingDate = DateTime.UtcNow,
                    UserActions = Tracking.Action.Add,
                    DataChangeId = booking.UserId
                };
                var trackingCreate = trackingRepo.CreateTracking(tracking);

                if (!trackingCreate) { return Results.StatusCode(StatusCodes.Status500InternalServerError); }
                book.TrackingDetails.Add(
                    new TrackingOutput()
                    {
                        TrackingId = tracking.TrackingId,
                        BookId = tracking.BookId,
                        DataChangeId = tracking.TrackingId,
                        DataChangeUser = unit.CheckPersonsId(tracking.UserId),
                        UserActions = (TrackingOutput.Action)tracking.UserActions,
                        TrackingDate = tracking.TrackingDate
                    });
            }
            return Results.Ok(new { Status = 1, Message = "Book created successfully", data = booking });
        }

        public async static Task<IResult> UpdateBooks(UnitOfWork unit, ITrackingRepo trackingRepo, IMapper mapper, BookViewModel book, IBookRepo bookRepo, IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);
            if (getSenderId == null) return Results.BadRequest();
            var checkSenderInDatabase = unit.CheckPersonsId(getSenderId);
            if (checkSenderInDatabase == null) return Results.BadRequest();
            if (book.UserId != ""){
                var data = unit.CheckPersonsId(book.UserId);
                if (data == null) return Results.BadRequest();
                book.UserId = data.Id;
            }else{
                book.UserId = checkSenderInDatabase.Id;
            }
            Book booking = mapper.Map<Book>(book);
            var addBooking = await bookRepo.UpdateBook(booking);
            if (!addBooking)
            {
                return Results.StatusCode(StatusCodes.Status500InternalServerError);
            }
            if (book.UserId != getSenderId)
            {
                // here we will perform tracking.................
                Tracking tracking = new Tracking()
                {
                    BookId = booking.BookId,
                    UserId = getSenderId,
                    TrackingDate = DateTime.UtcNow,
                    UserActions = Tracking.Action.Update,
                    DataChangeId = booking.UserId
                };
                var trackingCreate = trackingRepo.CreateTracking(tracking);

                if (!trackingCreate) { return Results.StatusCode(StatusCodes.Status500InternalServerError); }
                book.TrackingDetails.Add(
                    new TrackingOutput()
                    {
                        TrackingId = tracking.TrackingId,
                        BookId = tracking.BookId,
                        DataChangeId = tracking.TrackingId,
                        DataChangeUser = unit.CheckPersonsId(tracking.UserId),
                        UserActions = (TrackingOutput.Action)tracking.UserActions,
                        TrackingDate = tracking.TrackingDate
                    });
            }
            return Results.Ok(new { Status = 1, Message = "Book updated successfully", data = booking });
        }

        public async static Task<IResult> DeleteBooks(UnitOfWork unit, ITrackingRepo trackingRepo, int bookId, IBookRepo bookRepo, IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);
            if (getSenderId == null) return Results.BadRequest();
            var checkSenderInDatabase = unit.CheckPersonsId(getSenderId);
            if (checkSenderInDatabase == null) return Results.BadRequest();
            if (bookId == 0) return Results.BadRequest();
            var getShipping = bookRepo.GetBookById(bookId);
            if (getShipping.UserId != checkSenderInDatabase.Id)
            {
                var data = unit.CheckPersonsId(checkSenderInDatabase.Id);
                if (data == null) return Results.BadRequest();
                // here we will perform tracking.................
                Tracking tracking = new Tracking()
                {
                    BookId = getShipping.BookId,
                    UserId = getSenderId,
                    TrackingDate = DateTime.UtcNow,
                    UserActions = Tracking.Action.Delete,
                    DataChangeId = getShipping.UserId
                };
                if (!trackingRepo.CreateTracking(tracking)) { Results.StatusCode(StatusCodes.Status500InternalServerError); }
                getShipping.isDeleted = true;
                bookRepo.UpdateBook(getShipping);
                return Results.Ok(new { Status = 1, Message = "Shipping deleted successfully", data = getShipping });
            }
            var deleteShipping =await bookRepo.DeleteBook(bookId);
            if (deleteShipping) return Results.Ok(new { Status = 1, Message = "Deleted Successfully!!" });
            return Results.StatusCode(StatusCodes.Status500InternalServerError);
        }

        public static RouteGroupBuilder LoginRegisterAPI(this RouteGroupBuilder app)
        {
            app.MapPost("/register", Register);
            app.MapPost("/login", Login);

            return app;
        }

        public async static Task<IResult> Register (UserDto book, IUserRepo _context, IMapper _mapper)
        {
            if (book == null) return Results.BadRequest();
            var ApplicationUser = _mapper.Map<ApplicationUser>(book);
            ApplicationUser.PasswordHash = book.Password;
            if (!await _context.IsUnique(book.Email)) return Results.NotFound("Go to login");
            var registerUser = await _context.RegisterUser(ApplicationUser);
            if (!registerUser) return Results.BadRequest("Register not successfully");
            return Results.Ok("Register Successfully");
        }

        public async static Task<IResult> Login (LoginDto book, IUserRepo _context)
        {
             if (await _context.IsUnique(book.Username)) return Results.BadRequest(new { Status = 1, Data = "Please Register" });
             var userAuthorize = await _context.AuthenticateUser(book.Username, book.Password);
             if (userAuthorize == null) return Results.NotFound(new { Status = 1, Data = "Invalid Attempt" });
             return Results.Ok( new {data="User login successfully",userAuthorize});
        }

        public static RouteGroupBuilder EmailVerification(this RouteGroupBuilder app)
        {
            app.MapPost("/email", Email);

            return app;
        }

        public static IResult Email(EmailDto request, IEmailSender _context)
        {
            _context.SendEmail(request);
            return Results.Ok(request);
        }

        public static RouteGroupBuilder SendInvitation(this RouteGroupBuilder app)
        {
            app.MapGet("/getAll", GetAll);
            app.MapGet("/invitation/{username}", Invitation);
            app.MapPost("/createinvitation", CreateInvitation).RequireAuthorization();
            app.MapGet("/status/{reciverId}/{status:int}", Status);
            app.MapGet("/action/{reciverId}/{action:int}", Action);
            app.MapGet("invitationcomesfrom", InvitationSender);
            app.MapGet("/getinvitationersdata/{invitaionerId}", GetInvitationerData);
            app.MapGet("/getspecificdata/{userId}/{bookId}",trackingDetailsofUser);

            return app;
        }

        public static IResult GetInvitationerData(string? invitaionerId, UnitOfWork unit, ITrackingRepo trackingRepo, IMapper mapper, IBookRepo bookRepo, IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            if (string.IsNullOrEmpty(invitaionerId))
                return Results.BadRequest();
            var data = bookRepo.GetBooks(invitaionerId);
            // now i will do mapping ......................
            IList<BookViewModel> shipping = mapper.Map<IList<BookViewModel>>(data);
            if (data.Count == 0) return Results.Ok(data);

            var findTracking = trackingRepo.GetBooks(data.FirstOrDefault().UserId);
            foreach (var tracking in findTracking)
            {
                shipping.FirstOrDefault(u => u.BookId == tracking.BookId).TrackingDetails.Add(
                    new TrackingOutput()
                    {
                        TrackingId = tracking.TrackingId,
                        BookId = tracking.BookId,
                        DataChangeId = tracking.TrackingId,
                        DataChangeUser = unit.CheckPersonsId(tracking.UserId),
                        UserActions = (TrackingOutput.Action)tracking.UserActions,
                        TrackingDate = tracking.TrackingDate
                    });
            }
            return Results.Ok(shipping);
        }

        public static IResult trackingDetailsofUser(string userId, int bookId, ITrackingRepo trackingRepo, IMapper mapper, IBookRepo bookRepo, IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor,UnitOfWork _unitofWork)
        {
            if (string.IsNullOrEmpty(userId))
                return Results.BadRequest();

            var data = bookRepo.GetBooks(userId);

            if (data.Count == 0)
                return Results.NotFound();

            var selectedData = data.FirstOrDefault(u => u.BookId == bookId);
            if (selectedData == null)
                return Results.NotFound();

            // now I will do mapping...
            BookViewModel stateDTO = mapper.Map<BookViewModel>(selectedData);

            var findTracking = trackingRepo.GetBooks(selectedData.UserId);
            foreach (var tracking in findTracking)
            {
                if (tracking.BookId == selectedData.BookId)
                {
                    stateDTO.TrackingDetails.Add(
                        new TrackingOutput()
                        {
                            TrackingId = tracking.TrackingId,
                            BookId = tracking.BookId,
                            DataChangeId = tracking.DataChangeId,
                            DataChangeUser = _unitofWork.CheckPersonsId(tracking.UserId),
                            UserActions = (TrackingOutput.Action)tracking.UserActions,
                            TrackingDate = tracking.TrackingDate
                        });
                }
            }

            return Results.Ok(stateDTO);
        }    

        public static IResult InvitationSender( IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var userId = invitationRepo.GetIdFromToken(token);
            if (userId == null) return Results.BadRequest();
            var data = invitationRepo.InvitationComesFromUser(userId);
            return Results.Ok(data);
        }

        public static IResult GetAll(IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);
            var data = invitationRepo.GetAllRegisteredPersons(getSenderId);
            return Results.Ok(data);
        }

        public static IResult Invitation(string username,IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);
            var data = invitationRepo.GetSpecificInvitations(username,getSenderId);
            return Results.Ok(data);
        }

        public static IResult Status( string reciverId, int status, IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);
            if (getSenderId == null || reciverId == null || status == 0) return Results.BadRequest();

            if (!invitationRepo.UpdateStatus(reciverId, getSenderId, status))
            {
                return Results.StatusCode(StatusCodes.Status500InternalServerError);
            }
            return Results.Ok(new { Status = 1, Message = "Invitation Updated Successfully" });
        }

        public static IResult Action(string reciverId, int action, IInvitationRepo invitationRepo, IHttpContextAccessor httpContextAccessor)
        {
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);
            if (getSenderId == null || reciverId == null || action == 0) return Results.BadRequest();

            if (!invitationRepo.UpdateAction(reciverId, getSenderId, action))
            {
                return Results.StatusCode(StatusCodes.Status500InternalServerError);
            }
            return Results.Ok(new { Status = 1, Message = "Invitation Updated Successfully" });
        }

        public static IResult CreateInvitation(FindUser invite,IHttpContextAccessor httpContextAccessor, IInvitationRepo invitationRepo)
        {
            if (string.IsNullOrEmpty(invite.Id))
                return Results.BadRequest();

            // here we will get the token form httpcontext ........
            var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var getSenderId = invitationRepo.GetIdFromToken(token);

            if (getSenderId == null)
                return Results.BadRequest(new { message = "your token doesnot contain user id " });


            var result = invitationRepo.CreateInvitation(getSenderId, invite.Id);
            return Results.Ok(result);
        }
    }
}
