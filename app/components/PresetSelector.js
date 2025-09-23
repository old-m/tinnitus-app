'use client';

import { getPresetList, getPresetConfig } from '../utils/presets';

export default function PresetSelector({ onLoadPreset }) {
  const presets = getPresetList();

  const handlePresetSelect = (e) => {
    const presetId = e.target.value;
    if (presetId) {
      const config = getPresetConfig(presetId);
      if (config) {
        onLoadPreset(config.tones, config.masterVolume);
      }
    }
    // Reset select to default
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-gray-700 font-medium whitespace-nowrap">
        Quick Presets:
      </label>
      <select
        onChange={handlePresetSelect}
        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        defaultValue=""
      >
        <option value="" disabled>Select a preset...</option>
        {presets.map(preset => (
          <option key={preset.id} value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>
    </div>
  );
}
