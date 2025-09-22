'use client';

export default function ChirpControls({ tone, onUpdateTone }) {
  return (
    <div className="space-y-4">
      {/* Chirp Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chirp Range (Hz)
        </label>
        <input
          type="range"
          min="50"
          max="2000"
          value={tone.chirpRange}
          onChange={(e) => onUpdateTone(tone.id, 'chirpRange', parseInt(e.target.value))}
          className="w-full mb-1"
        />
        <div className="text-center text-sm text-gray-600">
          ±{tone.chirpRange} Hz
        </div>
      </div>

      {/* Chirp Speed */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chirp Speed (Hz)
        </label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={tone.chirpSpeed}
          onChange={(e) => onUpdateTone(tone.id, 'chirpSpeed', parseFloat(e.target.value))}
          className="w-full mb-1"
        />
        <div className="text-center text-sm text-gray-600">
          {tone.chirpSpeed} Hz
        </div>
      </div>

      {/* Volume Fluctuation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Volume Fluctuation
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={tone.fluctuationIntensity}
          onChange={(e) => onUpdateTone(tone.id, 'fluctuationIntensity', parseFloat(e.target.value))}
          className="w-full mb-1"
        />
        <div className="text-center text-sm text-gray-600">
          {Math.round(tone.fluctuationIntensity * 100)}%
        </div>
      </div>
    </div>
  );
}
