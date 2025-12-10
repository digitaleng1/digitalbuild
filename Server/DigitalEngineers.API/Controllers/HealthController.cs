using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace DigitalEngineers.API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/health")]
    [Produces("application/json")]
    public sealed class HealthController : ControllerBase
    {
        public HealthController()
        {
        }

        /// <summary>
        /// Retrieve health data of the application services
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <response code="200">OK - Requested resource is in the content.</response>
        /// <returns></returns>
        [HttpGet]
        [Tags("Health and Status")]
        public async Task<IActionResult> CheckHealthAsync(CancellationToken cancellationToken)
        {
            return Ok(new { message = "Ok" });
        }
    }
}