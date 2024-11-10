namespace ClancySafeAI.Core.Models.Auth
{
    /// <summary>
    /// Represents a user registration request
    /// </summary>
    public class RegisterRequest
    {
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string CompanyName { get; set; }
        public string JobTitle { get; set; }
    }
} 