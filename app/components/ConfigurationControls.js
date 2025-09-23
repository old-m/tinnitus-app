'use client';

import { useState } from 'react';
import PresetSelector from './PresetSelector';

export default function ConfigurationControls({ 
  tones, 
  masterVolume, 
  onSaveToUrl, 
  onClearConfiguration,
  onLoadConfiguration 
}) {
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [loadUrl, setLoadUrl] = useState('');

  const handleSaveToUrl = () => {
    const url = onSaveToUrl();
    setShareUrl(url);
    setShowShareModal(true);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URL copied to clipboard!');
    }
  };

  const handleLoadFromUrl = () => {
    try {
      const url = new URL(loadUrl);
      const config = url.searchParams.get('config');
      if (config) {
        // Navigate to the URL to load the configuration
        window.location.href = loadUrl;
      } else {
        alert('No configuration found in the provided URL');
      }
    } catch (err) {
      alert('Invalid URL format');
    }
  };

  const hasTones = tones.length > 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-md">
        <PresetSelector onLoadPreset={onLoadConfiguration} />
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSaveToUrl}
            disabled={!hasTones}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              hasTones
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={hasTones ? 'Generate a shareable URL for your current tone configuration' : 'Add some tones first'}
          >
            📤 Share Configuration
          </button>

          <button
            onClick={onClearConfiguration}
            disabled={!hasTones}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              hasTones
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={hasTones ? 'Clear all tones and reset configuration' : 'No tones to clear'}
          >
            🗑️ Clear All
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Paste a configuration URL here..."
            value={loadUrl}
            onChange={(e) => setLoadUrl(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded w-64 text-sm"
          />
          <button
            onClick={handleLoadFromUrl}
            disabled={!loadUrl.trim()}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              loadUrl.trim()
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="Load configuration from URL"
          >
            📥 Load
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share Your Tinnitus Configuration</h3>
            
            <p className="text-gray-600 mb-4">
              Share this URL with others to let them experience your tinnitus simulation:
            </p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                📋 Copy
              </button>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              <p><strong>Configuration Summary:</strong></p>
              <p>• {tones.length} tone{tones.length !== 1 ? 's' : ''}</p>
              <p>• Master volume: {Math.round(masterVolume * 100)}%</p>
              <p>• {tones.filter(t => t.toneType === 'chirp').length} chirping tone{tones.filter(t => t.toneType === 'chirp').length !== 1 ? 's' : ''}</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
