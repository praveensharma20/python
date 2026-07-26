import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { authenticate, githubScan, uploadScan } from './api/client';
import { Dashboard } from './components/Dashboard';
import type { ScanResult, Severity } from './types/models';
import './styles.css';

function App() {
  const [email, setEmail] = useState('security@example.com');
  const [password, setPassword] = useState('change-me-now');
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [severity, setSeverity] = useState<Severity | 'all'>('all');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  async function signIn(mode: 'login' | 'register') {
    try { const data = await authenticate(email, password, mode); setToken(data.access_token); setMessage('Authenticated'); } catch (error) { setMessage(String(error)); }
  }

  async function handleUpload(file?: File) {
    if (!file || !token) return;
    try { setResult(await uploadScan(token, file)); } catch (error) { setMessage(String(error)); }
  }

  async function handleGithub() {
    if (!repo || !token) return;
    try { setResult(await githubScan(token, repo, branch)); } catch (error) { setMessage(String(error)); }
  }

  return <main>
    <section className="hero"><div><p className="eyebrow">SecureReview AI</p><h1>Intelligent secure code review for source uploads and GitHub repositories.</h1><p>Run Semgrep, Bandit, and platform checks, then triage SQL injection, XSS, hardcoded credentials, insecure patterns, and logic-risk findings in one dashboard.</p></div></section>
    <section className="panel auth"><input value={email} onChange={(e) => setEmail(e.target.value)} /><input value={password} type="password" onChange={(e) => setPassword(e.target.value)} /><button onClick={() => signIn('login')}>Login</button><button onClick={() => signIn('register')}>Register</button></section>
    <section className="panel ingest"><label>Upload archive<input type="file" accept=".zip,.tar,.tgz,.gz" onChange={(e) => handleUpload(e.target.files?.[0])} /></label><input placeholder="https://github.com/org/repo" value={repo} onChange={(e) => setRepo(e.target.value)} /><input placeholder="branch (optional)" value={branch} onChange={(e) => setBranch(e.target.value)} /><button onClick={handleGithub}>Scan GitHub</button></section>
    {message && <p className="message">{message}</p>}
    <Dashboard result={result} token={token} severity={severity} setSeverity={setSeverity} query={query} setQuery={setQuery} />
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
