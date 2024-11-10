using System;
using ClancySafeAI.Core.Enums;

namespace ClancySafeAI.Core.Entities
{
    /// <summary>
    /// Represents a user in the ClancySafeAI system
    /// </summary>
    public class User
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string CompanyName { get; set; }
        public string JobTitle { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserStatus Status { get; set; }
    }
} 