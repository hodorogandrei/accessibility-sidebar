const Speech = {
  speak: (text, options = {}) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (options.language) {
        utterance.lang = options.language;
      }
      
      if (options.pitch !== undefined) {
        utterance.pitch = options.pitch;
      }
      
      if (options.rate !== undefined) {
        utterance.rate = options.rate;
      }
      
      if (options.onDone) {
        utterance.onend = options.onDone;
      }
      
      if (options.onError) {
        utterance.onerror = options.onError;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser');
      if (options.onError) {
        options.onError({ error: 'Speech synthesis not supported' });
      }
    }
  },
  
  stop: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
  
  isSpeakingAsync: async () => {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  },
  
  getAvailableVoicesAsync: async () => {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices().map(voice => ({
        identifier: voice.voiceURI,
        name: voice.name,
        language: voice.lang,
        quality: voice.localService ? 'Enhanced' : 'Default'
      }));
    }
    return [];
  }
};

export default Speech;
export { Speech };