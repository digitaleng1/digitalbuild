using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSpecialistLicenseRequestEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialistLicenseTypes_SpecialistLicenseRequests_LicenseReq~",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropTable(
                name: "SpecialistLicenseRequests");

            migrationBuilder.DropIndex(
                name: "IX_SpecialistLicenseTypes_LicenseRequestId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "LicenseRequestId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.AddColumn<string>(
                name: "AdminComment",
                table: "SpecialistLicenseTypes",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "SpecialistLicenseTypes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedAt",
                table: "SpecialistLicenseTypes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "SpecialistLicenseTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "SpecialistLicenseTypes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistLicenseTypes_Status",
                table: "SpecialistLicenseTypes",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SpecialistLicenseTypes_Status",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "AdminComment",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "ReviewedAt",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "SpecialistLicenseTypes");

            migrationBuilder.AddColumn<int>(
                name: "LicenseRequestId",
                table: "SpecialistLicenseTypes",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SpecialistLicenseRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LicenseTypeId = table.Column<int>(type: "integer", nullable: false),
                    SpecialistId = table.Column<int>(type: "integer", nullable: false),
                    AdminComment = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IssueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IssuingAuthority = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    LicenseFileUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    LicenseNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReviewedBy = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: true),
                    State = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialistLicenseRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpecialistLicenseRequests_LicenseTypes_LicenseTypeId",
                        column: x => x.LicenseTypeId,
                        principalTable: "LicenseTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SpecialistLicenseRequests_Specialists_SpecialistId",
                        column: x => x.SpecialistId,
                        principalTable: "Specialists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistLicenseTypes_LicenseRequestId",
                table: "SpecialistLicenseTypes",
                column: "LicenseRequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistLicenseRequests_LicenseTypeId",
                table: "SpecialistLicenseRequests",
                column: "LicenseTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistLicenseRequests_SpecialistId",
                table: "SpecialistLicenseRequests",
                column: "SpecialistId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistLicenseRequests_Status",
                table: "SpecialistLicenseRequests",
                column: "Status");

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialistLicenseTypes_SpecialistLicenseRequests_LicenseReq~",
                table: "SpecialistLicenseTypes",
                column: "LicenseRequestId",
                principalTable: "SpecialistLicenseRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
