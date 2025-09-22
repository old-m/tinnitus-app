'use client';

import { useState, useEffect, useRef } from 'react';

export default function TinnitusSimulator() {
  const [audioContext, setAudioContext] = useState(null);
  const [tones, setTones] = useState([]);
  const [masterVolume, setMasterVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const tonesRef = useRef([]);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);
    }
  }, []);

  // Create a new tone
  const addTone = () => {
    const newTone = {
      id: Date.now(),
      frequency: 440,
      volume: 0.5,
      waveform: 'sine',
      toneType: 'static', // 'static' or 'chirp'
      chirpRange: 500, // frequency range for chirp
      chirpSpeed: 2, // chirp speed in Hz
      fluctuationIntensity: 0.3, // random volume fluctuation intensity
      pan: 0, // stereo panning: -1 (left) to 1 (right)
      oscillator: null,
      gainNode: null,
      panNode: null, // for stereo panning
      modulatorOsc: null, // for frequency modulation
      modulatorGain: null, // for frequency modulation gain
      volumeModulator: null, // for volume fluctuation
      volumeModGain: null, // for volume fluctuation gain
      isActive: false
    };
    setTones(prev => [...prev, newTone]);
  };

  // Remove a tone
  const removeTone = (id) => {
    const tone = tonesRef.current.find(t => t.id === id);
    if (tone) {
      if (tone.oscillator) {
        tone.oscillator.stop();
        tone.oscillator.disconnect();
      }
      if (tone.modulatorOsc) {
        tone.modulatorOsc.stop();
        tone.modulatorOsc.disconnect();
      }
      if (tone.volumeModulator) {
        tone.volumeModulator.stop();
        tone.volumeModulator.disconnect();
      }
      if (tone.panNode) {
        tone.panNode.disconnect();
      }
      if (tone.gainNode) {
        tone.gainNode.disconnect();
      }
    }
    setTones(prev => prev.filter(t => t.id !== id));
    tonesRef.current = tonesRef.current.filter(t => t.id !== id);
  };

  // Update tone properties
  const updateTone = (id, property, value) => {
    setTones(prev => prev.map(tone => 
      tone.id === id ? { ...tone, [property]: value } : tone
    ));
  };

  // Start/stop all tones
  const togglePlayback = async () => {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    if (isPlaying) {
      // Stop all tones
      tonesRef.current.forEach(tone => {
        if (tone.oscillator) {
          tone.oscillator.stop();
          tone.oscillator.disconnect();
        }
        if (tone.modulatorOsc) {
          tone.modulatorOsc.stop();
          tone.modulatorOsc.disconnect();
        }
        if (tone.volumeModulator) {
          tone.volumeModulator.stop();
          tone.volumeModulator.disconnect();
        }
      });
      tonesRef.current = [];
      setIsPlaying(false);
    } else {
      // Start all tones
      const masterGain = audioContext.createGain();
      masterGain.gain.value = masterVolume;
      masterGain.connect(audioContext.destination);

      tones.forEach(toneConfig => {
        if (toneConfig.toneType === 'chirp') {
          // Create chirp tone with frequency modulation and volume fluctuation
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          const panNode = audioContext.createStereoPanner();
          
          // Frequency modulation for chirp effect
          const modulatorOsc = audioContext.createOscillator();
          const modulatorGain = audioContext.createGain();
          
          modulatorOsc.type = 'sine';
          modulatorOsc.frequency.value = toneConfig.chirpSpeed;
          modulatorGain.gain.value = toneConfig.chirpRange;
          
          modulatorOsc.connect(modulatorGain);
          modulatorGain.connect(oscillator.frequency);
          
          // Volume fluctuation with random LFO
          const volumeModulator = audioContext.createOscillator();
          const volumeModGain = audioContext.createGain();
          
          volumeModulator.type = 'sine';
          volumeModulator.frequency.value = 0.5 + Math.random() * 2; // Random fluctuation speed
          volumeModGain.gain.value = toneConfig.fluctuationIntensity * toneConfig.volume;
          
          volumeModulator.connect(volumeModGain);
          volumeModGain.connect(gainNode.gain);
          
          oscillator.type = toneConfig.waveform;
          oscillator.frequency.value = toneConfig.frequency;
          gainNode.gain.value = toneConfig.volume;
          panNode.pan.value = toneConfig.pan;

          oscillator.connect(gainNode);
          gainNode.connect(panNode);
          panNode.connect(masterGain);

          oscillator.start();
          modulatorOsc.start();
          volumeModulator.start();

          const activeTone = {
            ...toneConfig,
            oscillator,
            gainNode,
            panNode,
            modulatorOsc,
            modulatorGain,
            volumeModulator,
            volumeModGain,
            isActive: true
          };

          tonesRef.current.push(activeTone);
        } else {
          // Create static tone (original behavior)
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          const panNode = audioContext.createStereoPanner();

          oscillator.type = toneConfig.waveform;
          oscillator.frequency.value = toneConfig.frequency;
          gainNode.gain.value = toneConfig.volume;
          panNode.pan.value = toneConfig.pan;

          oscillator.connect(gainNode);
          gainNode.connect(panNode);
          panNode.connect(masterGain);

          oscillator.start();

          const activeTone = {
            ...toneConfig,
            oscillator,
            gainNode,
            panNode,
            isActive: true
          };

          tonesRef.current.push(activeTone);
        }
      });

      setIsPlaying(true);
    }
  };

  // Update live parameters
  useEffect(() => {
    if (isPlaying) {
      tonesRef.current.forEach(activeTone => {
        const toneConfig = tones.find(t => t.id === activeTone.id);
        if (toneConfig && activeTone.oscillator && activeTone.gainNode) {
          // Update common parameters for both static and chirp tones
          activeTone.oscillator.frequency.value = toneConfig.frequency;
          activeTone.gainNode.gain.value = toneConfig.volume;
          
          // Update panning
          if (activeTone.panNode) {
            activeTone.panNode.pan.value = toneConfig.pan;
          }
          
          if (toneConfig.toneType === 'chirp') {
            // Update chirp-specific parameters
            if (activeTone.modulatorOsc) {
              activeTone.modulatorOsc.frequency.value = toneConfig.chirpSpeed;
            }
            if (activeTone.modulatorGain) {
              activeTone.modulatorGain.gain.value = toneConfig.chirpRange;
            }
            if (activeTone.volumeModGain) {
              activeTone.volumeModGain.gain.value = toneConfig.fluctuationIntensity * toneConfig.volume;
            }
          }
        }
      });
    }
  }, [tones, isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Tinnitus Audio Simulator
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Create and layer audio tones to simulate different types of tinnitus sounds.<br/>
            Choose between static tones or dynamic chirping sounds with random volume fluctuations.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={togglePlayback}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isPlaying ? 'Stop All Tones' : 'Play All Tones'}
            </button>
            
            <button
              onClick={addTone}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Add New Tone
            </button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <label className="text-gray-700 font-medium">Master Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-gray-600">{Math.round(masterVolume * 100)}%</span>
          </div>
        </header>

        <div className="space-y-4">
          {tones.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">
                No tones created yet. Click &quot;Add New Tone&quot; to get started.
              </p>
            </div>
          ) : (
            tones.map((tone) => (
              <div key={tone.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Tone {tone.id}
                  </h3>
                  <button
                    onClick={() => removeTone(tone.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone Type
                    </label>
                    <select
                      value={tone.toneType}
                      onChange={(e) => updateTone(tone.id, 'toneType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="static">Static Tone</option>
                      <option value="chirp">Chirping Tone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Frequency (Hz)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="20000"
                      value={tone.frequency}
                      onChange={(e) => updateTone(tone.id, 'frequency', parseInt(e.target.value))}
                      className="w-full mb-1"
                    />
                    <input
                      type="number"
                      min="20"
                      max="20000"
                      value={tone.frequency}
                      onChange={(e) => updateTone(tone.id, 'frequency', parseInt(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-center"
                    />
                  </div>

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
                      onChange={(e) => updateTone(tone.id, 'volume', parseFloat(e.target.value))}
                      className="w-full mb-1"
                    />
                    <div className="text-center text-sm text-gray-600">
                      {Math.round(tone.volume * 100)}%
                    </div>
                  </div>

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
                      onChange={(e) => updateTone(tone.id, 'pan', parseFloat(e.target.value))}
                      className="w-full mb-1"
                    />
                    <div className="text-center text-sm text-gray-600">
                      {tone.pan < -0.1 ? 'Left' : tone.pan > 0.1 ? 'Right' : 'Center'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waveform
                    </label>
                    <select
                      value={tone.waveform}
                      onChange={(e) => updateTone(tone.id, 'waveform', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sine">Sine (Pure tone)</option>
                      <option value="square">Square (Harsh)</option>
                      <option value="sawtooth">Sawtooth (Buzzy)</option>
                      <option value="triangle">Triangle (Mellow)</option>
                    </select>
                  </div>

                  {tone.toneType === 'chirp' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chirp Range (Hz)
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="2000"
                          value={tone.chirpRange}
                          onChange={(e) => updateTone(tone.id, 'chirpRange', parseInt(e.target.value))}
                          className="w-full mb-1"
                        />
                        <div className="text-center text-sm text-gray-600">
                          ±{tone.chirpRange} Hz
                        </div>
                      </div>

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
                          onChange={(e) => updateTone(tone.id, 'chirpSpeed', parseFloat(e.target.value))}
                          className="w-full mb-1"
                        />
                        <div className="text-center text-sm text-gray-600">
                          {tone.chirpSpeed} Hz
                        </div>
                      </div>

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
                          onChange={(e) => updateTone(tone.id, 'fluctuationIntensity', parseFloat(e.target.value))}
                          className="w-full mb-1"
                        />
                        <div className="text-center text-sm text-gray-600">
                          {Math.round(tone.fluctuationIntensity * 100)}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-gray-500">
                      Static tone - no additional parameters
                    </div>
                  )}
                </div>

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
            ))
          )}
        </div>

        <footer className="mt-12 text-center text-gray-600">
          <p className="mb-2">
            <strong>Note:</strong> This simulator is for educational purposes to help others understand tinnitus.
          </p>
          <p>
            Use headphones for the best experience. Start with low volumes and adjust gradually.
          </p>
        </footer>
      </div>
    </div>
  );
}
