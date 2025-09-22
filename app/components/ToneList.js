'use client';

import ToneControl from './ToneControl';

export default function ToneList({ tones, onUpdateTone, onRemoveTone }) {
  if (tones.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-lg">
          No tones created yet. Click &quot;Add New Tone&quot; to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tones.map((tone) => (
        <ToneControl
          key={tone.id}
          tone={tone}
          onUpdateTone={onUpdateTone}
          onRemoveTone={onRemoveTone}
        />
      ))}
    </div>
  );
}
