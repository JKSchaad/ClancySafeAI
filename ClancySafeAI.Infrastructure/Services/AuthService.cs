using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ClancySafeAI.Core.Interfaces;
using ClancySafeAI.Core.Models.Auth;
using ClancySafeAI.Core.Entities;
using ClancySafeAI.Core.Enums;

namespace ClancySafeAI.Infrastructure.Services;

/// <summary>
/// Implementation of authentication service
/// </summary>
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
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _otpService = otpService ?? throw new ArgumentNullException(nameof(otpService));
    }

    public async Task<bool> UserExistsAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _userRepository.ExistsAsync(phoneNumber, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user existence for phone number: {PhoneNumber}", phoneNumber);
            throw;
        }
    }

    public async Task<(string otp, string reference)> GenerateOtpAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Generating OTP for phone number: {PhoneNumber}", phoneNumber);
            return await _otpService.GenerateOtpAsync(phoneNumber, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating OTP for phone number: {PhoneNumber}", phoneNumber);
            throw;
        }
    }

    public async Task<bool> StoreRegistrationDataAsync(string reference, RegisterRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Storing registration data for reference: {Reference}", reference);
            // TODO: Implement temporary storage of registration data
            // For now, return true to indicate success
            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error storing registration data for reference: {Reference}", reference);
            throw;
        }
    }

    public async Task<bool> ValidateOtpAsync(string reference, string otp, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Validating OTP for reference: {Reference}", reference);
            return await _otpService.ValidateOtpAsync(reference, otp, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating OTP for reference: {Reference}", reference);
            throw;
        }
    }

    public async Task<User> CompleteRegistrationAsync(string reference, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Completing registration for reference: {Reference}", reference);

            // TODO: Retrieve stored registration data
            // For demo, create a new user with dummy data
            var user = new User
            {
                PhoneNumber = "temp",  // This should come from stored registration data
                FullName = "temp",     // This should come from stored registration data
                Email = "temp",        // This should come from stored registration data
                CompanyName = "temp",  // This should come from stored registration data
                JobTitle = "temp",     // This should come from stored registration data
                CreatedAt = DateTime.UtcNow,
                Status = UserStatus.Active
            };

            return await _userRepository.CreateAsync(user, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing registration for reference: {Reference}", reference);
            throw;
        }
    }
}