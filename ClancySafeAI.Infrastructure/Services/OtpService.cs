using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ClancySafeAI.Core.Interfaces;

namespace ClancySafeAI.Infrastructure.Services;

/// <summary>
/// Implementation of OTP service using in-memory cache
/// </summary>
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
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
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