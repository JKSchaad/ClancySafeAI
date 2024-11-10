using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ClancySafeAI.Core.Interfaces;
using ClancySafeAI.Core.Models.Auth;
using System.Threading;
using ClancySafeAI.Core.Exceptions;

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
            _logger = logger;
            _authService = authService;
            _communicationService = communicationService;
        }

        [HttpPost("verify")]
        public async Task<ActionResult<RegisterResponse>> VerifyOtp(
            [FromBody] VerifyOtpRequest request,
            CancellationToken cancellationToken = default)
        {
            if (request == null)
                return BadRequest(new RegisterResponse { Success = false, Message = "Invalid request" });

            if (string.IsNullOrEmpty(request.Reference) || string.IsNullOrEmpty(request.Otp))
                return BadRequest(new RegisterResponse { Success = false, Message = "Reference and OTP are required" });

            try
            {
                _logger.LogInformation("Processing OTP verification for reference {Reference}", request.Reference);

                var success = await _authService.VerifyOtpAndCreateUserAsync(
                    request.Reference, 
                    request.Otp,
                    cancellationToken);
                
                if (!success)
                {
                    return BadRequest(new RegisterResponse 
                    { 
                        Success = false, 
                        Message = "Invalid OTP or reference" 
                    });
                }

                return Ok(new RegisterResponse
                {
                    Success = true,
                    Message = "Registration completed successfully"
                });
            }
            catch (RegistrationException ex)
            {
                _logger.LogWarning(ex, "Registration failed for reference {Reference}", request.Reference);
                return BadRequest(new RegisterResponse 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during OTP verification for reference {Reference}", request.Reference);
                return StatusCode(500, new RegisterResponse 
                { 
                    Success = false, 
                    Message = "An unexpected error occurred during verification" 
                });
            }
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
                
                // Send OTP via SMS (in development, this will log to console)
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

        [HttpPost("login")]
        public async Task<ActionResult<RegisterResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Check if user exists
                if (!await _authService.UserExistsAsync(request.PhoneNumber))
                {
                    return NotFound(new RegisterResponse 
                    { 
                        Success = false, 
                        Message = "User not found" 
                    });
                }

                // Generate OTP and reference
                var (otp, reference) = await _authService.GenerateLoginOtpAsync(request.PhoneNumber);
                
                // Send OTP via SMS
                await _communicationService.SendOtpSmsAsync(request.PhoneNumber, otp);

                return Ok(new RegisterResponse
                {
                    Success = true,
                    Message = "OTP sent successfully",
                    OtpReference = reference
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for {PhoneNumber}", request.PhoneNumber);
                return StatusCode(500, new RegisterResponse 
                { 
                    Success = false, 
                    Message = "An error occurred during login" 
                });
            }
        }

        [HttpPost("login/verify")]
        public async Task<ActionResult<RegisterResponse>> VerifyLogin([FromBody] VerifyOtpRequest request)
        {
            try
            {
                var success = await _authService.VerifyLoginOtpAsync(request.Reference, request.Otp);
                
                if (!success)
                {
                    return BadRequest(new RegisterResponse 
                    { 
                        Success = false, 
                        Message = "Invalid OTP" 
                    });
                }

                return Ok(new RegisterResponse
                {
                    Success = true,
                    Message = "Login successful"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login verification");
                return StatusCode(500, new RegisterResponse 
                { 
                    Success = false, 
                    Message = "An error occurred during verification" 
                });
            }
        }
    }
} 