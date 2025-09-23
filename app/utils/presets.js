// Preset tinnitus configurations for common sounds

export const presetConfigurations = {
  'high-pitched-ringing': {
    name: 'High-Pitched Ringing',
    description: 'Classic high-frequency tinnitus sound',
    masterVolume: 0.3,
    tones: [
      {
        frequency: 8000,
        volume: 0.6,
        waveform: 'sine',
        toneType: 'static',
        chirpRange: 500,
        chirpSpeed: 2,
        fluctuationIntensity: 0.3,
        pan: 0
      }
    ]
  },
  
  'electrical-buzz': {
    name: 'Electrical Buzzing',
    description: 'Buzzing sound like electrical interference',
    masterVolume: 0.25,
    tones: [
      {
        frequency: 6000,
        volume: 0.5,
        waveform: 'square',
        toneType: 'chirp',
        chirpRange: 200,
        chirpSpeed: 5,
        fluctuationIntensity: 0.4,
        pan: 0
      }
    ]
  },
  
  'cricket-sounds': {
    name: 'Cricket-like Chirping',
    description: 'Sounds similar to crickets or insects',
    masterVolume: 0.3,
    tones: [
      {
        frequency: 4000,
        volume: 0.4,
        waveform: 'sine',
        toneType: 'chirp',
        chirpRange: 800,
        chirpSpeed: 3,
        fluctuationIntensity: 0.6,
        pan: -0.3
      },
      {
        frequency: 4500,
        volume: 0.3,
        waveform: 'sine',
        toneType: 'chirp',
        chirpRange: 600,
        chirpSpeed: 2.5,
        fluctuationIntensity: 0.5,
        pan: 0.3
      }
    ]
  },
  
  'ocean-waves': {
    name: 'Ocean Wave Sound',
    description: 'Low-frequency rushing sound like ocean waves',
    masterVolume: 0.4,
    tones: [
      {
        frequency: 200,
        volume: 0.7,
        waveform: 'sawtooth',
        toneType: 'chirp',
        chirpRange: 100,
        chirpSpeed: 0.3,
        fluctuationIntensity: 0.8,
        pan: 0
      }
    ]
  },
  
  'multi-tone': {
    name: 'Multiple Frequencies',
    description: 'Complex tinnitus with multiple simultaneous tones',
    masterVolume: 0.25,
    tones: [
      {
        frequency: 6000,
        volume: 0.4,
        waveform: 'sine',
        toneType: 'static',
        chirpRange: 500,
        chirpSpeed: 2,
        fluctuationIntensity: 0.3,
        pan: -0.5
      },
      {
        frequency: 8500,
        volume: 0.3,
        waveform: 'sine',
        toneType: 'chirp',
        chirpRange: 300,
        chirpSpeed: 4,
        fluctuationIntensity: 0.4,
        pan: 0.5
      },
      {
        frequency: 12000,
        volume: 0.2,
        waveform: 'triangle',
        toneType: 'static',
        chirpRange: 500,
        chirpSpeed: 2,
        fluctuationIntensity: 0.3,
        pan: 0
      }
    ]
  },
  
  'pulsating': {
    name: 'Pulsating Tone',
    description: 'Rhythmic pulsating tinnitus sound',
    masterVolume: 0.3,
    tones: [
      {
        frequency: 5000,
        volume: 0.5,
        waveform: 'sine',
        toneType: 'chirp',
        chirpRange: 50,
        chirpSpeed: 1,
        fluctuationIntensity: 0.9,
        pan: 0
      }
    ]
  }
};

export const getPresetList = () => {
  return Object.keys(presetConfigurations).map(key => ({
    id: key,
    name: presetConfigurations[key].name,
    description: presetConfigurations[key].description
  }));
};

export const getPresetConfig = (presetId) => {
  const preset = presetConfigurations[presetId];
  if (!preset) return null;
  
  // Add unique IDs to the tones
  const tonesWithIds = preset.tones.map((tone, index) => ({
    id: Date.now() + index,
    ...tone,
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
    masterVolume: preset.masterVolume,
    tones: tonesWithIds
  };
};
