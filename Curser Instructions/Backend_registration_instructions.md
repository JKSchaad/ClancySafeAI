I aam Claude the PM please follow my instructions:

# Backend Registration Implementation Instructions

## Step 1: Create Core Entity Models

Create file: ClancySafeAI.Core/Entities/User.cs
```csharp
public class User
{
    public int Id { get; set; }
    public string PhoneNumber { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string CompanyName { get; set; }
    public string JobTitle { get; set; }
    public DateTime CreatedAt { get; set; }
    public UserStatus Status { get; set; }
}
```

Create file: ClancySafeAI.Core/Enums/UserStatus.cs
```csharp
public enum UserStatus
{
    PendingVerification,
    Active,
    Suspended,
    Deactivated
}
```

## Step 2: Create Request/Response Models

Create file: ClancySafeAI.Core/Models/Auth/RegisterRequest.cs
```csharp
public class RegisterRequest
{
    public string PhoneNumber { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string CompanyName { get; set; }
    public string JobTitle { get; set; }
}
```

Create file: ClancySafeAI.Core/Models/Auth/RegisterResponse.cs
```csharp
public class RegisterResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string OtpReference { get; set; }
}
```

## Step 3: Create Service Interfaces

Create file: ClancySafeAI.Core/Interfaces/IAuthService.cs
```csharp
public interface IAuthService
{
    Task<bool> UserExistsAsync(string phoneNumber);
    Task<(string otp, string reference)> GenerateOtpAsync(string phoneNumber);
    Task<bool> StoreRegistrationDataAsync(string reference, RegisterRequest request);
}
```

Create file: ClancySafeAI.Core/Interfaces/ICommunicationService.cs
```csharp
public interface ICommunicationService
{
    Task<bool> SendOtpSmsAsync(string phoneNumber, string otp);
}
```

## Step 4: Implement Services

Create file: ClancySafeAI.Infrastructure/Services/AuthService.cs
```csharp
public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    private readonly IConfiguration _configuration;
    // Add other dependencies as needed

    public AuthService(
        ILogger<AuthService> logger,
        IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<bool> UserExistsAsync(string phoneNumber)
    {
        // TODO: Implement user existence check
        throw new NotImplementedException();
    }

    public async Task<(string otp, string reference)> GenerateOtpAsync(string phoneNumber)
    {
        // Generate a random 6-digit OTP
        var otp = Random.Shared.Next(100000, 999999).ToString();
        // Generate a unique reference
        var reference = Guid.NewGuid().ToString("N");
        
        // TODO: Store OTP and reference in cache or temporary storage
        
        return (otp, reference);
    }

    public async Task<bool> StoreRegistrationDataAsync(string reference, RegisterRequest request)
    {
        // TODO: Store registration data temporarily
        throw new NotImplementedException();
    }
}
```

Create file: ClancySafeAI.Infrastructure/Services/CommunicationService.cs
```csharp
public class CommunicationService : ICommunicationService
{
    private readonly ILogger<CommunicationService> _logger;
    private readonly IConfiguration _configuration;

    public CommunicationService(
        ILogger<CommunicationService> logger,
        IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<bool> SendOtpSmsAsync(string phoneNumber, string otp)
    {
        try
        {
            // TODO: Implement SMS sending using Azure Communication Services
            // For now, just log the OTP
            _logger.LogInformation("OTP for {PhoneNumber}: {OTP}", phoneNumber, otp);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send OTP to {PhoneNumber}", phoneNumber);
            return false;
        }
    }
}
```

## Step 5: Create Controller

Create file: ClancySafeAI.API/Controllers/AuthController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly IAuthService _authService;
    private readonly ICommunicationService _communicationService;

    public AuthController(
        ILogger<AuthController> logger,
        IAuthService authService,
        ICommunicationService communicationService)
    {
        _logger = logger;
        _authService = authService;
        _communicationService = communicationService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // Check if user already exists
            if (await _authService.UserExistsAsync(request.PhoneNumber))
            {
                return Conflict(new RegisterResponse 
                { 
                    Success = false, 
                    Message = "User already exists" 
                });
            }

            // Generate OTP and reference
            var (otp, reference) = await _authService.GenerateOtpAsync(request.PhoneNumber);
            
            // Send OTP via SMS
            await _communicationService.SendOtpSmsAsync(request.PhoneNumber, otp);

            // Store user registration data temporarily
            await _authService.StoreRegistrationDataAsync(reference, request);

            return Ok(new RegisterResponse
            {
                Success = true,
                Message = "Registration initiated. Please verify your phone number.",
                OtpReference = reference
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration");
            return StatusCode(500, new RegisterResponse 
            { 
                Success = false, 
                Message = "An error occurred during registration" 
            });
        }
    }
}
```

## Step 6: Register Services

Update file: ClancySafeAI.API/Program.cs
Add these lines before `builder.Build()`:
```csharp
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICommunicationService, CommunicationService>();
```

## Implementation Notes:

1. Create all files in the exact locations specified
2. Implement proper error handling and logging in all components
3. Follow the existing project structure and naming conventions
4. Add appropriate XML documentation comments
5. Ensure all async methods include proper cancellation token support
6. Use dependency injection as shown in the examples

Next steps after implementation:
1. Notify me for review
2. We'll then proceed with database context and migrations
3. Finally implement the caching mechanism for OTP storage

Let me know if you need any clarification on these instructions.

----------------------------------------

# From: Claude (Project Manager)
# To: Cursor (Backend Engineer)
# Re: Database Context Implementation for ClancySafeAI
# Date: November 10, 2024

Dear Cursor,

Please implement the following database-related components according to our technical specifications. These implementations are critical for the user registration functionality we're developing.

## Implementation Tasks

1. First create ApplicationDbContext:
```csharp
// ClancySafeAI.Infrastructure/Data/ApplicationDbContext.cs
using ClancySafeAI.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClancySafeAI.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PhoneNumber).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.Property(e => e.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20);
            
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.CompanyName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.JobTitle)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");
        });
    }
}
```

2. Create the User entity:
```csharp
// ClancySafeAI.Core/Entities/User.cs
namespace ClancySafeAI.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public UserStatus Status { get; set; }
}
```

3. Create the UserStatus enum:
```csharp
// ClancySafeAI.Core/Enums/UserStatus.cs
namespace ClancySafeAI.Core.Enums;

public enum UserStatus
{
    PendingVerification,
    Active,
    Suspended,
    Deactivated
}
```

4. Update Program.cs with the following addition after builder.Services.AddControllers():
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

5. Update appsettings.json - add this to the existing configuration:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ClancySafeAI;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

## Implementation Notes
- Follow existing project structure and naming conventions
- Maintain XML documentation standards
- Ensure proper namespace usage
- Verify all using statements are included
- Follow our established coding style guidelines

Please implement these components in the specified order and notify me once complete. Do not proceed with any additional implementations without my explicit instructions.

After your implementation, I will guide the team through creating and running the database migrations using Visual Studio's Package Manager Console.

Regards,
Claude
Project Manager, ClancySafeAI


-----------------------------------

# From: Claude (Project Manager)
# To: Cursor (Backend Engineer)
# Re: Repository Layer Implementation for User Management
# Date: November 10, 2024

Cursor, please implement the following components for our repository layer. We'll need these for user registration functionality.

## 1. Create IUserRepository Interface
```csharp
// ClancySafeAI.Core/Interfaces/IUserRepository.cs
using ClancySafeAI.Core.Entities;

namespace ClancySafeAI.Core.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<User?> GetByPhoneNumberAsync(string phoneNumber, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string phoneNumber, CancellationToken cancellationToken = default);
    Task<User> CreateAsync(User user, CancellationToken cancellationToken = default);
    Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);
}
```

## 2. Create UserRepository Implementation
```csharp
// ClancySafeAI.Infrastructure/Data/Repositories/UserRepository.cs
using ClancySafeAI.Core.Entities;
using ClancySafeAI.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ClancySafeAI.Infrastructure.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserRepository> _logger;

    public UserRepository(
        ApplicationDbContext context,
        ILogger<UserRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Users.FindAsync(new object[] { id }, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with ID {UserId}", id);
            throw;
        }
    }

    public async Task<User?> GetByPhoneNumberAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with phone number {PhoneNumber}", phoneNumber);
            throw;
        }
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with email {Email}", email);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Users
                .AnyAsync(u => u.PhoneNumber == phoneNumber, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking existence of user with phone number {PhoneNumber}", phoneNumber);
            throw;
        }
    }

    public async Task<User> CreateAsync(User user, CancellationToken cancellationToken = default)
    {
        try
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user with phone number {PhoneNumber}", user.PhoneNumber);
            throw;
        }
    }

    public async Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        try
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellationToken);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user with ID {UserId}", user.Id);
            throw;
        }
    }

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Users.ToListAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all users");
            throw;
        }
    }
}
```

## 3. Update Program.cs
Add this registration after the existing service registrations:
```csharp
builder.Services.AddScoped<IUserRepository, UserRepository>();
```

## Implementation Notes:
1. Follow the exact namespace structure and file locations
2. Ensure proper exception handling and logging
3. Maintain consistent use of cancellation tokens
4. Follow existing code style and documentation standards
5. Do not modify the database context or entities

After implementation, verify that:
1. All files are in the correct locations
2. The solution builds successfully
3. No compiler warnings are present

Please notify me once the implementation is complete, and I will provide instructions for the next phase.

Regards,
Claude
Project Manager, ClancySafeAI

------------------------------------------

# From: Claude (Project Manager)
# To: Cursor (Backend Engineer)
# Re: OTP Storage Implementation
# Date: November 10, 2024

Cursor, please implement the OTP storage mechanism using in-memory caching for development purposes. We'll replace this with Redis in production later.

## 1. First, create the OTP service interface:
```csharp
// ClancySafeAI.Core/Interfaces/IOtpService.cs
namespace ClancySafeAI.Core.Interfaces;

public interface IOtpService
{
    Task<(string otp, string reference)> GenerateOtpAsync(string phoneNumber, CancellationToken cancellationToken = default);
    Task<bool> ValidateOtpAsync(string reference, string otp, CancellationToken cancellationToken = default);
    Task<bool> IsValidReferenceAsync(string reference, CancellationToken cancellationToken = default);
}
```

## 2. Create the OTP service implementation:
```csharp
// ClancySafeAI.Infrastructure/Services/OtpService.cs
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ClancySafeAI.Core.Interfaces;

namespace ClancySafeAI.Infrastructure.Services;

public class OtpService : IOtpService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<OtpService> _logger;
    private const int OTP_LENGTH = 6;
    private const int OTP_EXPIRY_MINUTES = 5;

    public OtpService(
        IMemoryCache cache,
        ILogger<OtpService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<(string otp, string reference)> GenerateOtpAsync(
        string phoneNumber, 
        CancellationToken cancellationToken = default)
    {
        var otp = GenerateOtp();
        var reference = Guid.NewGuid().ToString("N");
        
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(OTP_EXPIRY_MINUTES));

        var otpData = new OtpData
        {
            Otp = otp,
            PhoneNumber = phoneNumber,
            CreatedAt = DateTime.UtcNow
        };

        _cache.Set(reference, otpData, cacheOptions);
        
        _logger.LogInformation("Generated OTP for phone number {PhoneNumber} with reference {Reference}", 
            phoneNumber, reference);

        return (otp, reference);
    }

    public async Task<bool> ValidateOtpAsync(
        string reference, 
        string otp, 
        CancellationToken cancellationToken = default)
    {
        if (!_cache.TryGetValue(reference, out OtpData? otpData))
        {
            _logger.LogWarning("Invalid or expired OTP reference: {Reference}", reference);
            return false;
        }

        var isValid = otpData!.Otp == otp;
        
        if (isValid)
        {
            _cache.Remove(reference);
            _logger.LogInformation("OTP validated successfully for reference {Reference}", reference);
        }
        else
        {
            _logger.LogWarning("Invalid OTP attempt for reference {Reference}", reference);
        }

        return isValid;
    }

    public async Task<bool> IsValidReferenceAsync(
        string reference, 
        CancellationToken cancellationToken = default)
    {
        return _cache.TryGetValue(reference, out OtpData? _);
    }

    private string GenerateOtp()
    {
        var random = new Random();
        return random.Next(0, (int)Math.Pow(10, OTP_LENGTH)).ToString($"D{OTP_LENGTH}");
    }

    private class OtpData
    {
        public string Otp { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
```

## 3. Update Program.cs
Add these service registrations after the existing ones:
```csharp
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IOtpService, OtpService>();
```

## 4. Update AuthService to use OtpService
Update the AuthService.cs constructor and GenerateOtpAsync method:
```csharp
public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    private readonly IUserRepository _userRepository;
    private readonly IOtpService _otpService;

    public AuthService(
        ILogger<AuthService> logger,
        IUserRepository userRepository,
        IOtpService otpService)
    {
        _logger = logger;
        _userRepository = userRepository;
        _otpService = otpService;
    }

    public async Task<(string otp, string reference)> GenerateOtpAsync(
        string phoneNumber, 
        CancellationToken cancellationToken = default)
    {
        return await _otpService.GenerateOtpAsync(phoneNumber, cancellationToken);
    }
}
```

## Implementation Notes:
1. Follow existing naming conventions and code style
2. Implement proper error handling and logging
3. Use cancellation tokens consistently
4. Maintain appropriate XML documentation
5. Don't modify existing entity or context code

After implementation:
1. Verify solution builds successfully
2. Ensure all dependencies are properly registered
3. Check for any compiler warnings

Let me know once implementation is complete, and we'll proceed with the CommunicationService implementation.

Regards,
Claude
Project Manager, ClancySafeAI