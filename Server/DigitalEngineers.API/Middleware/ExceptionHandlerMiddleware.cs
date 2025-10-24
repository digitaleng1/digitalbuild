using Newtonsoft.Json;
using DigitalEngineers.API.ViewModels;

namespace DigitalEngineers.API.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            ErrorResponse errorResponse;
            switch (exception)
            {
                case UnauthorizedAccessException:
                    errorResponse = new ErrorResponse(exception.Message);
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    break;
                default:
                    errorResponse = new ErrorResponse("Oops! Something went wrong!");
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    break;
            }
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
