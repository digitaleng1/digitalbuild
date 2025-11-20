namespace DigitalEngineers.Domain.Enums;

public class UserRoles
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Admin = "Admin";
    public const string Client = "Client";
    public const string Provider = "Provider";
    private readonly static string[] Array = new[] { SuperAdmin, Admin, Client, Provider };

    public static string[] ToArray() {
        return Array;
    }
}
