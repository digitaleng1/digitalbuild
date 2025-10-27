namespace DigitalEngineers.Domain.Exceptions;

public class PortfolioItemNotFoundException : Exception
{
    public int PortfolioItemId { get; }

    public PortfolioItemNotFoundException(int portfolioItemId)
        : base($"Portfolio item with ID {portfolioItemId} not found")
    {
        PortfolioItemId = portfolioItemId;
    }
}
