import { useState } from "react";
import axios from "axios";
import "./App.css";
import { ClipLoader } from "react-spinners";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [toast, setToast] = useState("");
  const [mode, setMode]=useState("General")

  const handleEnhance = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const response = await axios.post("https://promptsnapbackend.onrender.com/enhance", {
        prompt: prompt,
        tone: tone,
        mode: mode
      });

      setResult(response.data.enhanced_prompt);
    } catch (error) {
      showToast("Backend error");
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    showToast("Copied to clipboard!");
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className={darkMode ? "page dark" : "page"}>
      <div className="card">
        <div className="top-bar">
          <h1 className="title">PromptSnap</h1>
          <button
            className="toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <p className="subtitle">
          Transform vague ideas into powerful AI-ready prompts.
        </p>

        <select
          className="select"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Professional</option>
          <option>Creative</option>
          <option>Technical</option>
        </select>

        <select
          className="select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option>General</option>
          <option>Code</option>
          <option>Image</option>
          <option>Structured</option>
          <option>Startup</option>
        </select>

        <textarea
          className="textarea"
          placeholder="Enter your rough prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="char-count">
          {prompt.length} characters
        </div>

        <button
          className={loading ? "button-disabled" : "button"}
          onClick={handleEnhance}
          disabled={loading}
        >
        {loading ? (
          <ClipLoader
            size={18}
            color="#ffffff"
            speedMultiplier={1}
          />
        ) : (
          "Enhance Prompt"
        )}
        </button>

        {result && (
          <div className="result-box">
            <h3>Enhanced Prompt</h3>
            <p>{result}</p>
            <button className="copy-button" onClick={copyToClipboard}>
              Copy
            </button>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}

export default App;