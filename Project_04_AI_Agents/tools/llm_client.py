import requests
import os
from groq import Groq

def test_llm_connection(provider: str, api_key: str = None, api_base_url: str = None) -> bool:
    """Test the LLM connection with the given credentials."""
    try:
        if provider.lower() == "groq":
            if not api_key:
                print("Groq API key is required.")
                return False
            client = Groq(api_key=api_key)
            # Simple test call
            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=5
            )
            return True
        elif provider.lower() == "ollama":
            url = f"{api_base_url.rstrip('/')}/api/tags" if api_base_url else "http://localhost:11434/api/tags"
            response = requests.get(url)
            if response.status_code == 200:
                return True
            else:
                print(f"Ollama connection failed: {response.status_code}")
                return False
        else:
            print(f"Unsupported provider: {provider}")
            return False
    except Exception as e:
        print(f"LLM connection error: {e}")
        return False

def generate_test_plan_content(provider: str, model_name: str, issue_data: dict, additional_context: str, api_key: str = None, api_base_url: str = None) -> str:
    """Generate test plan content using the selected LLM provider."""
    
    prompt = f"""You are an expert QA Engineer. Generate a comprehensive test plan for the following feature/user story.

Feature/Issue Details:
{issue_data}

Additional Context:
{additional_context}

Please provide a detailed test plan including:
1. Test Strategy
2. Test Scenarios (Positive and Negative)
3. Test Cases (Step-by-step)
4. Prerequisites
5. Expected Results
"""
    try:
        if provider.lower() == "groq":
            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                model=model_name or "llama3-8b-8192",
                messages=[
                    {"role": "system", "content": "You are an expert QA test planner."},
                    {"role": "user", "content": prompt}
                ]
            )
            return completion.choices[0].message.content
            
        elif provider.lower() == "ollama":
            url = f"{api_base_url.rstrip('/')}/api/generate" if api_base_url else "http://localhost:11434/api/generate"
            payload = {
                "model": model_name or "llama3",
                "prompt": prompt,
                "stream": False
            }
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                return response.json().get("response", "")
            else:
                print(f"Ollama generation failed: {response.status_code}")
                return ""
    except Exception as e:
        print(f"LLM generation error: {e}")
        return ""
