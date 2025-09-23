// URL query string utilities for saving and loading tone configurations

export const encodeToneConfig = (tones, masterVolume) => {
  const config = {
    masterVolume,
    tones: tones.map(tone => ({
      frequency: tone.frequency,
      volume: tone.volume,
      waveform: tone.waveform,
      toneType: tone.toneType,
      chirpRange: tone.chirpRange,
      chirpSpeed: tone.chirpSpeed,
      fluctuationIntensity: tone.fluctuationIntensity,
      pan: tone.pan
    }))
  };
  
  // Compress the configuration into a base64 encoded string
  const jsonString = JSON.stringify(config);
  return btoa(jsonString);
};

export const decodeToneConfig = (encodedConfig) => {
  try {
    const jsonString = atob(encodedConfig);
    const config = JSON.parse(jsonString);
    
    // Validate the configuration structure
    if (!config || typeof config.masterVolume !== 'number' || !Array.isArray(config.tones)) {
      throw new Error('Invalid configuration structure');
    }
    
    // Add unique IDs to the tones
    const tonesWithIds = config.tones.map((tone, index) => ({
      id: Date.now() + index,
      frequency: Math.max(20, Math.min(20000, tone.frequency || 440)),
      volume: Math.max(0, Math.min(1, tone.volume || 0.5)),
      waveform: ['sine', 'square', 'sawtooth', 'triangle'].includes(tone.waveform) ? tone.waveform : 'sine',
      toneType: ['static', 'chirp'].includes(tone.toneType) ? tone.toneType : 'static',
      chirpRange: Math.max(50, Math.min(2000, tone.chirpRange || 500)),
      chirpSpeed: Math.max(0.1, Math.min(10, tone.chirpSpeed || 2)),
      fluctuationIntensity: Math.max(0, Math.min(1, tone.fluctuationIntensity || 0.3)),
      pan: Math.max(-1, Math.min(1, tone.pan || 0)),
      oscillator: null,
      gainNode: null,
      panNode: null,
      modulatorOsc: null,
      modulatorGain: null,
      volumeModulator: null,
      volumeModGain: null,
      isActive: false
    }));
    
    return {
      masterVolume: Math.max(0, Math.min(1, config.masterVolume)),
      tones: tonesWithIds
    };
  } catch (error) {
    console.error('Failed to decode tone configuration:', error);
    return null;
  }
};

export const getCurrentUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
};

export const updateUrlWithConfig = (tones, masterVolume) => {
  if (typeof window !== 'undefined') {
    const encodedConfig = encodeToneConfig(tones, masterVolume);
    const url = new URL(window.location);
    url.searchParams.set('config', encodedConfig);
    window.history.replaceState({}, '', url);
    return url.toString();
  }
  return '';
};

export const getConfigFromUrl = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const config = urlParams.get('config');
    if (config) {
      return decodeToneConfig(config);
    }
  }
  return null;
};

export const clearUrlConfig = () => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location);
    url.searchParams.delete('config');
    window.history.replaceState({}, '', url);
  }
};
