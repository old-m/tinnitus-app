'use client';

import ChirpControls from './ChirpControls';

export default function ToneControl({ tone, onUpdateTone, onRemoveTone }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Tone {tone.id}
        </h3>
        <button
          onClick={() => onRemoveTone(tone.id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Tone Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone Type
          </label>
          <select
            value={tone.toneType}
            onChange={(e) => onUpdateTone(tone.id, 'toneType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="static">Static Tone</option>
            <option value="chirp">Chirping Tone</option>
          </select>
        </div>

        {/* Base Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Frequency (Hz)
          </label>
          <input
            type="range"
            min="20"
            max="20000"
            value={tone.frequency}
            onChange={(e) => onUpdateTone(tone.id, 'frequency', parseInt(e.target.value))}
            className="w-full mb-1"
          />
          <input
            type="number"
            min="20"
            max="20000"
            value={tone.frequency}
            onChange={(e) => onUpdateTone(tone.id, 'frequency', parseInt(e.target.value))}
            className="w-full px-3 py-1 border border-gray-300 rounded text-center"
          />
        </div>

        {/* Volume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={tone.volume}
            onChange={(e) => onUpdateTone(tone.id, 'volume', parseFloat(e.target.value))}
            className="w-full mb-1"
          />
          <div className="text-center text-sm text-gray-600">
            {Math.round(tone.volume * 100)}%
          </div>
        </div>

        {/* Stereo Pan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stereo Pan
          </label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={tone.pan}
            onChange={(e) => onUpdateTone(tone.id, 'pan', parseFloat(e.target.value))}
            className="w-full mb-1"
          />
          <div className="text-center text-sm text-gray-600">
            {tone.pan < -0.1 ? 'Left' : tone.pan > 0.1 ? 'Right' : 'Center'}
          </div>
        </div>

        {/* Waveform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waveform
          </label>
          <select
            value={tone.waveform}
            onChange={(e) => onUpdateTone(tone.id, 'waveform', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="sine">Sine (Pure tone)</option>
            <option value="square">Square (Harsh)</option>
            <option value="sawtooth">Sawtooth (Buzzy)</option>
            <option value="triangle">Triangle (Mellow)</option>
          </select>
        </div>

        {/* Chirp Controls or Static Placeholder */}
        {tone.toneType === 'chirp' ? (
          <ChirpControls tone={tone} onUpdateTone={onUpdateTone} />
        ) : (
          <div className="flex items-center text-sm text-gray-500">
            Static tone - no additional parameters
          </div>
        )}
      </div>

      {/* Tone Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <div className="text-sm text-gray-600">
          <div><strong>Type:</strong> {tone.toneType === 'chirp' ? 'Chirping' : 'Static'} - {tone.waveform}</div>
          <div><strong>Base Frequency:</strong> {tone.frequency} Hz</div>
          <div><strong>Volume:</strong> {Math.round(tone.volume * 100)}%</div>
          <div><strong>Stereo Pan:</strong> {tone.pan < -0.1 ? `Left (${Math.round(Math.abs(tone.pan) * 100)}%)` : tone.pan > 0.1 ? `Right (${Math.round(tone.pan * 100)}%)` : 'Center'}</div>
          {tone.toneType === 'chirp' && (
            <>
              <div><strong>Chirp Range:</strong> {tone.frequency - tone.chirpRange} - {tone.frequency + tone.chirpRange} Hz</div>
              <div><strong>Chirp Speed:</strong> {tone.chirpSpeed} Hz</div>
              <div><strong>Volume Fluctuation:</strong> {Math.round(tone.fluctuationIntensity * 100)}%</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
