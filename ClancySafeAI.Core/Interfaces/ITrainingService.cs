using ClancySafeAI.Core.Models;

namespace ClancySafeAI.Core.Interfaces
{
    public interface ITrainingService
    {
        Task<Training> GetTrainingAsync(string id);
        Task CompleteTrainingAsync(string id, string userId);
        Task SubmitQuestionAsync(string id, TrainingQuestion question, string userId);
    }
} 