using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Seeders;

public class SeededUsers
{
    public List<ApplicationUser> Admins { get; }
    public List<ApplicationUser> Providers { get; }
    public List<ApplicationUser> Clients { get; }

    public SeededUsers(List<ApplicationUser> admins, List<ApplicationUser> providers, List<ApplicationUser> clients)
    {
        Admins = admins;
        Providers = providers;
        Clients = clients;
    }
}
