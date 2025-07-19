import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  GestureHandlerRootView,
  Dimensions,
  Alert,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AccessibilitySidebar = ({ 
  children, 
  targetContent = null,
  onFontSizeChange = null,
  onContrastChange = null,
  onLineHeightChange = null 
}) => {
  const insets = useSafeAreaInsets();
  
  // State management
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [fontSize, setFontSize] = useState(0); // 0: normal, 1: larger, 2: largest
  const [highContrast, setHighContrast] = useState(false);
  const [lineHeight, setLineHeight] = useState(0); // 0: normal, 1: larger, 2: largest
  const [isReading, setIsReading] = useState(false);
  
  // Animation values
  const panelWidth = useState(new Animated.Value(56))[0];
  const translateX = useState(new Animated.Value(16))[0];
  const translateY = useState(new Animated.Value(100))[0];
  
  // Device info
  const isTablet = SCREEN_WIDTH >= 768;
  const isIOS = Platform.OS === 'ios';

  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    saveSettings();
  }, [fontSize, highContrast, lineHeight]);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('@accessibility_settings');
      if (settings) {
        const { fontSize: savedFontSize, highContrast: savedContrast, lineHeight: savedLineHeight } = JSON.parse(settings);
        setFontSize(savedFontSize || 0);
        setHighContrast(savedContrast || false);
        setLineHeight(savedLineHeight || 0);
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        fontSize,
        highContrast,
        lineHeight
      };
      await AsyncStorage.setItem('@accessibility_settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  };

  // Toggle panel visibility
  const togglePanel = () => {
    const newState = !isPanelOpen;
    setIsPanelOpen(newState);
    
    Animated.timing(panelWidth, {
      toValue: newState ? 280 : 56,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Handle font size changes
  const handleFontSizeChange = () => {
    const newSize = (fontSize + 1) % 3;
    setFontSize(newSize);
    
    if (onFontSizeChange) {
      onFontSizeChange(newSize);
    }
  };

  // Handle contrast toggle
  const handleContrastToggle = () => {
    const newState = !highContrast;
    setHighContrast(newState);
    
    if (onContrastChange) {
      onContrastChange(newState);
    }
  };

  // Handle line height changes
  const handleLineHeightChange = () => {
    const newHeight = (lineHeight + 1) % 3;
    setLineHeight(newHeight);
    
    if (onLineHeightChange) {
      onLineHeightChange(newHeight);
    }
  };

  // Handle text-to-speech
  const handleReadAloud = async () => {
    if (isReading) {
      Speech.stop();
      setIsReading(false);
    } else {
      try {
        // Get text content to read
        const textToRead = targetContent || "Conținutul nu este disponibil pentru citire.";
        
        setIsReading(true);
        
        // Configure speech options
        const speechOptions = {
          language: 'ro-RO',
          pitch: 1.0,
          rate: 0.8,
          onStart: () => setIsReading(true),
          onDone: () => setIsReading(false),
          onStopped: () => setIsReading(false),
          onError: () => {
            setIsReading(false);
            Alert.alert('Eroare', 'Nu s-a putut începe citirea cu voce tare.');
          }
        };

        await Speech.speak(textToRead, speechOptions);
      } catch (error) {
        setIsReading(false);
        Alert.alert('Eroare', 'Citirea cu voce tare nu este disponibilă pe acest dispozitiv.');
      }
    }
  };

  // Reset all settings
  const resetAllSettings = () => {
    setFontSize(0);
    setHighContrast(false);
    setLineHeight(0);
    
    if (isReading) {
      Speech.stop();
      setIsReading(false);
    }
    
    // Notify parent components
    if (onFontSizeChange) onFontSizeChange(0);
    if (onContrastChange) onContrastChange(false);
    if (onLineHeightChange) onLineHeightChange(0);
  };

  // Get font size label
  const getFontSizeLabel = () => {
    switch (fontSize) {
      case 0: return 'Normal';
      case 1: return 'Mare';
      case 2: return 'Foarte mare';
      default: return 'Normal';
    }
  };

  // Get line height label
  const getLineHeightLabel = () => {
    switch (lineHeight) {
      case 0: return 'Normal';
      case 1: return 'Mare';
      case 2: return 'Foarte mare';
      default: return 'Normal';
    }
  };

  // Get dynamic styles based on settings
  const getContainerStyle = () => ({
    ...styles.container,
    backgroundColor: highContrast ? '#000' : '#fff',
    borderColor: highContrast ? '#fff' : '#2196F3',
    top: insets.top + 100,
  });

  const getTextStyle = (isActive = false) => ({
    color: isActive 
      ? (highContrast ? '#000' : '#2196F3')
      : (highContrast ? '#fff' : '#333'),
    fontWeight: isActive ? 'bold' : 'normal',
  });

  const getButtonStyle = (isActive = false) => ({
    ...styles.controlButton,
    backgroundColor: isActive 
      ? (highContrast ? '#fff' : '#e3f2fd')
      : (highContrast ? '#333' : '#f5f5f5'),
  });

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <Animated.View
        style={[
          getContainerStyle(),
          {
            width: panelWidth,
            transform: [
              { translateX: translateX },
              { translateY: translateY }
            ]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          {isPanelOpen && (
            <View style={styles.titleContainer}>
              <Icon name="cog" size={20} color={highContrast ? '#fff' : '#2196F3'} />
              <Text style={[styles.title, getTextStyle()]}>Accesibilitate</Text>
            </View>
          )}
          
          <TouchableOpacity
            onPress={togglePanel}
            style={styles.toggleButton}
            accessibilityLabel={isPanelOpen ? "Închide panoul de accesibilitate" : "Deschide panoul de accesibilitate"}
            accessibilityRole="button"
          >
            <Icon 
              name={isPanelOpen ? "compress" : "cog"} 
              size={24} 
              color={highContrast ? '#fff' : '#2196F3'} 
            />
          </TouchableOpacity>
        </View>

        {/* Control Buttons - Only visible when panel is expanded */}
        {isPanelOpen && (
          <View style={styles.controlsContainer}>
            {/* Font Size Control */}
            <TouchableOpacity
              style={getButtonStyle(fontSize > 0)}
              onPress={handleFontSizeChange}
              accessibilityLabel={`Mărime text: ${getFontSizeLabel()}`}
              accessibilityRole="button"
            >
              <Icon name="font" size={20} color={getTextStyle(fontSize > 0).color} />
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonText, getTextStyle(fontSize > 0)]}>
                  Mărime text
                </Text>
                <Text style={[styles.buttonSubtext, getTextStyle(fontSize > 0)]}>
                  {getFontSizeLabel()}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Contrast Control */}
            <TouchableOpacity
              style={getButtonStyle(highContrast)}
              onPress={handleContrastToggle}
              accessibilityLabel={`Contrast: ${highContrast ? 'ridicat' : 'normal'}`}
              accessibilityRole="button"
            >
              <Icon 
                name={highContrast ? "sun" : "moon"} 
                size={20} 
                color={getTextStyle(highContrast).color} 
              />
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonText, getTextStyle(highContrast)]}>
                  Contrast
                </Text>
                <Text style={[styles.buttonSubtext, getTextStyle(highContrast)]}>
                  {highContrast ? 'Ridicat' : 'Normal'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Line Height Control */}
            <TouchableOpacity
              style={getButtonStyle(lineHeight > 0)}
              onPress={handleLineHeightChange}
              accessibilityLabel={`Spațiu între rânduri: ${getLineHeightLabel()}`}
              accessibilityRole="button"
            >
              <Icon 
                name="align-justify" 
                size={20} 
                color={getTextStyle(lineHeight > 0).color} 
              />
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonText, getTextStyle(lineHeight > 0)]}>
                  Spațiu între rânduri
                </Text>
                <Text style={[styles.buttonSubtext, getTextStyle(lineHeight > 0)]}>
                  {getLineHeightLabel()}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Text-to-Speech Control */}
            <TouchableOpacity
              style={getButtonStyle(isReading)}
              onPress={handleReadAloud}
              accessibilityLabel={isReading ? "Oprește citirea" : "Citește cu voce tare"}
              accessibilityRole="button"
            >
              <Icon 
                name={isReading ? "volume-mute" : "volume-up"} 
                size={20} 
                color={getTextStyle(isReading).color} 
              />
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonText, getTextStyle(isReading)]}>
                  {isReading ? "Oprește citirea" : "Citește cu voce tare"}
                </Text>
                <Text style={[styles.buttonSubtext, getTextStyle(isReading)]}>
                  {isReading ? 'Activ' : 'Inactiv'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Reset All Settings */}
            <TouchableOpacity
              style={[styles.controlButton, styles.resetButton, { backgroundColor: highContrast ? '#444' : '#f5f5f5' }]}
              onPress={resetAllSettings}
              accessibilityLabel="Resetează toate setările"
              accessibilityRole="button"
            >
              <Icon name="undo" size={20} color={highContrast ? '#fff' : '#666'} />
              <Text style={[styles.buttonText, { color: highContrast ? '#fff' : '#666' }]}>
                Resetează setările
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status Indicators - Only visible when panel is collapsed */}
        {!isPanelOpen && (
          <View style={styles.statusIndicators}>
            {fontSize > 0 && (
              <View style={[styles.indicator, { backgroundColor: highContrast ? '#fff' : '#2196F3' }]} />
            )}
            {highContrast && (
              <View style={[styles.indicator, { backgroundColor: highContrast ? '#fff' : '#2196F3' }]} />
            )}
            {lineHeight > 0 && (
              <View style={[styles.indicator, { backgroundColor: highContrast ? '#fff' : '#2196F3' }]} />
            )}
            {isReading && (
              <Animated.View 
                style={[
                  styles.indicator, 
                  { backgroundColor: highContrast ? '#fff' : '#2196F3' }
                ]} 
              />
            )}
          </View>
        )}
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    right: 16,
    zIndex: 9999,
    borderWidth: 2,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
  },
  controlsContainer: {
    gap: 12,
    paddingHorizontal: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'left',
  },
  buttonSubtext: {
    fontSize: 12,
    opacity: 0.8,
  },
  resetButton: {
    marginTop: 8,
  },
  statusIndicators: {
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default AccessibilitySidebar;