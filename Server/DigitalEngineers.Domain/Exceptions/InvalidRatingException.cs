namespace DigitalEngineers.Domain.Exceptions;

public class InvalidRatingException : ValidationException
{
    public int Rating { get; }
    
    public InvalidRatingException(int rating) 
        : base($"Invalid rating: {rating}. Rating must be between 1 and 5")
    {
        Rating = rating;
    }
}
