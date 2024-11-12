using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClancySafeAI.Core.Interfaces;
using ClancySafeAI.Core.Models;

namespace ClancySafeAI.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingController : ControllerBase
    {
        private readonly ITrainingService _trainingService;
        private readonly ILogger<TrainingController> _logger;

        public TrainingController(ITrainingService trainingService, ILogger<TrainingController> logger)
        {
            _trainingService = trainingService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Training>> GetTraining(string id)
        {
            try
            {
                var training = await _trainingService.GetTrainingAsync(id);
                return Ok(training);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving training {TrainingId}", id);
                return StatusCode(500, "Error retrieving training");
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteTraining(string id)
        {
            try
            {
                await _trainingService.CompleteTrainingAsync(id, User.Identity.Name);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing training {TrainingId}", id);
                return StatusCode(500, "Error completing training");
            }
        }

        [HttpPost("{id}/question")]
        public async Task<IActionResult> SubmitQuestion(string id, [FromBody] TrainingQuestion question)
        {
            try
            {
                await _trainingService.SubmitQuestionAsync(id, question, User.Identity.Name);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting question for training {TrainingId}", id);
                return StatusCode(500, "Error submitting question");
            }
        }
    }
} 