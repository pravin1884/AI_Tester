import React, { useState } from 'react';
import { Settings, Play, Download, Search } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  
  const [llmProvider, setLlmProvider] = useState('groq');
  const [llmModel, setLlmModel] = useState('llama3-8b-8192');
  const [llmKey, setLlmKey] = useState('');
  
  const [issueId, setIssueId] = useState('');
  const [context, setContext] = useState('');
  
  const [status, setStatus] = useState('');
  const [downloadLink, setDownloadLink] = useState(null);

  const testJira = async () => {
    setStatus('Testing Jira Connection...');
    try {
      const res = await fetch('http://localhost:8000/api/test-jira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jira_url: jiraUrl, jira_email: jiraEmail, api_token: jiraToken })
      });
      const data = await res.json();
      if (res.ok) setStatus('Jira Connected Successfully!');
      else setStatus(`Error: ${data.detail}`);
    } catch (e) {
      setStatus('Failed to connect to backend.');
    }
  };

  const testLlm = async () => {
    setStatus('Testing LLM Connection...');
    try {
      const res = await fetch('http://localhost:8000/api/test-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: llmProvider, model_name: llmModel, api_key: llmKey })
      });
      const data = await res.json();
      if (res.ok) setStatus('LLM Connected Successfully!');
      else setStatus(`Error: ${data.detail}`);
    } catch (e) {
      setStatus('Failed to connect to backend.');
    }
  };

  const generatePlan = async () => {
    setStatus('Generating Test Plan... This may take a moment.');
    try {
      const res = await fetch('http://localhost:8000/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jira: { jira_url: jiraUrl, jira_email: jiraEmail, api_token: jiraToken },
          llm: { provider: llmProvider, model_name: llmModel, api_key: llmKey },
          issue_id: issueId,
          additional_context: context
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Test Plan Generated!');
        setDownloadLink(data.file_path);
        setStep(3);
      } else {
        setStatus(`Error: ${data.detail}`);
      }
    } catch (e) {
      setStatus('Failed to generate plan.');
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-8 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Settings size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Intelligent Test Planner</h1>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {/* Progress Tracker */}
        <div className="flex justify-between mb-8 border-b pb-4">
          <button onClick={() => setStep(1)} className={`font-semibold ${step === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>1. Connections</button>
          <button onClick={() => setStep(2)} className={`font-semibold ${step === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>2. Fetch & Generate</button>
          <button onClick={() => setStep(3)} className={`font-semibold ${step === 3 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>3. Review Plan</button>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold">Connections Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jira */}
              <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                <h3 className="font-semibold text-lg flex items-center"><Search className="mr-2" size={18}/> Jira Connection</h3>
                <input className="w-full p-2 border rounded" placeholder="Jira URL (e.g. https://your.atlassian.net)" value={jiraUrl} onChange={e => setJiraUrl(e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder="Email" value={jiraEmail} onChange={e => setJiraEmail(e.target.value)} />
                <input className="w-full p-2 border rounded" type="password" placeholder="API Token" value={jiraToken} onChange={e => setJiraToken(e.target.value)} />
                <button onClick={testJira} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded transition">Test Jira</button>
              </div>
              
              {/* LLM */}
              <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                <h3 className="font-semibold text-lg flex items-center"><Settings className="mr-2" size={18}/> LLM Connection</h3>
                <select className="w-full p-2 border rounded" value={llmProvider} onChange={e => setLlmProvider(e.target.value)}>
                  <option value="groq">Groq API</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
                <input className="w-full p-2 border rounded" placeholder="Model Name (e.g. llama3-8b-8192)" value={llmModel} onChange={e => setLlmModel(e.target.value)} />
                <input className="w-full p-2 border rounded" type="password" placeholder="API Key (if applicable)" value={llmKey} onChange={e => setLlmKey(e.target.value)} />
                <button onClick={testLlm} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded transition">Test LLM</button>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">Continue to Setup Requirements</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold">Fetch Jira Requirements</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Key (e.g. PROJ-123)</label>
                <input className="w-full p-3 border rounded-lg" value={issueId} onChange={e => setIssueId(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Context (Optional)</label>
                <textarea className="w-full p-3 border rounded-lg h-32" placeholder="Any specific focus areas for testing..." value={context} onChange={e => setContext(e.target.value)}></textarea>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 font-medium">Back</button>
              <button onClick={generatePlan} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center">
                <Play className="mr-2" size={18}/> Generate Test Plan
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Download size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Test Plan Ready!</h2>
            <p className="text-slate-600 max-w-md mx-auto">Your test plan has been generated successfully using the selected template and AI model.</p>
            {downloadLink && (
              <div className="pt-6">
                <p className="text-sm text-slate-500 mb-2">Saved to backend at:</p>
                <code className="block bg-slate-100 p-3 rounded text-sm text-slate-700 break-all">{downloadLink}</code>
              </div>
            )}
            <div className="pt-8">
              <button onClick={() => setStep(1)} className="text-blue-600 hover:underline font-medium">Create Another</button>
            </div>
          </div>
        )}
      </div>

      {status && (
        <div className="mt-6 p-4 bg-slate-800 text-white rounded-lg shadow-lg flex items-center justify-between animate-in slide-in-from-bottom-5">
          <span>{status}</span>
          <button onClick={() => setStatus('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
}
