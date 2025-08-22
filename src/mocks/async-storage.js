const AsyncStorage = {
  getItem: async (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  },
  
  setItem: async (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
    }
  },
  
  removeItem: async (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
    }
  },
  
  clear: async () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
    }
  },
  
  getAllKeys: async () => {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('AsyncStorage getAllKeys error:', error);
      return [];
    }
  }
};

export default AsyncStorage;