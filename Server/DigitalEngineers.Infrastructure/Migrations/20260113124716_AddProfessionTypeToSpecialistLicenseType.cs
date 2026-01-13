using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessionTypeToSpecialistLicenseType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialistInvitations_LicenseTypes_LicenseTypeId",
                table: "SpecialistInvitations");

            migrationBuilder.DropIndex(
                name: "IX_SpecialistInvitations_LicenseTypeId",
                table: "SpecialistInvitations");

            migrationBuilder.DropColumn(
                name: "LicenseTypeId",
                table: "SpecialistInvitations");

            migrationBuilder.AddColumn<int>(
                name: "ProfessionTypeId",
                table: "SpecialistLicenseTypes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfessionTypeIds",
                table: "SpecialistInvitations",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistLicenseTypes_ProfessionTypeId",
                table: "SpecialistLicenseTypes",
                column: "ProfessionTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialistLicenseTypes_ProfessionTypes_ProfessionTypeId",
                table: "SpecialistLicenseTypes",
                column: "ProfessionTypeId",
                principalTable: "ProfessionTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialistLicenseTypes_ProfessionTypes_ProfessionTypeId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropIndex(
                name: "IX_SpecialistLicenseTypes_ProfessionTypeId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "ProfessionTypeId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropColumn(
                name: "ProfessionTypeIds",
                table: "SpecialistInvitations");

            migrationBuilder.AddColumn<int>(
                name: "LicenseTypeId",
                table: "SpecialistInvitations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SpecialistInvitations_LicenseTypeId",
                table: "SpecialistInvitations",
                column: "LicenseTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialistInvitations_LicenseTypes_LicenseTypeId",
                table: "SpecialistInvitations",
                column: "LicenseTypeId",
                principalTable: "LicenseTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
