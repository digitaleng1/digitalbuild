using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBidRequestToOneToOneRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BidRequests_Specialists_SpecialistId",
                table: "BidRequests");

            migrationBuilder.DropIndex(
                name: "IX_BidResponses_BidRequestId",
                table: "BidResponses");

            migrationBuilder.DropIndex(
                name: "IX_BidResponses_BidRequestId_SpecialistId",
                table: "BidResponses");

            migrationBuilder.DropColumn(
                name: "BudgetMax",
                table: "BidRequests");

            migrationBuilder.DropColumn(
                name: "BudgetMin",
                table: "BidRequests");

            migrationBuilder.AddColumn<decimal>(
                name: "ProposedBudget",
                table: "BidRequests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_BidResponses_BidRequestId",
                table: "BidResponses",
                column: "BidRequestId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BidRequests_Specialists_SpecialistId",
                table: "BidRequests",
                column: "SpecialistId",
                principalTable: "Specialists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BidRequests_Specialists_SpecialistId",
                table: "BidRequests");

            migrationBuilder.DropIndex(
                name: "IX_BidResponses_BidRequestId",
                table: "BidResponses");

            migrationBuilder.DropColumn(
                name: "ProposedBudget",
                table: "BidRequests");

            migrationBuilder.AddColumn<decimal>(
                name: "BudgetMax",
                table: "BidRequests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BudgetMin",
                table: "BidRequests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BidResponses_BidRequestId",
                table: "BidResponses",
                column: "BidRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_BidResponses_BidRequestId_SpecialistId",
                table: "BidResponses",
                columns: new[] { "BidRequestId", "SpecialistId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BidRequests_Specialists_SpecialistId",
                table: "BidRequests",
                column: "SpecialistId",
                principalTable: "Specialists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
