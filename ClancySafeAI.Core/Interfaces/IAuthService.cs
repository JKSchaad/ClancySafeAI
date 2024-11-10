using System.Threading.Tasks;
using ClancySafeAI.Core.Models.Auth;
using ClancySafeAI.Core.Entities;

namespace ClancySafeAI.Core.Interfaces;

/// <summary>
/// Provides authentication-related functionality
/// </summary>
public interface IAuthService
{
    Task<bool> UserExistsAsync(string phoneNumber, CancellationToken cancellationToken = default);
    Task<(string otp, string reference)> GenerateOtpAsync(string phoneNumber, CancellationToken cancellationToken = default);
    Task<bool> StoreRegistrationDataAsync(string reference, RegisterRequest request, CancellationToken cancellationToken = default);
    Task<bool> VerifyOtpAndCreateUserAsync(string reference, string otp, CancellationToken cancellationToken = default);
}