# Findings

## Research, Discoveries, Constraints

- User wants a Test Planner Agent connecting to Jira, ADO, X-Ray to fetch user stories.
- Dynamic Connections: Jira connection details will be added "on the fly" via the UI, not just statically stored.
- LLM Connections: The system needs to support configuring LLM connections on the fly (e.g., Ollama, GROQ) with a "Test Connection" button.
- Flow: 1) Configure Jira/ADO and LLM -> 2) Fetch user story via ID & context -> 3) Generate test plan using `Test Plan - Template.docx`.
- Output: Generate a test plan using `Test Plan - Template.docx`.
- UI Screenshots indicate a web frontend with setup, fetching issues, review, and test plan generation steps.
