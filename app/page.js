'use client';

import { useAudioEngine } from './hooks/useAudioEngine';
import AppHeader from './components/AppHeader';
import AudioControls from './components/AudioControls';
import VolumeControl from './components/VolumeControl';
import ConfigurationControls from './components/ConfigurationControls';
import ToneList from './components/ToneList';
import AppFooter from './components/AppFooter';

export default function TinnitusSimulator() {
  const {
    tones,
    masterVolume,
    isPlaying,
    addTone,
    removeTone,
    updateTone,
    togglePlayback,
    setMasterVolume,
    loadConfiguration,
    saveToUrl,
    clearConfiguration
  } = useAudioEngine();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <AppHeader />
        
        <AudioControls
          isPlaying={isPlaying}
          masterVolume={masterVolume}
          onTogglePlayback={togglePlayback}
          onAddTone={addTone}
          onMasterVolumeChange={setMasterVolume}
        />

        <VolumeControl
          masterVolume={masterVolume}
          onMasterVolumeChange={setMasterVolume}
        />

        <ConfigurationControls
          tones={tones}
          masterVolume={masterVolume}
          onSaveToUrl={saveToUrl}
          onClearConfiguration={clearConfiguration}
          onLoadConfiguration={loadConfiguration}
        />

        <div className="mt-8">
          <ToneList
            tones={tones}
            onUpdateTone={updateTone}
            onRemoveTone={removeTone}
          />
        </div>

        <AppFooter />
      </div>
    </div>
  );
}
