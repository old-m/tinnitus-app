// URL query string utilities for saving and loading tone configurations

export const encodeToneConfig = (tones, masterVolume) => {
  // Use individual query parameters for each setting
  const params = new URLSearchParams();
  
  // Add master volume
  params.set('mv', masterVolume.toString());
  
  // Add each tone as separate parameters
  tones.forEach((tone, index) => {
    const prefix = `t${index}`;
    params.set(`${prefix}_freq`, tone.frequency.toString());
    params.set(`${prefix}_vol`, tone.volume.toString());
    params.set(`${prefix}_wave`, tone.waveform);
    params.set(`${prefix}_type`, tone.toneType);
    
    if (tone.toneType === 'chirp') {
      params.set(`${prefix}_range`, tone.chirpRange.toString());
      params.set(`${prefix}_speed`, tone.chirpSpeed.toString());
      params.set(`${prefix}_fluct`, tone.fluctuationIntensity.toString());
    }
    
    if (tone.pan !== 0) {
      params.set(`${prefix}_pan`, tone.pan.toString());
    }
  });
  
  return params.toString();
};

export const decodeToneConfig = (queryString) => {
  try {
    const params = new URLSearchParams(queryString);
    
    // Get master volume
    const masterVolume = Math.max(0, Math.min(1, parseFloat(params.get('mv')) || 0.3));
    
    // Extract tones
    const tones = [];
    let toneIndex = 0;
    
    while (params.has(`t${toneIndex}_freq`)) {
      const prefix = `t${toneIndex}`;
      
      const tone = {
        id: Date.now() + toneIndex,
        frequency: Math.max(20, Math.min(20000, parseInt(params.get(`${prefix}_freq`)) || 440)),
        volume: Math.max(0, Math.min(1, parseFloat(params.get(`${prefix}_vol`)) || 0.5)),
        waveform: ['sine', 'square', 'sawtooth', 'triangle'].includes(params.get(`${prefix}_wave`)) 
          ? params.get(`${prefix}_wave`) : 'sine',
        toneType: ['static', 'chirp'].includes(params.get(`${prefix}_type`)) 
          ? params.get(`${prefix}_type`) : 'static',
        chirpRange: Math.max(50, Math.min(2000, parseInt(params.get(`${prefix}_range`)) || 500)),
        chirpSpeed: Math.max(0.1, Math.min(10, parseFloat(params.get(`${prefix}_speed`)) || 2)),
        fluctuationIntensity: Math.max(0, Math.min(1, parseFloat(params.get(`${prefix}_fluct`)) || 0.3)),
        pan: Math.max(-1, Math.min(1, parseFloat(params.get(`${prefix}_pan`)) || 0)),
        oscillator: null,
        gainNode: null,
        panNode: null,
        modulatorOsc: null,
        modulatorGain: null,
        volumeModulator: null,
        volumeModGain: null,
        isActive: false
      };
      
      tones.push(tone);
      toneIndex++;
    }
    
    return {
      masterVolume,
      tones
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
    const queryString = encodeToneConfig(tones, masterVolume);
    const url = new URL(window.location);
    
    // Clear existing tone parameters
    const keysToDelete = [];
    url.searchParams.forEach((value, key) => {
      if (key === 'mv' || key.startsWith('t')) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => url.searchParams.delete(key));
    
    // Add new parameters
    const newParams = new URLSearchParams(queryString);
    newParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    
    window.history.replaceState({}, '', url);
    return url.toString();
  }
  return '';
};

export const getConfigFromUrl = () => {
  if (typeof window !== 'undefined') {
    const queryString = window.location.search.substring(1);
    if (queryString) {
      return decodeToneConfig(queryString);
    }
  }
  return null;
};

export const clearUrlConfig = () => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location);
    
    // Clear all tone-related parameters
    const keysToDelete = [];
    url.searchParams.forEach((value, key) => {
      if (key === 'mv' || key.startsWith('t')) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => url.searchParams.delete(key));
    
    window.history.replaceState({}, '', url);
  }
};
