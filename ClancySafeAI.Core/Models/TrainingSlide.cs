namespace ClancySafeAI.Core.Models
{
    public class TrainingSlide
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public string AudioUrl { get; set; }
        public int Duration { get; set; }
        public string TrainingId { get; set; }
        public Training Training { get; set; }
    }
} 