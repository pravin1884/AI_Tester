from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from tools.jira_client import test_jira_connection, fetch_issue_details
from tools.llm_client import test_llm_connection, generate_test_plan_content
from tools.doc_generator import create_test_plan
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Test Planner Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JiraConnection(BaseModel):
    jira_url: str
    jira_email: str
    api_token: str

class LLMConnection(BaseModel):
    provider: str
    model_name: str
    api_key: Optional[str] = None
    api_base_url: Optional[str] = None

class GenerateRequest(BaseModel):
    jira: JiraConnection
    llm: LLMConnection
    issue_id: str
    additional_context: Optional[str] = ""

@app.post("/api/test-jira")
def api_test_jira(conn: JiraConnection):
    success = test_jira_connection(conn.jira_url, conn.jira_email, conn.api_token)
    if not success:
        raise HTTPException(status_code=400, detail="Jira connection failed.")
    return {"status": "success", "message": "Jira connected successfully."}

@app.post("/api/test-llm")
def api_test_llm(conn: LLMConnection):
    success = test_llm_connection(conn.provider, conn.api_key, conn.api_base_url)
    if not success:
        raise HTTPException(status_code=400, detail="LLM connection failed.")
    return {"status": "success", "message": "LLM connected successfully."}

@app.post("/api/generate-plan")
def api_generate_plan(req: GenerateRequest):
    # 1. Fetch Jira Issue
    issue_data = fetch_issue_details(req.jira.jira_url, req.jira.jira_email, req.jira.api_token, req.issue_id)
    if not issue_data:
        raise HTTPException(status_code=404, detail="Could not fetch Jira issue details.")
        
    # 2. Generate Content with LLM
    content = generate_test_plan_content(
        provider=req.llm.provider,
        model_name=req.llm.model_name,
        issue_data=str(issue_data.get('fields', issue_data)),
        additional_context=req.additional_context,
        api_key=req.llm.api_key,
        api_base_url=req.llm.api_base_url
    )
    if not content:
        raise HTTPException(status_code=500, detail="LLM generation failed.")
        
    # 3. Create Document
    doc_path = create_test_plan(content)
    if not doc_path:
        raise HTTPException(status_code=500, detail="Document generation failed.")
        
    return {
        "status": "success",
        "message": "Test plan generated successfully.",
        "file_path": os.path.abspath(doc_path)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
