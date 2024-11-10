namespace ClancySafeAI.Core.Interfaces;

/// <summary>
/// Service for managing One-Time Password (OTP) operations
/// </summary>
public interface IOtpService
{
    Task<(string otp, string reference)> GenerateOtpAsync(string phoneNumber, CancellationToken cancellationToken = default);
    Task<bool> ValidateOtpAsync(string reference, string otp, CancellationToken cancellationToken = default);
    Task<bool> IsValidReferenceAsync(string reference, CancellationToken cancellationToken = default);
} 