import React, { useState } from 'react';
import './App.css';

// We'll extract these to components later
function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [requirement, setRequirement] = useState('');
  const [testCase, setTestCase] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Settings State
  const [provider, setProvider] = useState('ollama');
  const [config, setConfig] = useState({
    url: 'http://localhost:11434',
    apiKey: '',
    model: 'llama3'
  });

  const handleGenerate = async () => {
    if (!requirement) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/llm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, config, requirement })
      });
      const data = await res.json();
      if (res.ok) {
        setTestCase(data.result);
        setHistory(prev => [...prev, data.result]);
      } else {
        setTestCase(`Error: ${data.error}`);
      }
    } catch (err) {
      setTestCase('Failed to connect to backend.');
    }
    setLoading(false);
  };

  const testConnection = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/llm/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, config })
      });
      const data = await res.json();
      if (data.success) alert('Connection Successful!');
      else alert(`Connection Failed: ${data.error || 'Unknown error'}`);
    } catch (err) {
      alert('Failed to connect to backend.');
    }
  };

  return (
    <div className="app-container dark-theme">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>History</h2>
        <div className="history-list">
          {history.map((tc, idx) => (
            <div key={idx} className="history-item">Test Case {idx + 1}</div>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <main className="main-content">
        <header className="header">
          <h1>Local LLM Test Case Generator</h1>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>⚙️ Settings</button>
        </header>

        <div className="chat-area">
          <div className="output-box">
            {loading ? <div className="loader">Generating...</div> : (
              <pre className="test-case-output">
                {testCase || 'Your generated Jira test cases will appear here...'}
              </pre>
            )}
          </div>
          
          <div className="input-box">
            <textarea 
              placeholder="Paste your Jira requirements here..." 
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
            />
            <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
              Generate
            </button>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>LLM Settings</h2>
            
            <div className="form-group">
              <label>Provider</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                <option value="ollama">Ollama</option>
                <option value="lmstudio">LM Studio</option>
                <option value="grok">Grok</option>
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>

            <div className="form-group">
              <label>URL (Ollama/LM Studio)</label>
              <input type="text" value={config.url} onChange={(e) => setConfig({...config, url: e.target.value})} />
            </div>

            <div className="form-group">
              <label>API Key</label>
              <input type="password" value={config.apiKey} onChange={(e) => setConfig({...config, apiKey: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Model Name</label>
              <input type="text" value={config.model} onChange={(e) => setConfig({...config, model: e.target.value})} />
            </div>

            <div className="modal-actions">
              <button className="test-btn" onClick={testConnection}>Test Connection</button>
              <button className="save-btn" onClick={() => setShowSettings(false)}>Save & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
