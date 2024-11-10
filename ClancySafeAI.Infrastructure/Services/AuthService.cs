using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ClancySafeAI.Core.Interfaces;
using ClancySafeAI.Core.Models.Auth;
using ClancySafeAI.Core.Entities;
using ClancySafeAI.Core.Enums;
using Microsoft.Extensions.Caching.Memory;
using ClancySafeAI.Core.Exceptions;

namespace ClancySafeAI.Infrastructure.Services;

/// <summary>
/// Implementation of authentication service
/// </summary>
public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    private readonly IUserRepository _userRepository;
    private readonly IOtpService _otpService;
    private readonly IMemoryCache _cache;

    public AuthService(
        ILogger<AuthService> logger,
        IUserRepository userRepository,
        IOtpService otpService,
        IMemoryCache cache)
    {
        _logger = logger;
        _userRepository = userRepository;
        _otpService = otpService;
        _cache = cache;
    }

    public async Task<bool> UserExistsAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        return await _userRepository.ExistsAsync(phoneNumber, cancellationToken);
    }

    public async Task<(string otp, string reference)> GenerateOtpAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        return await _otpService.GenerateOtpAsync(phoneNumber, cancellationToken);
    }

    public async Task<bool> StoreRegistrationDataAsync(string reference, RegisterRequest request, CancellationToken cancellationToken = default)
    {
        // Store registration data in cache
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
            
        _cache.Set($"reg_{reference}", request, cacheOptions);
        return true;
    }

    // Enhancing error handling in AuthService
    public async Task<bool> VerifyOtpAndCreateUserAsync(
        string reference, 
        string otp, 
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(reference))
            throw new ArgumentNullException(nameof(reference));
        if (string.IsNullOrEmpty(otp))
            throw new ArgumentNullException(nameof(otp));

        try
        {
            // Validate OTP
            if (!await _otpService.ValidateOtpAsync(reference, otp, cancellationToken))
            {
                _logger.LogWarning("Invalid OTP attempt for reference {Reference}", reference);
                return false;
            }

            // Get registration data from cache
            if (!_cache.TryGetValue($"reg_{reference}", out RegisterRequest? request))
            {
                throw new RegistrationException($"Registration data not found for reference {reference}");
            }

            // Validate registration data
            if (request == null || string.IsNullOrEmpty(request.PhoneNumber))
            {
                throw new RegistrationException("Invalid registration data");
            }

            // Check if user already exists
            if (await _userRepository.ExistsAsync(request.PhoneNumber, cancellationToken))
            {
                throw new RegistrationException($"User already exists with phone number {request.PhoneNumber}");
            }

            // Create new user
            var user = new User
            {
                PhoneNumber = request.PhoneNumber,
                FullName = request.FullName,
                Email = request.Email,
                CompanyName = request.CompanyName,
                JobTitle = request.JobTitle,
                Status = UserStatus.Active,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user, cancellationToken);
            
            // Clean up cache
            _cache.Remove($"reg_{reference}");

            _logger.LogInformation("User created successfully: {PhoneNumber}", user.PhoneNumber);
            return true;
        }
        catch (RegistrationException)
        {
            throw; // Let these propagate up
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user for reference {Reference}", reference);
            throw new RegistrationException("An error occurred during user registration", ex);
        }
    }

    public async Task<(string otp, string reference)> GenerateLoginOtpAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if user exists
            var userExists = await _userRepository.ExistsAsync(phoneNumber, cancellationToken);
            if (!userExists)
            {
                throw new RegistrationException("User not found");
            }

            // Generate OTP
            return await _otpService.GenerateOtpAsync(phoneNumber, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating login OTP for {PhoneNumber}", phoneNumber);
            throw;
        }
    }

    public async Task<bool> VerifyLoginOtpAsync(string reference, string otp, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _otpService.ValidateOtpAsync(reference, otp, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying login OTP for reference {Reference}", reference);
            throw;
        }
    }
}