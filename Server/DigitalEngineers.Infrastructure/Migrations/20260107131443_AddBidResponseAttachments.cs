using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBidResponseAttachments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BidResponseAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BidResponseId = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    FileType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    S3Key = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UploadedByUserId = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BidResponseAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BidResponseAttachments_BidResponses_BidResponseId",
                        column: x => x.BidResponseId,
                        principalTable: "BidResponses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BidResponseAttachments_Users_UploadedByUserId",
                        column: x => x.UploadedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BidResponseAttachments_BidResponseId",
                table: "BidResponseAttachments",
                column: "BidResponseId");

            migrationBuilder.CreateIndex(
                name: "IX_BidResponseAttachments_UploadedByUserId",
                table: "BidResponseAttachments",
                column: "UploadedByUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BidResponseAttachments");
        }
    }
}
