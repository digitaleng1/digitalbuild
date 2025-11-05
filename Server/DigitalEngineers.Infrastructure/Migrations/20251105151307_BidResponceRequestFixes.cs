using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class BidResponceRequestFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BidMessages_BidResponses_BidResponseId",
                table: "BidMessages");

            migrationBuilder.RenameColumn(
                name: "BidResponseId",
                table: "BidMessages",
                newName: "BidRequestId");

            migrationBuilder.RenameIndex(
                name: "IX_BidMessages_BidResponseId",
                table: "BidMessages",
                newName: "IX_BidMessages_BidRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_BidMessages_BidRequests_BidRequestId",
                table: "BidMessages",
                column: "BidRequestId",
                principalTable: "BidRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BidMessages_BidRequests_BidRequestId",
                table: "BidMessages");

            migrationBuilder.RenameColumn(
                name: "BidRequestId",
                table: "BidMessages",
                newName: "BidResponseId");

            migrationBuilder.RenameIndex(
                name: "IX_BidMessages_BidRequestId",
                table: "BidMessages",
                newName: "IX_BidMessages_BidResponseId");

            migrationBuilder.AddForeignKey(
                name: "FK_BidMessages_BidResponses_BidResponseId",
                table: "BidMessages",
                column: "BidResponseId",
                principalTable: "BidResponses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
