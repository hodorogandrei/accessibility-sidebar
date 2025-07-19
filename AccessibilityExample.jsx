import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AccessibilitySidebar from './AccessibilitySidebar';

const AccessibilityExample = () => {
  // State for accessibility settings
  const [fontSize, setFontSize] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);

  // Sample content for the test
  const sampleContent = `
    Testul RAADS-R (Ritvo Autism Asperger Diagnostic Scale-Revised) este un instrument de screening pentru identificarea trăsăturilor autiste la adulți. 

    Acest test a fost dezvoltat pentru a ajuta la identificarea persoanelor care ar putea beneficia de o evaluare clinică formală pentru tulburările din spectrul autist.

    Testul constă în 80 de întrebări care evaluează patru domenii principale:
    
    1. Limbaj - Dificultăți în comunicarea verbală și nonverbală
    2. Relaționare socială - Provocări în interacțiunile sociale
    3. Senzorial-motor - Sensibilități și comportamente repetitive
    4. Interese circumscrise - Interese intense și focalizate

    Este important de reținut că acest test nu oferă un diagnostic medical și nu înlocuiește o evaluare profesională efectuată de un specialist în sănătatea mintală.
  `;

  // Calculate dynamic styles based on accessibility settings
  const getDynamicStyles = () => {
    const baseFontSize = 16;
    const fontSizeMultiplier = fontSize === 0 ? 1 : fontSize === 1 ? 1.25 : 1.5;
    const calculatedFontSize = baseFontSize * fontSizeMultiplier;
    
    const baseLineHeight = 1.4;
    const lineHeightMultiplier = lineHeight === 0 ? 1 : lineHeight === 1 ? 1.14 : 1.29;
    const calculatedLineHeight = baseLineHeight * lineHeightMultiplier;

    return {
      fontSize: calculatedFontSize,
      lineHeight: calculatedFontSize * calculatedLineHeight,
      color: highContrast ? '#ffffff' : '#333333',
      backgroundColor: highContrast ? '#000000' : '#ffffff'
    };
  };

  const textStyles = getDynamicStyles();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar 
          barStyle={highContrast ? 'light-content' : 'dark-content'}
          backgroundColor={highContrast ? '#000000' : '#ffffff'}
        />
        
        <SafeAreaView style={[styles.safeArea, { backgroundColor: textStyles.backgroundColor }]}>
          <ScrollView 
            style={[styles.scrollView, { backgroundColor: textStyles.backgroundColor }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, textStyles]}>
                Test de Accesibilitate
              </Text>
              <Text style={[styles.subtitle, textStyles, { opacity: 0.8 }]}>
                Demonstrație AccessibilitySidebar pentru React Native
              </Text>
            </View>

            {/* Sample Content Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles]}>
                Despre testul RAADS-R
              </Text>
              <Text style={[styles.bodyText, textStyles]}>
                {sampleContent}
              </Text>
            </View>

            {/* Features Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles]}>
                Funcții de Accesibilitate
              </Text>
              
              <View style={styles.featureList}>
                <Text style={[styles.featureItem, textStyles]}>
                  📝 <Text style={styles.featureBold}>Mărime text:</Text> {fontSize === 0 ? 'Normal' : fontSize === 1 ? 'Mare' : 'Foarte mare'}
                </Text>
                
                <Text style={[styles.featureItem, textStyles]}>
                  🎨 <Text style={styles.featureBold}>Contrast:</Text> {highContrast ? 'Ridicat' : 'Normal'}
                </Text>
                
                <Text style={[styles.featureItem, textStyles]}>
                  📏 <Text style={styles.featureBold}>Spațiu între rânduri:</Text> {lineHeight === 0 ? 'Normal' : lineHeight === 1 ? 'Mare' : 'Foarte mare'}
                </Text>
              </View>
            </View>

            {/* Instructions Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles]}>
                Cum să folosești panoul de accesibilitate
              </Text>
              
              <Text style={[styles.bodyText, textStyles]}>
                1. Apasă pe iconița <Text style={styles.icon}>⚙️</Text> din colțul drept pentru a deschide panoul de accesibilitate.
              </Text>
              
              <Text style={[styles.bodyText, textStyles]}>
                2. Ajustează mărimea textului folosind butonul "Mărime text".
              </Text>
              
              <Text style={[styles.bodyText, textStyles]}>
                3. Activează modul contrast ridicat pentru o mai bună vizibilitate.
              </Text>
              
              <Text style={[styles.bodyText, textStyles]}>
                4. Mărește spațiul dintre rânduri pentru o lectură mai confortabilă.
              </Text>
              
              <Text style={[styles.bodyText, textStyles]}>
                5. Folosește funcția "Citește cu voce tare" pentru a audia conținutul.
              </Text>
              
              <Text style={[styles.bodyText, textStyles]}>
                6. Toate setările sunt salvate automat și vor fi restaurate la următoarea utilizare.
              </Text>
            </View>

            {/* Accessibility Statement */}
            <View style={[styles.accessibilityStatement, { 
              backgroundColor: highContrast ? '#222222' : '#f0f7ff',
              borderColor: highContrast ? '#555555' : '#2196F3'
            }]}>
              <Text style={[styles.statementTitle, textStyles]}>
                Declarație de Accesibilitate
              </Text>
              <Text style={[styles.statementText, textStyles]}>
                Această aplicație a fost dezvoltată urmând standardele WCAG 2.1 AA pentru a fi accesibilă tuturor utilizatorilor, 
                inclusiv celor cu dizabilități vizuale, auditive sau cognitive.
              </Text>
            </View>

            {/* Bottom spacing for the floating sidebar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Accessibility Sidebar */}
          <AccessibilitySidebar
            targetContent={sampleContent}
            onFontSizeChange={setFontSize}
            onContrastChange={setHighContrast}
            onLineHeightChange={setLineHeight}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Extra space for the floating sidebar
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'justify',
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 8,
  },
  featureBold: {
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 18,
  },
  accessibilityStatement: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
  },
  statementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statementText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 80,
  },
});

export default AccessibilityExample;