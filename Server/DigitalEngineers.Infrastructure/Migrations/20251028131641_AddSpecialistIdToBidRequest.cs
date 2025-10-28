using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSpecialistIdToBidRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SpecialistId",
                table: "BidRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BidRequests_SpecialistId",
                table: "BidRequests",
                column: "SpecialistId");

            migrationBuilder.AddForeignKey(
                name: "FK_BidRequests_Specialists_SpecialistId",
                table: "BidRequests",
                column: "SpecialistId",
                principalTable: "Specialists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BidRequests_Specialists_SpecialistId",
                table: "BidRequests");

            migrationBuilder.DropIndex(
                name: "IX_BidRequests_SpecialistId",
                table: "BidRequests");

            migrationBuilder.DropColumn(
                name: "SpecialistId",
                table: "BidRequests");
        }
    }
}
