using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessionTypeStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LicenseTypes_Professions_ProfessionId",
                table: "LicenseTypes");

            migrationBuilder.DropIndex(
                name: "IX_LicenseTypes_ProfessionId",
                table: "LicenseTypes");

            migrationBuilder.DropColumn(
                name: "ProfessionId",
                table: "LicenseTypes");

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Professions",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Professions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "LicenseTypes",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsStateSpecific",
                table: "LicenseTypes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ProfessionTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    ProfessionId = table.Column<int>(type: "integer", nullable: false),
                    RequiresStateLicense = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    IsApproved = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RejectionReason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessionTypes_Professions_ProfessionId",
                        column: x => x.ProfessionId,
                        principalTable: "Professions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessionTypes_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ProfessionTypeLicenseRequirements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProfessionTypeId = table.Column<int>(type: "integer", nullable: false),
                    LicenseTypeId = table.Column<int>(type: "integer", nullable: false),
                    IsRequired = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionTypeLicenseRequirements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessionTypeLicenseRequirements_LicenseTypes_LicenseTypeId",
                        column: x => x.LicenseTypeId,
                        principalTable: "LicenseTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessionTypeLicenseRequirements_ProfessionTypes_Professio~",
                        column: x => x.ProfessionTypeId,
                        principalTable: "ProfessionTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Professions_Code",
                table: "Professions",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicenseTypes_Code",
                table: "LicenseTypes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypeLicenseRequirements_LicenseTypeId",
                table: "ProfessionTypeLicenseRequirements",
                column: "LicenseTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypeLicenseRequirements_ProfessionTypeId",
                table: "ProfessionTypeLicenseRequirements",
                column: "ProfessionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypeLicenseRequirements_ProfessionTypeId_LicenseT~",
                table: "ProfessionTypeLicenseRequirements",
                columns: new[] { "ProfessionTypeId", "LicenseTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypes_Code",
                table: "ProfessionTypes",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypes_CreatedByUserId",
                table: "ProfessionTypes",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypes_IsActive",
                table: "ProfessionTypes",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypes_IsApproved",
                table: "ProfessionTypes",
                column: "IsApproved");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypes_Name",
                table: "ProfessionTypes",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypes_ProfessionId",
                table: "ProfessionTypes",
                column: "ProfessionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionTypes_ProfessionId_Code",
                table: "ProfessionTypes",
                columns: new[] { "ProfessionId", "Code" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfessionTypeLicenseRequirements");

            migrationBuilder.DropTable(
                name: "ProfessionTypes");

            migrationBuilder.DropIndex(
                name: "IX_Professions_Code",
                table: "Professions");

            migrationBuilder.DropIndex(
                name: "IX_LicenseTypes_Code",
                table: "LicenseTypes");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Professions");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Professions");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "LicenseTypes");

            migrationBuilder.DropColumn(
                name: "IsStateSpecific",
                table: "LicenseTypes");

            migrationBuilder.AddColumn<int>(
                name: "ProfessionId",
                table: "LicenseTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_LicenseTypes_ProfessionId",
                table: "LicenseTypes",
                column: "ProfessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_LicenseTypes_Professions_ProfessionId",
                table: "LicenseTypes",
                column: "ProfessionId",
                principalTable: "Professions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
