namespace ClancySafeAI.Core.Models
{
    public class Training
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<TrainingSlide> Slides { get; set; }
        public TrainingStatus Status { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public enum TrainingStatus
    {
        NotStarted,
        InProgress,
        Completed
    }
} 