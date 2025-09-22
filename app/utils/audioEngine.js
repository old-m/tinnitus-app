// Audio engine utilities for tone generation and management

export const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || window.webkitAudioContext)();
  }
  return null;
};

export const createStaticTone = (audioContext, toneConfig, masterGain) => {
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

  return {
    ...toneConfig,
    oscillator,
    gainNode,
    panNode,
    isActive: true
  };
};

export const createChirpTone = (audioContext, toneConfig, masterGain) => {
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

  return {
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
};

export const stopTone = (tone) => {
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
};

export const updateToneParameters = (activeTone, toneConfig) => {
  if (!activeTone.oscillator || !activeTone.gainNode) return;

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
};
