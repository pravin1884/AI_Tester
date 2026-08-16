# Project Constitution

## Data Schemas

### 1. Connection Schemas
```json
// JiraConnection
{
  "connection_name": "string",
  "jira_url": "string",
  "jira_email": "string",
  "api_token": "string"
}

// LLMConnection
{
  "provider": "string", // "ollama", "groq"
  "api_base_url": "string (optional)",
  "api_key": "string (optional)",
  "model_name": "string"
}
```

### 2. Fetch Issue Schema
```json
// FetchIssueRequest
{
  "jira_connection": "JiraConnection",
  "project_key": "string",
  "issue_id": "string",
  "additional_context": "string"
}

// FetchIssueResponse
{
  "issue_id": "string",
  "title": "string",
  "description": "string",
  "acceptance_criteria": "string",
  "raw_data": "object"
}
```

### 3. Test Plan Generation Schema
```json
// GenerateTestPlanRequest
{
  "llm_connection": "LLMConnection",
  "issue_data": "FetchIssueResponse",
  "template_path": "string" // Path to Test Plan - Template.docx
}

// GenerateTestPlanResponse
{
  "status": "string", // "success" or "error"
  "output_file_path": "string",
  "message": "string"
}
```

## Behavioral Rules
- Follow B.L.A.S.T protocol and A.N.T architecture.
- Prioritize reliability over speed.
- Never guess at business logic.
- Data-First: Always define JSON Data Schema before coding.

## Architectural Invariants
- 3-Layer Architecture:
  - Layer 1: Architecture (`architecture/`) - Technical SOPs.
  - Layer 2: Navigation - Decision Making.
  - Layer 3: Tools (`tools/`) - Deterministic Python scripts.
