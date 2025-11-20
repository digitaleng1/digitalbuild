using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class BidSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context,
        List<Project> projects,
        List<Specialist> specialists,
        string[] clientIds,
        ILogger logger)
    {
        if (await context.BidRequests.AnyAsync())
        {
            return;
        }

        if (projects.Count == 0)
        {
            logger.LogError("No projects found. Cannot seed bids.");
            return;
        }

        if (specialists.Count == 0)
        {
            logger.LogError("No specialists found. Cannot seed bids.");
            return;
        }

        var bidRequests = new List<BidRequest>();
        var bidResponses = new List<BidResponse>();
        var projectSpecialists = new List<ProjectSpecialist>();
        var bidMessages = new List<BidMessage>();

        SeedProject1Bids(bidRequests, projects[0], specialists, clientIds);
        SeedProject2Bids(bidRequests, bidResponses, projectSpecialists, bidMessages, projects[1], specialists, clientIds);
        SeedProject3Bids(bidRequests, bidResponses, projectSpecialists, bidMessages, projects[2], specialists, clientIds);
        SeedProject4Bids(bidRequests, bidResponses, projectSpecialists, bidMessages, projects[3], specialists, clientIds);
        SeedProject5Bids(bidRequests, bidResponses, projectSpecialists, bidMessages, projects[4], specialists, clientIds);
        SeedProject6Bids(bidRequests, projects[5], specialists, clientIds);
        SeedProject7Bids(bidRequests, bidResponses, projectSpecialists, bidMessages, projects[6], specialists, clientIds);
        SeedProject8Bids(bidRequests, bidResponses, projectSpecialists, bidMessages, projects[7], specialists, clientIds);
        SeedProject9Bids(bidRequests, bidResponses, projectSpecialists, bidMessages, projects[8], specialists, clientIds);

        await context.BidRequests.AddRangeAsync(bidRequests);
        await context.SaveChangesAsync();

        await context.BidResponses.AddRangeAsync(bidResponses);
        await context.SaveChangesAsync();

        await context.ProjectSpecialists.AddRangeAsync(projectSpecialists);
        await context.SaveChangesAsync();

        await context.BidMessages.AddRangeAsync(bidMessages);
        await context.SaveChangesAsync();
    }

    private static void SeedProject1Bids(
        List<BidRequest> bidRequests,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        AddBidRequest(bidRequests, project.Id, specialists[0].Id, "Foundation Repair Bid", "Comprehensive foundation assessment and repair proposal", 25000m, project.CreatedAt.AddDays(1));
        AddBidRequest(bidRequests, project.Id, specialists[1].Id, "Structural Engineering Services", "Foundation inspection and repair engineering services", 22000m, project.CreatedAt.AddDays(2));
        AddBidRequest(bidRequests, project.Id, specialists[2].Id, "Foundation Repair Quote", "Professional foundation repair services with warranty", 28000m, project.CreatedAt.AddDays(1));
    }

    private static void SeedProject2Bids(
        List<BidRequest> bidRequests,
        List<BidResponse> bidResponses,
        List<ProjectSpecialist> projectSpecialists,
        List<BidMessage> bidMessages,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        var bid2_1 = AddBidRequest(bidRequests, project.Id, specialists[3].Id, "HVAC System Design", "Complete HVAC system design and installation", 185000m, project.CreatedAt.AddDays(3), BidRequestStatus.Accepted);
        var bid2_2 = AddBidRequest(bidRequests, project.Id, specialists[4].Id, "Electrical Integration", "HVAC electrical systems integration", 45000m, project.CreatedAt.AddDays(4), BidRequestStatus.Accepted);
        var bid2_3 = AddBidRequest(bidRequests, project.Id, specialists[5].Id, "Energy Audit Services", "Building energy efficiency analysis", 15000m, project.CreatedAt.AddDays(5), BidRequestStatus.Responded);
        AddBidRequest(bidRequests, project.Id, specialists[6].Id, "HVAC Installation Bid", "Alternative HVAC solution proposal", 195000m, project.CreatedAt.AddDays(3));
        AddBidRequest(bidRequests, project.Id, specialists[7].Id, "Climate Control Systems", "Smart climate control implementation", 52000m, project.CreatedAt.AddDays(6));

        var response2_1 = AddBidResponse(bidResponses, bid2_1, specialists[3].Id, "Experienced HVAC engineer with 15 years in commercial buildings. Proven track record with energy-efficient systems.", 185000m, 120, bid2_1.CreatedAt.AddDays(2));
        var response2_2 = AddBidResponse(bidResponses, bid2_2, specialists[4].Id, "Electrical systems specialist. Will ensure seamless integration with building infrastructure.", 45000m, 45, bid2_2.CreatedAt.AddDays(1));
        AddBidResponse(bidResponses, bid2_3, specialists[5].Id, "Certified energy auditor. Will provide detailed efficiency recommendations.", 15000m, 15, bid2_3.CreatedAt.AddDays(1));

        response2_1.AdminMarkupPercentage = 15m;
        response2_1.AdminComment = "Approved - excellent track record";
        response2_2.AdminMarkupPercentage = 12m;
        response2_2.AdminComment = "Approved - competitive pricing";

        AddProjectSpecialist(projectSpecialists, project.Id, specialists[3].Id, project.CreatedAt.AddDays(10), "Lead HVAC Engineer");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[4].Id, project.CreatedAt.AddDays(10), "Electrical Integration Specialist");

        AddBidMessage(bidMessages, bid2_1, clientIds[1], "When can you start the installation phase?", response2_1.CreatedAt.AddDays(1));
        AddBidMessage(bidMessages, bid2_1, specialists[3].UserId, "We can begin installation in 2 weeks after final approval.", response2_1.CreatedAt.AddDays(1).AddHours(3));
        AddBidMessage(bidMessages, bid2_1, clientIds[1], "Perfect. Please provide the equipment list.", response2_1.CreatedAt.AddDays(2));
        AddBidMessage(bidMessages, bid2_1, specialists[3].UserId, "Equipment list sent via email. All units are energy star rated.", response2_1.CreatedAt.AddDays(2).AddHours(4));

        AddBidMessage(bidMessages, bid2_2, clientIds[1], "Will this include emergency backup power?", response2_2.CreatedAt.AddHours(5));
        AddBidMessage(bidMessages, bid2_2, specialists[4].UserId, "Yes, backup generator integration is included in the scope.", response2_2.CreatedAt.AddHours(6));
        AddBidMessage(bidMessages, bid2_2, clientIds[1], "Excellent. Please coordinate with the HVAC team.", response2_2.CreatedAt.AddDays(1));
        AddBidMessage(bidMessages, bid2_2, specialists[4].UserId, "Already in contact. We have a joint timeline.", response2_2.CreatedAt.AddDays(1).AddHours(2));
    }

    private static void SeedProject3Bids(
        List<BidRequest> bidRequests,
        List<BidResponse> bidResponses,
        List<ProjectSpecialist> projectSpecialists,
        List<BidMessage> bidMessages,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        var bid3_1 = AddBidRequest(bidRequests, project.Id, specialists[0].Id, "High Voltage Systems", "Industrial electrical infrastructure upgrade", 320000m, project.CreatedAt.AddDays(5), BidRequestStatus.Accepted);
        var bid3_2 = AddBidRequest(bidRequests, project.Id, specialists[1].Id, "Power Distribution Design", "Electrical distribution system engineering", 85000m, project.CreatedAt.AddDays(6), BidRequestStatus.Accepted);
        var bid3_3 = AddBidRequest(bidRequests, project.Id, specialists[2].Id, "Backup Generator Systems", "Emergency power systems installation", 95000m, project.CreatedAt.AddDays(7), BidRequestStatus.Accepted);
        var bid3_4 = AddBidRequest(bidRequests, project.Id, specialists[8].Id, "Safety Systems Integration", "Industrial safety and monitoring systems", 45000m, project.CreatedAt.AddDays(8), BidRequestStatus.Responded);

        var response3_1 = AddBidResponse(bidResponses, bid3_1, specialists[0].Id, "20+ years in industrial electrical systems. Licensed for high-voltage work.", 320000m, 180, bid3_1.CreatedAt.AddDays(2));
        var response3_2 = AddBidResponse(bidResponses, bid3_2, specialists[1].Id, "Expert in power distribution for manufacturing facilities.", 85000m, 60, bid3_2.CreatedAt.AddDays(1));
        var response3_3 = AddBidResponse(bidResponses, bid3_3, specialists[2].Id, "Specialized in industrial backup power solutions.", 95000m, 45, bid3_3.CreatedAt.AddDays(1));
        AddBidResponse(bidResponses, bid3_4, specialists[8].Id, "Comprehensive safety system design and implementation.", 45000m, 30, bid3_4.CreatedAt.AddDays(1));

        response3_1.AdminMarkupPercentage = 10m;
        response3_1.AdminComment = "Approved - highly qualified specialist";
        response3_2.AdminMarkupPercentage = 12m;
        response3_2.AdminComment = "Approved - good pricing";
        response3_3.AdminMarkupPercentage = 13m;
        response3_3.AdminComment = "Approved - specialized expertise";

        AddProjectSpecialist(projectSpecialists, project.Id, specialists[0].Id, project.CreatedAt.AddDays(12), "Lead Electrical Engineer");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[1].Id, project.CreatedAt.AddDays(12), "Power Systems Engineer");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[2].Id, project.CreatedAt.AddDays(15), "Backup Power Specialist");

        AddBidMessage(bidMessages, bid3_1, clientIds[2], "Project timeline looks good. Safety certifications in order?", response3_1.CreatedAt.AddDays(1));
        AddBidMessage(bidMessages, bid3_1, specialists[0].UserId, "All certifications current. OSHA compliant procedures in place.", response3_1.CreatedAt.AddDays(1).AddHours(4));
        AddBidMessage(bidMessages, bid3_2, clientIds[2], "Can you coordinate with the main electrical contractor?", response3_2.CreatedAt.AddHours(8));
        AddBidMessage(bidMessages, bid3_2, specialists[1].UserId, "Yes, I'll schedule a coordination meeting next week.", response3_2.CreatedAt.AddHours(10));
        AddBidMessage(bidMessages, bid3_3, clientIds[2], "Backup power capacity sufficient for full factory operation?", response3_3.CreatedAt.AddDays(1));
        AddBidMessage(bidMessages, bid3_3, specialists[2].UserId, "Yes, designed for 100% load capacity with redundancy.", response3_3.CreatedAt.AddDays(1).AddHours(5));
    }

    private static void SeedProject4Bids(
        List<BidRequest> bidRequests,
        List<BidResponse> bidResponses,
        List<ProjectSpecialist> projectSpecialists,
        List<BidMessage> bidMessages,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        var bid4_1 = AddBidRequest(bidRequests, project.Id, specialists[3].Id, "Plumbing System Design", "Complete plumbing renovation engineering", 125000m, project.CreatedAt.AddDays(2), BidRequestStatus.Accepted);
        var bid4_2 = AddBidRequest(bidRequests, project.Id, specialists[4].Id, "Water Efficiency Consulting", "Water conservation system design", 18000m, project.CreatedAt.AddDays(3), BidRequestStatus.Accepted);
        var bid4_3 = AddBidRequest(bidRequests, project.Id, specialists[5].Id, "Fixture Installation Services", "Modern fixture installation and testing", 32000m, project.CreatedAt.AddDays(3), BidRequestStatus.Responded);
        var bid4_4 = AddBidRequest(bidRequests, project.Id, specialists[6].Id, "Pipe Replacement Bid", "Alternative piping solution", 135000m, project.CreatedAt.AddDays(4), BidRequestStatus.Responded);
        var bid4_5 = AddBidRequest(bidRequests, project.Id, specialists[7].Id, "Plumbing Inspection", "Pre and post installation inspection services", 8000m, project.CreatedAt.AddDays(5), BidRequestStatus.Responded);
        AddBidRequest(bidRequests, project.Id, specialists[8].Id, "Water Quality Testing", "Water quality analysis and treatment", 12000m, project.CreatedAt.AddDays(5));

        var response4_1 = AddBidResponse(bidResponses, bid4_1, specialists[3].Id, "Licensed plumbing engineer with 12 years in multi-unit residential projects.", 125000m, 75, bid4_1.CreatedAt.AddDays(1));
        var response4_2 = AddBidResponse(bidResponses, bid4_2, specialists[4].Id, "LEED certified professional. Water efficiency specialist.", 18000m, 20, bid4_2.CreatedAt.AddDays(1));
        var response4_3 = AddBidResponse(bidResponses, bid4_3, specialists[5].Id, "Experienced with modern low-flow fixtures and smart water systems.", 32000m, 30, bid4_3.CreatedAt.AddDays(1));
        var response4_4 = AddBidResponse(bidResponses, bid4_4, specialists[6].Id, "Alternative PEX piping solution with longer warranty.", 135000m, 80, bid4_4.CreatedAt.AddDays(1));
        var response4_5 = AddBidResponse(bidResponses, bid4_5, specialists[7].Id, "Certified plumbing inspector. Thorough documentation provided.", 8000m, 10, bid4_5.CreatedAt.AddDays(1));

        response4_1.AdminMarkupPercentage = 11m;
        response4_1.AdminComment = "Approved - project completed successfully";
        response4_2.AdminMarkupPercentage = 14m;
        response4_2.AdminComment = "Approved - sustainability focus";

        AddProjectSpecialist(projectSpecialists, project.Id, specialists[3].Id, project.CreatedAt.AddDays(8), "Lead Plumbing Engineer");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[4].Id, project.CreatedAt.AddDays(8), "Water Efficiency Consultant");

        AddBidMessage(bidMessages, bid4_1, clientIds[0], "Project completed on time. Excellent work!", response4_1.CreatedAt.AddDays(70));
        AddBidMessage(bidMessages, bid4_1, specialists[3].UserId, "Thank you! All systems tested and certified.", response4_1.CreatedAt.AddDays(70).AddHours(2));
        AddBidMessage(bidMessages, bid4_2, clientIds[0], "Water bill reduced by 30%. Very satisfied.", response4_2.CreatedAt.AddDays(71));
        AddBidMessage(bidMessages, bid4_2, specialists[4].UserId, "Great to hear! The new fixtures are performing excellently.", response4_2.CreatedAt.AddDays(71).AddHours(3));
        AddBidMessage(bidMessages, bid4_3, clientIds[0], "Fixtures working perfectly. Thank you!", response4_3.CreatedAt.AddDays(72));
        AddBidMessage(bidMessages, bid4_3, specialists[5].UserId, "You're welcome! Glad everything is working well.", response4_3.CreatedAt.AddDays(72).AddHours(2));
        AddBidMessage(bidMessages, bid4_4, clientIds[0], "PEX piping quality is excellent.", response4_4.CreatedAt.AddDays(73));
        AddBidMessage(bidMessages, bid4_4, specialists[6].UserId, "25-year warranty on all piping. Built to last.", response4_4.CreatedAt.AddDays(73).AddHours(4));
        AddBidMessage(bidMessages, bid4_5, clientIds[0], "Inspection report very detailed. Appreciated.", response4_5.CreatedAt.AddDays(74));
        AddBidMessage(bidMessages, bid4_5, specialists[7].UserId, "Thorough documentation is our standard. Happy to help.", response4_5.CreatedAt.AddDays(74).AddHours(3));
    }

    private static void SeedProject5Bids(
        List<BidRequest> bidRequests,
        List<BidResponse> bidResponses,
        List<ProjectSpecialist> projectSpecialists,
        List<BidMessage> bidMessages,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        var bid5_1 = AddBidRequest(bidRequests, project.Id, specialists[0].Id, "Fire Sprinkler System", "Complete sprinkler system design and installation", 210000m, project.CreatedAt.AddDays(3), BidRequestStatus.Accepted);
        var bid5_2 = AddBidRequest(bidRequests, project.Id, specialists[1].Id, "Fire Alarm Systems", "Fire detection and alarm system integration", 85000m, project.CreatedAt.AddDays(4), BidRequestStatus.Accepted);
        var bid5_3 = AddBidRequest(bidRequests, project.Id, specialists[2].Id, "Emergency Systems", "Emergency lighting and exit systems", 42000m, project.CreatedAt.AddDays(5), BidRequestStatus.Accepted);

        var response5_1 = AddBidResponse(bidResponses, bid5_1, specialists[0].Id, "NFPA certified fire protection engineer. 18 years experience.", 210000m, 150, bid5_1.CreatedAt.AddDays(2));
        var response5_2 = AddBidResponse(bidResponses, bid5_2, specialists[1].Id, "Advanced fire alarm systems specialist. Addressable systems expert.", 85000m, 60, bid5_2.CreatedAt.AddDays(1));
        var response5_3 = AddBidResponse(bidResponses, bid5_3, specialists[2].Id, "Emergency systems designer. Code compliant solutions.", 42000m, 45, bid5_3.CreatedAt.AddDays(1));

        response5_1.AdminMarkupPercentage = 10m;
        response5_1.AdminComment = "Approved - fire safety critical";
        response5_2.AdminMarkupPercentage = 12m;
        response5_2.AdminComment = "Approved - modern system design";
        response5_3.AdminMarkupPercentage = 13m;
        response5_3.AdminComment = "Approved";

        AddProjectSpecialist(projectSpecialists, project.Id, specialists[0].Id, project.CreatedAt.AddDays(10), "Fire Protection Engineer");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[1].Id, project.CreatedAt.AddDays(10), "Fire Alarm Specialist");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[2].Id, project.CreatedAt.AddDays(12), "Emergency Systems Engineer");

        AddBidMessage(bidMessages, bid5_1, clientIds[1], "Fire marshal inspection scheduled for next month.", response5_1.CreatedAt.AddDays(5));
        AddBidMessage(bidMessages, bid5_1, specialists[0].UserId, "Perfect timing. System will be fully commissioned by then.", response5_1.CreatedAt.AddDays(5).AddHours(3));
        AddBidMessage(bidMessages, bid5_2, clientIds[1], "Alarm panel location approved by building management?", response5_2.CreatedAt.AddDays(3));
        AddBidMessage(bidMessages, bid5_2, specialists[1].UserId, "Yes, main panel in security office as discussed.", response5_2.CreatedAt.AddDays(3).AddHours(5));
        AddBidMessage(bidMessages, bid5_3, clientIds[1], "Emergency lighting test completed successfully.", response5_3.CreatedAt.AddDays(20));
    }

    private static void SeedProject6Bids(
        List<BidRequest> bidRequests,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        AddBidRequest(bidRequests, project.Id, specialists[3].Id, "Structural Assessment", "Comprehensive structural integrity evaluation", 45000m, project.CreatedAt.AddDays(2));
        AddBidRequest(bidRequests, project.Id, specialists[4].Id, "Reinforcement Engineering", "Structural reinforcement design services", 38000m, project.CreatedAt.AddDays(3));
    }

    private static void SeedProject7Bids(
        List<BidRequest> bidRequests,
        List<BidResponse> bidResponses,
        List<ProjectSpecialist> projectSpecialists,
        List<BidMessage> bidMessages,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        var bid7_1 = AddBidRequest(bidRequests, project.Id, specialists[5].Id, "Architectural Renovation", "Complete renovation architectural services", 95000m, project.CreatedAt.AddDays(4), BidRequestStatus.Rejected);
        var bid7_2 = AddBidRequest(bidRequests, project.Id, specialists[6].Id, "Structural Modifications", "Structural engineering for renovations", 65000m, project.CreatedAt.AddDays(5), BidRequestStatus.Withdrawn);
        AddBidRequest(bidRequests, project.Id, specialists[7].Id, "MEP Systems Upgrade", "Mechanical electrical plumbing upgrade", 85000m, project.CreatedAt.AddDays(6));
        AddBidRequest(bidRequests, project.Id, specialists[8].Id, "Interior Design Services", "Modern interior finishing consultation", 42000m, project.CreatedAt.AddDays(6));

        var response7_1 = AddBidResponse(bidResponses, bid7_1, specialists[5].Id, "Modern design approach with historical preservation elements.", 95000m, 90, bid7_1.CreatedAt.AddDays(2));
        response7_1.RejectionReason = "Project cancelled due to budget constraints";

        AddBidResponse(bidResponses, bid7_2, specialists[6].Id, "Structural engineering for safe renovations.", 65000m, 60, bid7_2.CreatedAt.AddDays(1));

        AddProjectSpecialist(projectSpecialists, project.Id, specialists[5].Id, project.CreatedAt.AddDays(12), "Renovation Architect");

        AddBidMessage(bidMessages, bid7_1, clientIds[0], "Budget exceeded. Need to pause project.", response7_1.CreatedAt.AddDays(20));
        AddBidMessage(bidMessages, bid7_1, specialists[5].UserId, "Understood. Let me know if you want to revisit with reduced scope.", response7_1.CreatedAt.AddDays(20).AddHours(4));
        AddBidMessage(bidMessages, bid7_1, clientIds[0], "Will contact you next quarter after refinancing.", response7_1.CreatedAt.AddDays(21));
        AddBidMessage(bidMessages, bid7_1, specialists[5].UserId, "Sounds good. I'll keep the designs on file.", response7_1.CreatedAt.AddDays(21).AddHours(2));
    }

    private static void SeedProject8Bids(
        List<BidRequest> bidRequests,
        List<BidResponse> bidResponses,
        List<ProjectSpecialist> projectSpecialists,
        List<BidMessage> bidMessages,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        var bid8_1 = AddBidRequest(bidRequests, project.Id, specialists[0].Id, "Medical HVAC Systems", "Hospital-grade HVAC with isolation capabilities", 425000m, project.CreatedAt.AddDays(5), BidRequestStatus.Accepted);
        var bid8_2 = AddBidRequest(bidRequests, project.Id, specialists[1].Id, "Medical Electrical", "Medical facility electrical infrastructure", 185000m, project.CreatedAt.AddDays(6), BidRequestStatus.Accepted);
        var bid8_3 = AddBidRequest(bidRequests, project.Id, specialists[2].Id, "Building Automation", "Advanced BMS for medical facility", 95000m, project.CreatedAt.AddDays(7), BidRequestStatus.Accepted);
        var bid8_4 = AddBidRequest(bidRequests, project.Id, specialists[3].Id, "Air Filtration Systems", "HEPA filtration for isolation rooms", 125000m, project.CreatedAt.AddDays(8), BidRequestStatus.Responded);
        AddBidRequest(bidRequests, project.Id, specialists[4].Id, "Emergency Power Backup", "Hospital emergency power systems", 215000m, project.CreatedAt.AddDays(9));

        var response8_1 = AddBidResponse(bidResponses, bid8_1, specialists[0].Id, "Medical facility HVAC specialist. Isolation room expert with 20+ years.", 425000m, 200, bid8_1.CreatedAt.AddDays(2));
        var response8_2 = AddBidResponse(bidResponses, bid8_2, specialists[1].Id, "Hospital electrical systems engineer. Critical power specialist.", 185000m, 180, bid8_2.CreatedAt.AddDays(2));
        var response8_3 = AddBidResponse(bidResponses, bid8_3, specialists[2].Id, "Medical BMS expert. Patient comfort and safety priority.", 95000m, 90, bid8_3.CreatedAt.AddDays(1));
        AddBidResponse(bidResponses, bid8_4, specialists[3].Id, "HEPA filtration specialist. Negative pressure room experience.", 125000m, 60, bid8_3.CreatedAt.AddDays(1));

        response8_1.AdminMarkupPercentage = 8m;
        response8_1.AdminComment = "Approved - critical medical infrastructure";
        response8_2.AdminMarkupPercentage = 9m;
        response8_2.AdminComment = "Approved - hospital electrical expert";
        response8_3.AdminMarkupPercentage = 11m;
        response8_3.AdminComment = "Approved - BMS integration essential";

        AddProjectSpecialist(projectSpecialists, project.Id, specialists[0].Id, project.CreatedAt.AddDays(15), "Lead Medical HVAC Engineer");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[1].Id, project.CreatedAt.AddDays(15), "Hospital Electrical Engineer");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[2].Id, project.CreatedAt.AddDays(18), "Building Automation Specialist");

        AddBidMessage(bidMessages, bid8_1, clientIds[1], "Isolation rooms meet CDC guidelines?", response8_1.CreatedAt.AddDays(3));
        AddBidMessage(bidMessages, bid8_1, specialists[0].UserId, "Yes, full compliance with CDC and state health department standards.", response8_1.CreatedAt.AddDays(3).AddHours(2));
        AddBidMessage(bidMessages, bid8_2, clientIds[1], "Emergency power transfer time acceptable?", response8_2.CreatedAt.AddDays(4));
        AddBidMessage(bidMessages, bid8_2, specialists[1].UserId, "Less than 10 seconds. Critical circuits have UPS backup.", response8_2.CreatedAt.AddDays(4).AddHours(3));
        AddBidMessage(bidMessages, bid8_3, clientIds[1], "BMS integration with existing hospital systems?", response8_3.CreatedAt.AddDays(5));
        AddBidMessage(bidMessages, bid8_3, specialists[2].UserId, "Full integration planned. Compatible with your current system.", response8_3.CreatedAt.AddDays(5).AddHours(4));
        AddBidMessage(bidMessages, bid8_3, clientIds[1], "Perfect. Keep IT team in the loop.", response8_3.CreatedAt.AddDays(6));
    }

    private static void SeedProject9Bids(
        List<BidRequest> bidRequests,
        List<BidResponse> bidResponses,
        List<ProjectSpecialist> projectSpecialists,
        List<BidMessage> bidMessages,
        Project project,
        List<Specialist> specialists,
        string[] clientIds)
    {
        var bid9_1 = AddBidRequest(bidRequests, project.Id, specialists[5].Id, "Electrical Safety Audit", "Comprehensive electrical safety inspection", 65000m, project.CreatedAt.AddDays(3), BidRequestStatus.Accepted);
        var bid9_2 = AddBidRequest(bidRequests, project.Id, specialists[6].Id, "Environmental Compliance", "Environmental impact and compliance assessment", 48000m, project.CreatedAt.AddDays(4), BidRequestStatus.Accepted);
        var bid9_3 = AddBidRequest(bidRequests, project.Id, specialists[7].Id, "Structural Integrity", "Plant structural safety evaluation", 38000m, project.CreatedAt.AddDays(5), BidRequestStatus.Responded);

        var response9_1 = AddBidResponse(bidResponses, bid9_1, specialists[5].Id, "Licensed electrical inspector. Power plant experience.", 65000m, 45, bid9_1.CreatedAt.AddDays(1));
        var response9_2 = AddBidResponse(bidResponses, bid9_2, specialists[6].Id, "Environmental engineer. EPA compliance specialist.", 48000m, 40, bid9_2.CreatedAt.AddDays(1));
        AddBidResponse(bidResponses, bid9_3, specialists[7].Id, "Structural inspector with industrial facility experience.", 38000m, 30, bid9_3.CreatedAt.AddDays(1));

        response9_1.AdminMarkupPercentage = 10m;
        response9_1.AdminComment = "Approved - inspection completed successfully";
        response9_2.AdminMarkupPercentage = 12m;
        response9_2.AdminComment = "Approved - all compliance met";

        AddProjectSpecialist(projectSpecialists, project.Id, specialists[5].Id, project.CreatedAt.AddDays(10), "Electrical Safety Inspector");
        AddProjectSpecialist(projectSpecialists, project.Id, specialists[6].Id, project.CreatedAt.AddDays(10), "Environmental Compliance Engineer");

        AddBidMessage(bidMessages, bid9_1, clientIds[2], "All electrical systems passed inspection. Great work!", response9_1.CreatedAt.AddDays(40));
        AddBidMessage(bidMessages, bid9_1, specialists[5].UserId, "Thank you! Comprehensive report submitted to regulatory authorities.", response9_1.CreatedAt.AddDays(40).AddHours(3));
        AddBidMessage(bidMessages, bid9_2, clientIds[2], "Environmental certification received. Excellent job.", response9_2.CreatedAt.AddDays(38));
        AddBidMessage(bidMessages, bid9_2, specialists[6].UserId, "Glad to help. Plant is fully compliant for next 5 years.", response9_2.CreatedAt.AddDays(38).AddHours(4));
        AddBidMessage(bidMessages, bid9_2, clientIds[2], "Will recommend your services to other facilities.", response9_2.CreatedAt.AddDays(39));
        AddBidMessage(bidMessages, bid9_2, specialists[6].UserId, "Much appreciated! Always happy to help with compliance needs.", response9_2.CreatedAt.AddDays(39).AddHours(2));
    }

    private static BidRequest AddBidRequest(
        List<BidRequest> list,
        int projectId,
        int specialistId,
        string title,
        string description,
        decimal proposedBudget,
        DateTime createdAt,
        BidRequestStatus status = BidRequestStatus.Pending)
    {
        var bidRequest = new BidRequest
        {
            ProjectId = projectId,
            SpecialistId = specialistId,
            Title = title,
            Description = description,
            Status = status,
            ProposedBudget = proposedBudget,
            Deadline = createdAt.AddDays(30),
            CreatedAt = createdAt,
            UpdatedAt = DateTime.UtcNow
        };
        list.Add(bidRequest);
        return bidRequest;
    }

    private static BidResponse AddBidResponse(
        List<BidResponse> list,
        BidRequest bidRequest,
        int specialistId,
        string coverLetter,
        decimal proposedPrice,
        int estimatedDays,
        DateTime createdAt)
    {
        var response = new BidResponse
        {
            BidRequest = bidRequest,
            SpecialistId = specialistId,
            CoverLetter = coverLetter,
            ProposedPrice = proposedPrice,
            EstimatedDays = estimatedDays,
            CreatedAt = createdAt,
            UpdatedAt = DateTime.UtcNow
        };
        list.Add(response);
        return response;
    }

    private static void AddProjectSpecialist(
        List<ProjectSpecialist> list,
        int projectId,
        int specialistId,
        DateTime assignedAt,
        string? role = null)
    {
        list.Add(new ProjectSpecialist
        {
            ProjectId = projectId,
            SpecialistId = specialistId,
            AssignedAt = assignedAt,
            Role = role
        });
    }

    private static void AddBidMessage(
        List<BidMessage> list,
        BidRequest bidRequest,
        string senderId,
        string messageText,
        DateTime createdAt)
    {
        list.Add(new BidMessage
        {
            BidRequest = bidRequest,
            SenderId = senderId,
            MessageText = messageText,
            CreatedAt = createdAt
        });
    }
}
