namespace ClancySafeAI.Core.Models.Auth
{
    /// <summary>
    /// Represents the response to a registration request
    /// </summary>
    public class RegisterResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string OtpReference { get; set; }
    }
} 