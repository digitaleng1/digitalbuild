using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminMarkupToBidResponse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminComment",
                table: "BidResponses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AdminMarkupPercentage",
                table: "BidResponses",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminComment",
                table: "BidResponses");

            migrationBuilder.DropColumn(
                name: "AdminMarkupPercentage",
                table: "BidResponses");
        }
    }
}
