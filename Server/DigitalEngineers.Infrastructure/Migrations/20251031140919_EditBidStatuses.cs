using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EditBidStatuses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "BidResponses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "BidResponses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
