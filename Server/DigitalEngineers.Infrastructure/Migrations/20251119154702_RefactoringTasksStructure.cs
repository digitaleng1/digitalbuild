using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DigitalEngineers.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactoringTasksStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskLabels_Projects_ProjectId",
                table: "TaskLabels");

            migrationBuilder.DropTable(
                name: "TaskLabelAssignments");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_Deadline",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_IsMilestone",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_TaskLabels_ProjectId",
                table: "TaskLabels");

            migrationBuilder.DropIndex(
                name: "UX_TaskLabels_Name_ProjectId",
                table: "TaskLabels");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "TaskLabels");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "TaskLabels");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "TaskLabels");

            migrationBuilder.AddColumn<int>(
                name: "LabelId",
                table: "TaskLabels",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TaskId",
                table: "TaskLabels",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ProjectTaskLabels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Color = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    ProjectId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTaskLabels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectTaskLabels_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskLabels_LabelId",
                table: "TaskLabels",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "UX_TaskLabels_TaskId_LabelId",
                table: "TaskLabels",
                columns: new[] { "TaskId", "LabelId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTaskLabels_ProjectId",
                table: "ProjectTaskLabels",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "UX_ProjectTaskLabels_Name_ProjectId",
                table: "ProjectTaskLabels",
                columns: new[] { "Name", "ProjectId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLabels_ProjectTaskLabels_LabelId",
                table: "TaskLabels",
                column: "LabelId",
                principalTable: "ProjectTaskLabels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLabels_Tasks_TaskId",
                table: "TaskLabels",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskLabels_ProjectTaskLabels_LabelId",
                table: "TaskLabels");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskLabels_Tasks_TaskId",
                table: "TaskLabels");

            migrationBuilder.DropTable(
                name: "ProjectTaskLabels");

            migrationBuilder.DropIndex(
                name: "IX_TaskLabels_LabelId",
                table: "TaskLabels");

            migrationBuilder.DropIndex(
                name: "UX_TaskLabels_TaskId_LabelId",
                table: "TaskLabels");

            migrationBuilder.DropColumn(
                name: "LabelId",
                table: "TaskLabels");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "TaskLabels");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "TaskLabels",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "TaskLabels",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "TaskLabels",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TaskLabelAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LabelId = table.Column<int>(type: "integer", nullable: false),
                    TaskId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskLabelAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskLabelAssignments_TaskLabels_LabelId",
                        column: x => x.LabelId,
                        principalTable: "TaskLabels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaskLabelAssignments_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_Deadline",
                table: "Tasks",
                column: "Deadline");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_IsMilestone",
                table: "Tasks",
                column: "IsMilestone");

            migrationBuilder.CreateIndex(
                name: "IX_TaskLabels_ProjectId",
                table: "TaskLabels",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "UX_TaskLabels_Name_ProjectId",
                table: "TaskLabels",
                columns: new[] { "Name", "ProjectId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskLabelAssignments_LabelId",
                table: "TaskLabelAssignments",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "UX_TaskLabelAssignments_TaskId_LabelId",
                table: "TaskLabelAssignments",
                columns: new[] { "TaskId", "LabelId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLabels_Projects_ProjectId",
                table: "TaskLabels",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
