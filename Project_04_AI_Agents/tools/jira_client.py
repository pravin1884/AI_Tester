import requests
from requests.auth import HTTPBasicAuth

def test_jira_connection(jira_url: str, jira_email: str, api_token: str) -> bool:
    """Test the Jira connection with the given credentials."""
    url = f"{jira_url.rstrip('/')}/rest/api/3/myself"
    auth = HTTPBasicAuth(jira_email, api_token)
    headers = {"Accept": "application/json"}
    
    try:
        response = requests.get(url, headers=headers, auth=auth)
        if response.status_code == 200:
            return True
        else:
            print(f"Jira connection failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Jira connection error: {e}")
        return False

def fetch_issue_details(jira_url: str, jira_email: str, api_token: str, issue_id: str) -> dict:
    """Fetch details for a specific Jira issue."""
    url = f"{jira_url.rstrip('/')}/rest/api/3/issue/{issue_id}"
    auth = HTTPBasicAuth(jira_email, api_token)
    headers = {"Accept": "application/json"}
    
    try:
        response = requests.get(url, headers=headers, auth=auth)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch issue: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error fetching issue: {e}")
        return None
