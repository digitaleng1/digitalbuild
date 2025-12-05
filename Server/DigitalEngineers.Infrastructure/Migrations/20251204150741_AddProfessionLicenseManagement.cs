using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessionLicenseManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Professions",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Professions",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Professions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "Professions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "Professions",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Professions",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Professions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "LicenseTypes",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "LicenseTypes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "LicenseTypes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "LicenseTypes",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "LicenseTypes",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "LicenseTypes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Professions_CreatedByUserId",
                table: "Professions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Professions_IsApproved",
                table: "Professions",
                column: "IsApproved");

            migrationBuilder.CreateIndex(
                name: "IX_Professions_Name",
                table: "Professions",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseTypes_CreatedByUserId",
                table: "LicenseTypes",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseTypes_IsApproved",
                table: "LicenseTypes",
                column: "IsApproved");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseTypes_Name",
                table: "LicenseTypes",
                column: "Name");

            migrationBuilder.AddForeignKey(
                name: "FK_LicenseTypes_Users_CreatedByUserId",
                table: "LicenseTypes",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Professions_Users_CreatedByUserId",
                table: "Professions",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LicenseTypes_Users_CreatedByUserId",
                table: "LicenseTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_Professions_Users_CreatedByUserId",
                table: "Professions");

            migrationBuilder.DropIndex(
                name: "IX_Professions_CreatedByUserId",
                table: "Professions");

            migrationBuilder.DropIndex(
                name: "IX_Professions_IsApproved",
                table: "Professions");

            migrationBuilder.DropIndex(
                name: "IX_Professions_Name",
                table: "Professions");

            migrationBuilder.DropIndex(
                name: "IX_LicenseTypes_CreatedByUserId",
                table: "LicenseTypes");

            migrationBuilder.DropIndex(
                name: "IX_LicenseTypes_IsApproved",
                table: "LicenseTypes");

            migrationBuilder.DropIndex(
                name: "IX_LicenseTypes_Name",
                table: "LicenseTypes");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Professions");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Professions");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Professions");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Professions");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Professions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "LicenseTypes");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "LicenseTypes");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "LicenseTypes");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "LicenseTypes");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "LicenseTypes");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Professions",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Professions",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "LicenseTypes",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);
        }
    }
}
