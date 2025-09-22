'use client';

export default function VolumeControl({ masterVolume, onMasterVolumeChange }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <label className="text-gray-700 font-medium">Master Volume:</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={masterVolume}
        onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
        className="w-32"
      />
      <span className="text-gray-600">{Math.round(masterVolume * 100)}%</span>
    </div>
  );
}
