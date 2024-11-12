using Microsoft.EntityFrameworkCore.Migrations;

namespace ClancySafeAI.Infrastructure.Data.Migrations
{
    public partial class AddTrainingTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Trainings",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Title = table.Column<string>(maxLength: 200, nullable: false),
                    Description = table.Column<string>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    CompletedAt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trainings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrainingSlides",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(maxLength: 200, nullable: false),
                    Content = table.Column<string>(nullable: false),
                    ImageUrl = table.Column<string>(nullable: true),
                    AudioUrl = table.Column<string>(nullable: true),
                    Duration = table.Column<int>(nullable: false),
                    TrainingId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingSlides", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingSlides_Trainings_TrainingId",
                        column: x => x.TrainingId,
                        principalTable: "Trainings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question = table.Column<string>(nullable: false),
                    SlideId = table.Column<int>(nullable: false),
                    TrainingId = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingQuestions_TrainingSlides_SlideId",
                        column: x => x.SlideId,
                        principalTable: "TrainingSlides",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "TrainingQuestions");
            migrationBuilder.DropTable(name: "TrainingSlides");
            migrationBuilder.DropTable(name: "Trainings");
        }
    }
} 