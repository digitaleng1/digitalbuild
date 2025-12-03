using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSpecialistInvitation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SpecialistInvitations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    GeneratedPassword = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    InvitationToken = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CustomMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    LicenseTypeId = table.Column<int>(type: "integer", nullable: false),
                    InvitedByUserId = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                    CreatedSpecialistUserId = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialistInvitations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpecialistInvitations_LicenseTypes_LicenseTypeId",
                        column: x => x.LicenseTypeId,
                        principalTable: "LicenseTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SpecialistInvitations_Users_CreatedSpecialistUserId",
                        column: x => x.CreatedSpecialistUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SpecialistInvitations_Users_InvitedByUserId",
                        column: x => x.InvitedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistInvitations_CreatedAt",
                table: "SpecialistInvitations",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistInvitations_CreatedSpecialistUserId",
                table: "SpecialistInvitations",
                column: "CreatedSpecialistUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistInvitations_Email",
                table: "SpecialistInvitations",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistInvitations_InvitationToken",
                table: "SpecialistInvitations",
                column: "InvitationToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistInvitations_InvitedByUserId",
                table: "SpecialistInvitations",
                column: "InvitedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistInvitations_IsUsed",
                table: "SpecialistInvitations",
                column: "IsUsed");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistInvitations_LicenseTypeId",
                table: "SpecialistInvitations",
                column: "LicenseTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpecialistInvitations");
        }
    }
}
