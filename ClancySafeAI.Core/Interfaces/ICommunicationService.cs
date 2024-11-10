using System.Threading.Tasks;

namespace ClancySafeAI.Core.Interfaces
{
    /// <summary>
    /// Provides communication services such as SMS
    /// </summary>
    public interface ICommunicationService
    {
        Task<bool> SendOtpSmsAsync(string phoneNumber, string otp);
    }
} 