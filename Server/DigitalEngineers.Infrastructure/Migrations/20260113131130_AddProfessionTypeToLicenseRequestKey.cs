using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessionTypeToLicenseRequestKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialistLicenseTypes_ProfessionTypes_ProfessionTypeId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SpecialistLicenseTypes",
                table: "SpecialistLicenseTypes");

            migrationBuilder.AlterColumn<int>(
                name: "ProfessionTypeId",
                table: "SpecialistLicenseTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SpecialistLicenseTypes",
                table: "SpecialistLicenseTypes",
                columns: new[] { "SpecialistId", "LicenseTypeId", "ProfessionTypeId" });

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialistLicenseTypes_ProfessionTypes_ProfessionTypeId",
                table: "SpecialistLicenseTypes",
                column: "ProfessionTypeId",
                principalTable: "ProfessionTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialistLicenseTypes_ProfessionTypes_ProfessionTypeId",
                table: "SpecialistLicenseTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SpecialistLicenseTypes",
                table: "SpecialistLicenseTypes");

            migrationBuilder.AlterColumn<int>(
                name: "ProfessionTypeId",
                table: "SpecialistLicenseTypes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SpecialistLicenseTypes",
                table: "SpecialistLicenseTypes",
                columns: new[] { "SpecialistId", "LicenseTypeId" });

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialistLicenseTypes_ProfessionTypes_ProfessionTypeId",
                table: "SpecialistLicenseTypes",
                column: "ProfessionTypeId",
                principalTable: "ProfessionTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
