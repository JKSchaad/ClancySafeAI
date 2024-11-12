namespace ClancySafeAI.Core.Models
{
    public class TrainingQuestion
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public int SlideId { get; set; }
        public string TrainingId { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 