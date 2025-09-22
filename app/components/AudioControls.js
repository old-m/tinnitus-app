'use client';

export default function AudioControls({ 
  isPlaying, 
  masterVolume, 
  onTogglePlayback, 
  onAddTone, 
  onMasterVolumeChange 
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <button
        onClick={onTogglePlayback}
        className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
          isPlaying 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isPlaying ? 'Stop All Tones' : 'Play All Tones'}
      </button>
      
      <button
        onClick={onAddTone}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Add New Tone
      </button>
    </div>
  );
}
