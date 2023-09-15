using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Tracker.Data;
using Tracker.Models;
using Tracker.Models.DTO;

namespace Tracker.Repository
{
    public class UserRepo : IUserRepo
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManagaer;
        public static ApplicationUser user = new ApplicationUser();
        private readonly IConfiguration _configuration;
        public UserRepo(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManagaer, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManagaer = roleManagaer;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        public async Task<ApplicationUser?> AuthenticateUser(string userName, string userPassword)
        {
            var userExist = await _userManager.FindByNameAsync(userName);
            var userVerification = await _signInManager.CheckPasswordSignInAsync(userExist, userPassword, false);
            if (!userVerification.Succeeded) return null;
            string token = CreateToken(userExist.Id);
            userExist.Token= token;
            return userExist;
        }

        public async Task<ApplicationUser?> CheckUserInDb(string userName)
        {
            var UserInDb = await _userManager.FindByIdAsync(userName);
            if (UserInDb == null) return null;
            return UserInDb;
        }

        public async Task<bool> IsUnique(string userName)
        {
            var userExist = await _userManager.FindByNameAsync(userName);
            if (userExist == null) return true;
            return false;
        }

        public async Task<bool> RegisterUser(ApplicationUser request)
        {
            var users = await _userManager.CreateAsync(request, request.PasswordHash);
            if (!users.Succeeded) return false;
            return true;
        }

        private string CreateToken(string userId)
        {
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Name, userId)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }


    }
}
