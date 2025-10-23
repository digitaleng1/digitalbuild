using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessionAndLicenseTypeTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Professions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LicenseTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProfessionId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicenseTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicenseTypes_Professions_ProfessionId",
                        column: x => x.ProfessionId,
                        principalTable: "Professions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Professions",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,] 
                {
                    {  1, "Professional Engineer", "Engineering" },
                    {  2, "Transportation", "Transportation Trades" }
                }
                );

            migrationBuilder.InsertData(
                table: "LicenseTypes",
                columns: new[] { "Id", "Description", "Name", "ProfessionId" },
                values: new object[,]
                {
                    { 1, "Agricultural and Biological Engineering", "Agricultural and Biological Engineering", 1 },
                    { 2, "Architectural Engineering", "Architectural Engineering", 1 },
                    { 3, "Chemical Engineering", "Chemical Engineering", 1 },
                    { 4, "Civil Engineering", "Civil Engineering", 1 },
                    { 5, "Control Systems Engineering", "Control Systems Engineering", 1 },
                    { 6, "Electrical and Computer Engineering", "Electrical and Computer Engineering", 1 },
                    { 7, "Environmental Engineering", "Environmental Engineering", 1 },
                    { 8, "Fire Protection Engineering", "Fire Protection Engineering", 1 },
                    { 9, "Industrial and Systems Engineering", "Industrial and Systems Engineering", 1 },
                    { 10, "Mechanical Engineering", "Mechanical Engineering", 1 },
                    { 11, "Metallurgical and Materials Engineering", "Metallurgical and Materials Engineering", 1 },
                    { 12, "Mining and Mineral Processing Engineering", "Mining and Mineral Processing Engineering", 1 },
                    { 13, "Naval Architecture and Marine Engineering", "Naval Architecture and Marine Engineering", 1 },
                    { 14, "Nuclear Engineering", "Nuclear Engineering", 1 },
                    { 15, "Petroleum Engineering", "Petroleum Engineering", 1 },
                    { 16, "Crane Operation", "Crane Operation", 2 },
                    { 17, "Commercial Truck Driving", "Commercial Truck Driving", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_LicenseTypes_ProfessionId",
                table: "LicenseTypes",
                column: "ProfessionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LicenseTypes");

            migrationBuilder.DropTable(
                name: "Professions");
        }
    }
}
