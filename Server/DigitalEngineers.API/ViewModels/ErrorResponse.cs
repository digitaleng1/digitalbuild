namespace DigitalEngineers.API.ViewModels
{
    public class ErrorResponse
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int Status { get; set; }
        public string? TraceId { get; set; }
        public string? Type { get; set; }
        public Dictionary<string, object>? Details { get; set; }

        public ErrorResponse(string message, int status)
        {
            Message = message;
            Status = status;
            Title = GetDefaultTitle(status);
        }

        public ErrorResponse(string title, string message, int status, string? traceId = null)
        {
            Title = title;
            Message = message;
            Status = status;
            TraceId = traceId;
        }

        private static string GetDefaultTitle(int status)
        {
            return status switch
            {
                400 => "Bad Request",
                401 => "Unauthorized",
                403 => "Forbidden",
                404 => "Not Found",
                409 => "Conflict",
                500 => "Internal Server Error",
                _ => "Error"
            };
        }
    }
}
