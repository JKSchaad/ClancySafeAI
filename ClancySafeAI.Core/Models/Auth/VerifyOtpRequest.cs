using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// ClancySafeAI.Core/Models/Auth/VerifyOtpRequest.cs
namespace ClancySafeAI.Core.Models.Auth;

public class VerifyOtpRequest
{
    public string Reference { get; set; } = string.Empty;
    public string Otp { get; set; } = string.Empty;
}