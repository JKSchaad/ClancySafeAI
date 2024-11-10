using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using ClancySafeAI.Core.Interfaces;

namespace ClancySafeAI.Infrastructure.Services
{
    /// <summary>
    /// Implementation of communication service
    /// </summary>
    public class CommunicationService : ICommunicationService
    {
        private readonly ILogger<CommunicationService> _logger;
        private readonly IConfiguration _configuration;

        public CommunicationService(
            ILogger<CommunicationService> logger,
            IConfiguration configuration)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<bool> SendOtpSmsAsync(string phoneNumber, string otp)
        {
            try
            {
                // Development only - log OTP clearly
                _logger.LogInformation("******************************************");
                _logger.LogInformation("DEVELOPMENT MODE - OTP for testing");
                _logger.LogInformation($"Phone: {phoneNumber}");
                _logger.LogInformation($"OTP: {otp}");
                _logger.LogInformation("******************************************");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send OTP to {PhoneNumber}", phoneNumber);
                return false;
            }
        }
    }
} 