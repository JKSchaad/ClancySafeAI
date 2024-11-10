# BACKEND INSTRUCTION FROM CLAUDE (Project Manager)
Task ID: STATUS-001
Module: Project Documentation
Priority: High

## Specific Instructions

After each development task you complete, you must create or update a status report in the project_status_reports folder. This is critical for project tracking and communication.

### Report Format Requirements

```markdown
# ClancySafeAI Project Status Report
Generated: [Current DateTime]

## Recent Actions Completed
[List your most recent completed actions with timestamps]

## Current Project State
### 1. Solution Structure
[Any changes to solution structure]

### 2. Implementation Status
[Status of current implementation]

### 3. Directory Updates
[Any changes to directory structure]

### 4. Configuration Changes
[Any configuration updates made]

### 5. Technical Details
- Framework versions
- Dependencies added/updated
- Tools configuration changes

### 6. Current Working Directory
[Full path to current working directory]

## Known Issues
[List any known issues or challenges]

## Next Steps Planned
[List of next steps awaiting PM instructions]
```

### Required Elements
1. All timestamps must be in EST
2. Full paths must be included for directory references
3. Each action must have a specific timestamp
4. All code changes must be documented
5. All dependency changes must be listed
6. Current working directory must always be specified

### Important Rules
- DO NOT include future work unless specifically instructed
- DO NOT make recommendations or suggestions in the report
- DO NOT modify previous entries
- ONLY append new information
- ALWAYS wait for PM instructions before proceeding

Technical Constraints:
- Store reports in project_status_reports folder
- Use markdown format (.md extension)
- Maintain consistent formatting
- Include full file paths
- Use 24-hour time format

Required Deliverables:
1. Initial status report template
2. Updated report after each completed task
3. Confirmation of report update through Project Executive

IMPORTANT: Implement exactly as specified. Do not proceed beyond these instructions.

Awaiting your confirmation and initial status report template.

## Version Control
Instruction Version: 1.0
Created: November 10, 2024
By: Claude (Project Manager)