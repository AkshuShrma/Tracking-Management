using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using Tracker;
using Tracker.Data;
using Tracker.EndPoints;
using Tracker.Invitations;
using Tracker.Models;
using Tracker.Models.DTO;
using Tracker.Repository;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddScoped<IBookRepo, BookRepo>();
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IEmailSender, EmailSender>();
builder.Services.AddScoped<IInvitationRepo, InvitationRepo>();
builder.Services.AddScoped<ITrackingRepo, TrackingRepo>();
builder.Services.AddScoped<UnitOfWork>();

//Configure the connection string here...
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Conn"));
});

// set the configuration for identity implementation
builder.Services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                   Type=ReferenceType.SecurityScheme,
                   Id="Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddAuthorization();
//JWT code
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
          builder.Configuration.GetSection("AppSettings:Token").Value!))
    };
});

// adding cors policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "My", policy =>
    {
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

// set dto configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//EndPoints
app.MapGroup("/minimalAPI")
    .BooksAPI()
    .WithTags("Books API By AK");

app.MapGroup("/minimalAPI")
    .LoginRegisterAPI()
    .WithTags("Login/Register");

app.MapGroup("/minimalAPI")
    .EmailVerification()
    .WithTags("Email API");

app.MapGroup("/minimalAPI")
    .SendInvitation()
    .WithTags("Invitation API");

app.UseHttpsRedirection();
app.UseCors("My");
app.UseAuthentication();
app.UseAuthorization();
app.Run();