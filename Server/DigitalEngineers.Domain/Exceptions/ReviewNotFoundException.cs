namespace DigitalEngineers.Domain.Exceptions;

public class ReviewNotFoundException : NotFoundException
{
    public int ReviewId { get; }
    
    public ReviewNotFoundException(int reviewId) 
        : base($"Review with ID {reviewId} not found")
    {
        ReviewId = reviewId;
    }
}
