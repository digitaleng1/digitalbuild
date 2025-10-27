using Newtonsoft.Json;
using DigitalEngineers.API.ViewModels;
using DigitalEngineers.Domain.Exceptions;

namespace DigitalEngineers.API.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;

        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            ErrorResponse errorResponse;

            context.Response.StatusCode = exception switch
            {
                // 404 - Not Found
                ProjectNotFoundException => StatusCodes.Status404NotFound,

                // 400 - Bad Request (валидация)
                InvalidProjectStatusException => StatusCodes.Status400BadRequest,
                ArgumentException => StatusCodes.Status400BadRequest,

                // 401 - Unauthorized
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,

                // 500 - Internal Server Error (все остальное)
                _ => StatusCodes.Status500InternalServerError
            };

            errorResponse = exception switch
            {
                ProjectNotFoundException ex => new ErrorResponse(ex.Message),
                InvalidProjectStatusException ex => new ErrorResponse(ex.Message),
                ArgumentException ex => new ErrorResponse(ex.Message),
                UnauthorizedAccessException => new ErrorResponse("Unauthorized access"),
                _ => new ErrorResponse("An unexpected error occurred. Please try again later.")
            };

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
        }
    }

    public static class ExceptionHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionHandlerMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionHandlerMiddleware>();
            return app;
        }
    }
}
