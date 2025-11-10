namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Base class for "Not Found" exceptions (HTTP 404)
/// </summary>
public abstract class NotFoundException : Exception
{
    protected NotFoundException(string message) : base(message) { }
}
