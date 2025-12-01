using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using DigitalEngineers.Infrastructure.Configuration;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigController : ControllerBase
{
    private readonly FirebaseSettings _firebaseSettings;

    public ConfigController(IOptions<FirebaseSettings> firebaseSettings)
    {
        _firebaseSettings = firebaseSettings.Value;
    }

    /// <summary>
    /// Get Firebase client configuration
    /// </summary>
    [HttpGet("firebase")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public IActionResult GetFirebaseConfig()
    {
        var config = new
        {
            apiKey = _firebaseSettings.ApiKey,
            authDomain = _firebaseSettings.AuthDomain,
            projectId = _firebaseSettings.ProjectId,
            storageBucket = _firebaseSettings.StorageBucket,
            messagingSenderId = _firebaseSettings.MessagingSenderId,
            appId = _firebaseSettings.AppId
        };

        return Ok(config);
    }
}
