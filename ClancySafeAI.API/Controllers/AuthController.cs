using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ClancySafeAI.Core.Interfaces;
using ClancySafeAI.Core.Models.Auth;

namespace ClancySafeAI.API.Controllers
{
    /// <summary>
    /// Handles authentication-related endpoints
    /// </summary>
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
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _communicationService = communicationService ?? throw new ArgumentNullException(nameof(communicationService));
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                _logger.LogInformation("Processing registration request for phone number: {PhoneNumber}", request.PhoneNumber);

                // Check if user already exists
                if (await _authService.UserExistsAsync(request.PhoneNumber))
                {
                    _logger.LogWarning("Registration failed - user already exists: {PhoneNumber}", request.PhoneNumber);
                    return Conflict(new RegisterResponse 
                    { 
                        Success = false, 
                        Message = "User already exists" 
                    });
                }

                // Generate OTP and reference
                (string otp, string reference) = await _authService.GenerateOtpAsync(request.PhoneNumber);
                
                // Send OTP via SMS
                await _communicationService.SendOtpSmsAsync(request.PhoneNumber, otp);

                // Store user registration data temporarily
                await _authService.StoreRegistrationDataAsync(reference, request);

                _logger.LogInformation("Registration initiated successfully for phone number: {PhoneNumber}", request.PhoneNumber);

                return Ok(new RegisterResponse
                {
                    Success = true,
                    Message = "Registration initiated. Please verify your phone number.",
                    OtpReference = reference
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration for phone number: {PhoneNumber}", request.PhoneNumber);
                return StatusCode(500, new RegisterResponse 
                { 
                    Success = false, 
                    Message = "An error occurred during registration" 
                });
            }
        }

        [HttpPost("verify")]
        public async Task<ActionResult<RegisterResponse>> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            try
            {
                _logger.LogInformation("Processing OTP verification for reference: {Reference}", request.Reference);

                // Check if reference exists and OTP is valid
                var isValid = await _authService.ValidateOtpAsync(request.Reference, request.Otp);
                if (!isValid)
                {
                    _logger.LogWarning("OTP verification failed for reference: {Reference}", request.Reference);
                    return BadRequest(new RegisterResponse
                    {
                        Success = false,
                        Message = "Invalid OTP code"
                    });
                }

                // Complete user registration here
                var user = await _authService.CompleteRegistrationAsync(request.Reference);

                _logger.LogInformation("OTP verification and registration completed successfully for reference: {Reference}", request.Reference);

                return Ok(new RegisterResponse
                {
                    Success = true,
                    Message = "Registration completed successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during OTP verification for reference: {Reference}", request.Reference);
                return StatusCode(500, new RegisterResponse
                {
                    Success = false,
                    Message = "An error occurred during verification"
                });
            }
        }
    }
} 