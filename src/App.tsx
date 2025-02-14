import React, { useState, ChangeEvent, FormEvent } from 'react';
import { NewspaperIcon, ArrowRightIcon, AlertCircle } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSummary('');
    
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      const makeWebhookUrl = 'https://hook.us2.make.com/43w4djaynnojsh85t30397asrj5vuu67';
      
      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const summaryText = await response.text();
      if (!summaryText) {
        throw new Error('No summary received from the server');
      }

      setSummary(summaryText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary. Please try again.';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <NewspaperIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Article Summarizer
          </h1>
          <p className="text-lg text-gray-600">
            Transform lengthy articles into clear, concise summaries
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="url" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  Summarize
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </div>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 flex items-start p-4 rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <p className="ml-3 text-sm text-red-600">{error}</p>
            </div>
          )}

          {summary && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">{summary}</p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              How it works
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-2">1. Input URL</h3>
                <p className="text-sm text-gray-600">
                  Paste the URL of any English news article you'd like to summarize
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-2">2. Process</h3>
                <p className="text-sm text-gray-600">
                  Our AI analyzes the article's content and key points
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-2">3. Summary</h3>
                <p className="text-sm text-gray-600">
                  Receive a clear, concise summary of the article's main points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;