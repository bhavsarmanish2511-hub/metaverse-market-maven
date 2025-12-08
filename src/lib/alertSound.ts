// Soothing alert sound utility
export function playSoothingAlertTone(pattern: 'critical' | 'info' | 'success' = 'info') {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    
    const patterns = {
      critical: [
        { freq: 440, duration: 150, gap: 100 },
        { freq: 440, duration: 150, gap: 100 },
        { freq: 523, duration: 200, gap: 0 },
      ],
      info: [
        { freq: 523, duration: 100, gap: 50 },
        { freq: 659, duration: 150, gap: 0 },
      ],
      success: [
        { freq: 523, duration: 100, gap: 50 },
        { freq: 659, duration: 100, gap: 50 },
        { freq: 784, duration: 200, gap: 0 },
      ],
    };
    
    const tones = patterns[pattern];
    let timeOffset = 0;
    
    tones.forEach(({ freq, duration, gap }) => {
      const oscillator = audioContext.createOscillator();
      const toneGain = audioContext.createGain();
      
      oscillator.connect(toneGain);
      toneGain.connect(gainNode);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      // Smooth envelope
      toneGain.gain.setValueAtTime(0, audioContext.currentTime + timeOffset / 1000);
      toneGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + (timeOffset + 20) / 1000);
      toneGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + (timeOffset + duration - 20) / 1000);
      toneGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + (timeOffset + duration) / 1000);
      
      oscillator.start(audioContext.currentTime + timeOffset / 1000);
      oscillator.stop(audioContext.currentTime + (timeOffset + duration) / 1000);
      
      timeOffset += duration + gap;
    });
    
    // Cleanup
    setTimeout(() => {
      audioContext.close();
    }, timeOffset + 100);
  } catch (e) {
    console.log('Audio not supported');
  }
}
