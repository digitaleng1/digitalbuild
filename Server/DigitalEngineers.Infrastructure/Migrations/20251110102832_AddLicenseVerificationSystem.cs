using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLicenseVerificationSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_ClientId",
                table: "Reviews");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpirationDate",
                table: "SpecialistLicenseTypes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "SpecialistLicenseTypes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "IssueDate",
                table: "SpecialistLicenseTypes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IssuingAuthority",
                table: "SpecialistLicenseTypes",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LicenseFileUrl",
                table: "SpecialistLicenseTypes",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LicenseNumber",
                table: "SpecialistLicenseTypes",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LicenseRequestId",
                table: "SpecialistLicenseTypes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "SpecialistLicenseTypes",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "VerifiedAt",
                table: "SpecialistLicenseTypes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VerifiedBy",
                table: "SpecialistLicenseTypes",
                type: "character varying(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Comment",
                table: "Reviews",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AlterColumn<string>(
                name: "ClientId",
                table: "Reviews",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(450)",
                oldMaxLength: 450);

            migrationBuilder.CreateTable(
                name: "SpecialistLicenseRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SpecialistId = table.Column<int>(type: "integer", nullable: false),
                    LicenseTypeId = table.Column<int>(type: "integer", nullable: false),
                    State = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IssuingAuthority = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    IssueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LicenseNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LicenseFileUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AdminComment = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ReviewedBy = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                name: "FK_Reviews_Users_ClientId",
                table: "Reviews",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialistLicenseTypes_SpecialistLicenseRequests_LicenseReq~",
                table: "SpecialistLicenseTypes",
                column: "LicenseRequestId",
                principalTable: "SpecialistLicenseRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_ClientId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_SpecialistLicenseTypes_SpecialistLicenseRequests_LicenseReq~",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropTable(
                name: "SpecialistLicenseRequests");

            migrationBuilder.DropIndex(
                name: "IX_SpecialistLicenseTypes_LicenseRequestId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "ExpirationDate",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "IssueDate",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "IssuingAuthority",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "LicenseFileUrl",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "LicenseNumber",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "LicenseRequestId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "State",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "VerifiedAt",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "VerifiedBy",
                table: "SpecialistLicenseTypes");

            migrationBuilder.AlterColumn<string>(
                name: "Comment",
                table: "Reviews",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ClientId",
                table: "Reviews",
                type: "character varying(450)",
                maxLength: 450,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Users_ClientId",
                table: "Reviews",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
