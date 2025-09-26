'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  createAudioContext, 
  createStaticTone, 
  createChirpTone, 
  stopTone, 
  updateToneParameters 
} from '../utils/audioEngine';
import { 
  getConfigFromUrl, 
  updateUrlWithConfig, 
  clearUrlConfig 
} from '../utils/urlConfig';

export const useAudioEngine = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [tones, setTones] = useState([]);
  const [masterVolume, setMasterVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const tonesRef = useRef([]);

  // Initialize audio context and load configuration from URL
  useEffect(() => {
    const context = createAudioContext();
    setAudioContext(context);
    
    // Load configuration from URL if present
    const urlConfig = getConfigFromUrl();
    if (urlConfig) {
      setTones(urlConfig.tones);
      setMasterVolume(urlConfig.masterVolume);
    }
  }, []);

  // Create a new tone with default settings
  const addTone = () => {
    const newTone = {
      id: Date.now(),
      frequency: 440,
      volume: 0.5,
      waveform: 'sine',
      toneType: 'static',
      chirpRange: 500,
      chirpSpeed: 2,
      fluctuationIntensity: 0.3,
      pan: 0,
      oscillator: null,
      gainNode: null,
      panNode: null,
      modulatorOsc: null,
      modulatorGain: null,
      volumeModulator: null,
      volumeModGain: null,
      isActive: false
    };
    setTones(prev => [...prev, newTone]);
  };

  // Remove a tone
  const removeTone = (id) => {
    const tone = tonesRef.current.find(t => t.id === id);
    if (tone) {
      stopTone(tone);
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
      tonesRef.current.forEach(stopTone);
      tonesRef.current = [];
      setIsPlaying(false);
    } else {
      // Start all tones
      const masterGain = audioContext.createGain();
      masterGain.gain.value = masterVolume;
      masterGain.connect(audioContext.destination);

      tones.forEach(toneConfig => {
        let activeTone;
        
        if (toneConfig.toneType === 'chirp') {
          activeTone = createChirpTone(audioContext, toneConfig, masterGain);
        } else {
          activeTone = createStaticTone(audioContext, toneConfig, masterGain);
        }

        tonesRef.current.push(activeTone);
      });

      setIsPlaying(true);
    }
  };

  // Update live parameters and handle waveform changes
  useEffect(() => {
    if (isPlaying) {
      let needsRestart = false;
      
      tonesRef.current.forEach(activeTone => {
        const toneConfig = tones.find(t => t.id === activeTone.id);
        if (toneConfig) {
          // Check if waveform or tone type has changed - these require a restart
          if (activeTone.oscillator.type !== toneConfig.waveform || 
              activeTone.toneType !== toneConfig.toneType) {
            needsRestart = true;
          } else {
            updateToneParameters(activeTone, toneConfig);
          }
        }
      });
      
      // If any tone needs a waveform change, restart all audio
      if (needsRestart) {
        // Stop current tones
        tonesRef.current.forEach(stopTone);
        tonesRef.current = [];
        
        // Restart with new configuration
        const masterGain = audioContext.createGain();
        masterGain.gain.value = masterVolume;
        masterGain.connect(audioContext.destination);

        tones.forEach(toneConfig => {
          let activeTone;
          
          if (toneConfig.toneType === 'chirp') {
            activeTone = createChirpTone(audioContext, toneConfig, masterGain);
          } else {
            activeTone = createStaticTone(audioContext, toneConfig, masterGain);
          }

          tonesRef.current.push(activeTone);
        });
      }
    }
  }, [tones, isPlaying, audioContext, masterVolume]);

  // Auto-save configuration to URL when tones or master volume changes
  useEffect(() => {
    if (tones.length > 0) {
      updateUrlWithConfig(tones, masterVolume);
    }
  }, [tones, masterVolume]);

  // Load configuration from encoded string
  const loadConfiguration = (tones, masterVolume) => {
    // Stop current playback if active
    if (isPlaying) {
      tonesRef.current.forEach(stopTone);
      tonesRef.current = [];
      setIsPlaying(false);
    }
    
    setTones(tones);
    setMasterVolume(masterVolume);
  };

  // Save current configuration to URL
  const saveToUrl = () => {
    const url = updateUrlWithConfig(tones, masterVolume);
    return url;
  };

  // Clear configuration and reset URL
  const clearConfiguration = () => {
    // Stop current playback if active
    if (isPlaying) {
      tonesRef.current.forEach(stopTone);
      tonesRef.current = [];
      setIsPlaying(false);
    }
    
    setTones([]);
    setMasterVolume(0.3);
    clearUrlConfig();
  };

  return {
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
  };
};
