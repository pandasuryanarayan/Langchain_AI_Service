// App.js
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // Import remarkGfm for GitHub Flavored Markdown

// Tailwind CSS is loaded directly from CDN in your public/index.html or similar.
// Example: <script src="https://cdn.tailwindcss.com"></script>

function App() {
  const [summarizeText, setSummarizeText] = useState('');
  const [summarizeResult, setSummarizeResult] = useState(null);
  const [summarizeLoading, setSummarizeLoading] = useState(false);

  const [qaContext, setQaContext] = useState('');
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaResult, setQaResult] = useState(null);
  const [qaLoading, setQaLoading] = useState(false);

  const [lpTopic, setLpTopic] = useState('');
  const [lpResult, setLpResult] = useState(null);
  const [lpLoading, setLpLoading] = useState(false);

  // Replace with your backend URL
  const API_BASE_URL = 'http://localhost:5000'; // Adjust if your backend runs on a different port or host

  // Function to generate SHA256 hash (client-side for integrity check before sending to backend)
  const generateClientHash = async (data) => {
    const textEncoder = new TextEncoder();
    // Ensure consistent serialization for hashing, matching backend's json.dumps
    const serializedData = JSON.stringify(data, Object.keys(data).sort());
    const dataBuffer = textEncoder.encode(serializedData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hexHash;
  };

  const handleSummarize = async () => {
    setSummarizeLoading(true);
    setSummarizeResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: summarizeText }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummarizeResult(data);
      } else {
        setSummarizeResult({ error: data.error || 'An unknown error occurred.' });
      }
    } catch (error) {
      console.error('Error summarizing:', error);
      setSummarizeResult({ error: 'Network error or API is down. Please check backend.' });
    } finally {
      setSummarizeLoading(false);
    }
  };

  const handleQandA = async () => {
    setQaLoading(true);
    setQaResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/qa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context: qaContext, question: qaQuestion }),
      });
      const data = await response.json();
      if (response.ok) {
        setQaResult(data);
      } else {
        setQaResult({ error: data.error || 'An unknown error occurred.' });
      }
    } catch (error) {
      console.error('Error Q&A:', error);
      setQaResult({ error: 'Network error or API is down. Please check backend.' });
    } finally {
      setQaLoading(false);
    }
  };

  const handleLearningPath = async () => {
    setLpLoading(true);
    setLpResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/learning_path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: lpTopic }),
      });
      const data = await response.json();
      if (response.ok) {
        setLpResult(data);
      } else {
        setLpResult({ error: data.error || 'An unknown error occurred.' });
      }
    } catch (error) {
      console.error('Error learning path:', error);
      setLpResult({ error: 'Network error or API is down. Please check backend.' });
    } finally {
      setLpLoading(false);
    }
  };

  const handleVerify = async (result, type) => {
    if (!result || !result.verification_hash) {
      alert('No data or hash to verify.');
      return;
    }

    // 1. Re-compute hash of the displayed content (client-side integrity check)
    // For learning path, the dataToHash should be the raw markdown string
    const dataToHash = { ...result };
    delete dataToHash.verification_hash; // Remove the hash itself before re-hashing
    const clientHashOfDisplayedContent = await generateClientHash(dataToHash);

    // 2. Fetch the recorded hash from the mock blockchain ledger on the backend
    try {
      const backendVerificationResponse = await fetch(`${API_BASE_URL}/verify_on_chain/${result.verification_hash}`);
      const backendVerificationData = await backendVerificationResponse.json();

      if (backendVerificationResponse.ok && backendVerificationData.status === 'found') {
        const recordedHashInLedger = backendVerificationData.hash;

        // 3. Compare the original hash from the API response with the one found in the ledger
        // AND compare the client-computed hash with the original hash (integrity check)
        if (result.verification_hash === recordedHashInLedger && clientHashOfDisplayedContent === recordedHashInLedger) {
          alert(`Verification successful for ${type}!
          Original Hash: ${result.verification_hash}
          Recorded in Ledger: ${recordedHashInLedger}
          Client-Computed Hash: ${clientHashOfDisplayedContent}
          Data is consistent and recorded.`);
        } else {
          alert(`Verification FAILED for ${type}!
          Original Hash: ${result.verification_hash}
          Recorded in Ledger: ${recordedHashInLedger}
          Client-Computed Hash: ${clientHashOfDisplayedContent}
          Hashes do NOT match. Data may have been tampered with or recorded incorrectly.`);
        }
      } else {
        alert(`Verification FAILED for ${type}! Hash not found in mock blockchain ledger.
        Message: ${backendVerificationData.message || 'Unknown error.'}`);
      }
    } catch (error) {
      console.error('Error during blockchain verification:', error);
      alert(`Error during blockchain verification for ${type}: ${error.message}. Please check backend.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-indigo-600 text-white p-6 text-center rounded-t-xl">
          <h1 className="text-4xl font-extrabold mb-2">LangChain AI Service Demo</h1>
          <p className="text-indigo-200 text-lg">Modular AI APIs for Summarization, Q&A, and Learning Paths</p>
          <p className="text-xs text-indigo-300 mt-2">
            Note: Gemini LLM integration requires your API key. Blockchain is simulated with a backend ledger.
          </p>
        </header>

        <main className="p-8 space-y-12">
          {/* Summarization API */}
          <section className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Text Summarization
            </h2>
            <textarea
              className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out resize-y min-h-[120px] text-white bg-gray-700 placeholder-gray-400"
              placeholder="Enter text to summarize..."
              value={summarizeText}
              onChange={(e) => setSummarizeText(e.target.value)}
            ></textarea>
            <button
              onClick={handleSummarize}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              disabled={summarizeLoading}
            >
              {summarizeLoading ? 'Summarizing...' : 'Get Summary'}
            </button>

            {summarizeResult && (
              <div className="mt-6 p-4 bg-blue-100 rounded-md border border-blue-300 prose prose-indigo max-w-none"> {/* Added prose classes */}
                <h3 className="font-semibold text-lg text-blue-800 mb-2">Summary:</h3>
                {/* Use ReactMarkdown for summary */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{summarizeResult.summary || summarizeResult.error}</ReactMarkdown>
                {summarizeResult.verification_hash && (
                  <div className="mt-4 text-sm text-blue-600 break-words">
                    <p className="font-medium">Verification Hash:</p>
                    <span className="text-xs">{summarizeResult.verification_hash}</span>
                    <button
                      onClick={() => handleVerify(summarizeResult, 'Summarization')}
                      className="ml-2 bg-blue-300 hover:bg-blue-400 text-blue-800 text-xs font-bold py-1 px-2 rounded-full transition duration-200"
                    >
                      Verify with Mock Blockchain
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Q&A API */}
          <section className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.247a4.25 4.25 0 00-.996 2.457c0 2.21 1.79 4 4 4s4-1.79 4-4a4.25 4.25 0 00-.996-2.457M12 19v-2m0-4V7m0-4a9 9 0 100 18A9 9 0 0012 3z"></path></svg>
              Question & Answer
            </h2>
            <textarea
              className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 ease-in-out resize-y min-h-[120px] mb-4 text-white bg-gray-700 placeholder-gray-400"
              placeholder="Enter context for the question..."
              value={qaContext}
              onChange={(e) => setQaContext(e.target.value)}
            ></textarea>
            <input
              type="text"
              className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 ease-in-out text-white bg-gray-700 placeholder-gray-400"
              placeholder="Enter your question..."
              value={qaQuestion}
              onChange={(e) => setQaQuestion(e.target.value)}
            />
            <button
              onClick={handleQandA}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              disabled={qaLoading}
            >
              {qaLoading ? 'Getting Answer...' : 'Get Answer'}
            </button>

            {qaResult && (
              <div className="mt-6 p-4 bg-green-100 rounded-md border border-green-300 prose prose-indigo max-w-none"> {/* Added prose classes */}
                <h3 className="font-semibold text-lg text-green-800 mb-2">Answer:</h3>
                {/* Use ReactMarkdown for answer */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{qaResult.answer || qaResult.error}</ReactMarkdown>
                {qaResult.verification_hash && (
                  <div className="mt-4 text-sm text-green-600 break-words">
                    <p className="font-medium">Verification Hash:</p>
                    <span className="text-xs">{qaResult.verification_hash}</span>
                    <button
                      onClick={() => handleVerify(qaResult, 'Q&A')}
                      className="ml-2 bg-green-300 hover:bg-green-400 text-green-800 text-xs font-bold py-1 px-2 rounded-full transition duration-200"
                    >
                      Verify with Mock Blockchain
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Learning Path API */}
          <section className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-200">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              Learning Path Generation
            </h2>
            <input
              type="text"
              className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 ease-in-out text-white bg-gray-700 placeholder-gray-400"
              placeholder="Enter a topic (e.g., 'Machine Learning', 'Web Development')"
              value={lpTopic}
              onChange={(e) => setLpTopic(e.target.value)}
            />
            <button
              onClick={handleLearningPath}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              disabled={lpLoading}
            >
              {lpLoading ? 'Generating Path...' : 'Generate Learning Path'}
            </button>

            {lpResult && (
              <div className="mt-6 p-4 bg-purple-100 rounded-md border border-purple-300 prose prose-indigo max-w-none"> {/* Added prose classes */}
                <h3 className="font-semibold text-lg text-purple-800 mb-2">Learning Path:</h3>
                {/* Use ReactMarkdown for learning path */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{lpResult.learning_path || lpResult.error}</ReactMarkdown>
                {lpResult.verification_hash && (
                  <div className="mt-4 text-sm text-purple-600 break-words">
                    <p className="font-medium">Verification Hash:</p>
                    <span className="text-xs">{lpResult.verification_hash}</span>
                    <button
                      onClick={() => handleVerify(lpResult, 'Learning Path')}
                      className="ml-2 bg-purple-300 hover:bg-purple-400 text-purple-800 text-xs font-bold py-1 px-2 rounded-full transition duration-200"
                    >
                      Verify with Mock Blockchain
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>

        <footer className="bg-indigo-600 text-white p-4 text-center text-sm rounded-b-xl">
          <p>&copy; 2025 LangChain AI Service Demo. All rights reserved.</p>
          <p className="mt-2 text-indigo-200">
            Note: Gemini LLM integration requires your API key. Blockchain is simulated with a backend ledger.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
