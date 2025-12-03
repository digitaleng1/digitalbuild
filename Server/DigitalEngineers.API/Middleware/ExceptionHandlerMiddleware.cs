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
                // Skip error handling for Swagger paths
                if (context.Request.Path.StartsWithSegments("/swagger"))
                {
                    throw;
                }

                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            ErrorResponse errorResponse;

            var statusCode = exception switch
            {
                // 404 - Not Found
                ProjectNotFoundException => StatusCodes.Status404NotFound,
                SpecialistNotFoundException => StatusCodes.Status404NotFound,
                PortfolioItemNotFoundException => StatusCodes.Status404NotFound,
                BidRequestNotFoundException => StatusCodes.Status404NotFound,
                BidResponseNotFoundException => StatusCodes.Status404NotFound,
                InvitationNotFoundException => StatusCodes.Status404NotFound,

                // 403 - Forbidden (Email not confirmed)
                EmailNotConfirmedException => StatusCodes.Status403Forbidden,

                // 400 - Bad Request
                EmailConfirmationFailedException => StatusCodes.Status400BadRequest,
                InvalidProjectStatusException => StatusCodes.Status400BadRequest,
                InvalidBidStatusException => StatusCodes.Status400BadRequest,
                InvalidProjectStatusForQuoteException => StatusCodes.Status400BadRequest,
                InvitationExpiredException => StatusCodes.Status400BadRequest,
                InvitationAlreadyUsedException => StatusCodes.Status400BadRequest,
                ArgumentException => StatusCodes.Status400BadRequest,

                // 401 - Unauthorized
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                UnauthorizedBidAccessException => StatusCodes.Status401Unauthorized,

                // 409 - Conflict
                SpecialistAlreadyAssignedException => StatusCodes.Status409Conflict,
                QuoteAlreadySubmittedException => StatusCodes.Status409Conflict,
                BidRequestAlreadyExistsException => StatusCodes.Status409Conflict,
                UserAlreadyExistsException => StatusCodes.Status409Conflict,

                // 500 - Internal Server Error
                _ => StatusCodes.Status500InternalServerError
            };

            context.Response.StatusCode = statusCode;

            errorResponse = new ErrorResponse(
                exception.Message, 
                statusCode
            )
            {
                TraceId = context.TraceIdentifier
            };

            context.Response.ContentType = "application/json";
            var json = JsonConvert.SerializeObject(errorResponse, new JsonSerializerSettings
            {
                ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
            });
            await context.Response.WriteAsync(json);
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
