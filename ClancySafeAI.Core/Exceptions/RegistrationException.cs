namespace ClancySafeAI.Core.Exceptions;

public class RegistrationException : Exception
{
    public RegistrationException(string message) : base(message) { }
    public RegistrationException(string message, Exception inner) : base(message, inner) { }
} 