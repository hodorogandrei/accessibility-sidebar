// Mock for react-native-safe-area-context
// This provides web-compatible implementations for SafeAreaProvider and SafeAreaView

import React from 'react';

// Mock SafeAreaProvider - just passes through children
export const SafeAreaProvider = ({ children, ...props }) => {
  return React.createElement('div', props, children);
};

// Mock SafeAreaView - renders as a regular div
export const SafeAreaView = ({ style, children, ...props }) => {
  return React.createElement('div', {
    style: {
      ...style,
      // Provide default safe area styling for web
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    },
    ...props
  }, children);
};

// Mock hooks
export const useSafeAreaInsets = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
});

export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: window.innerWidth || 0,
  height: window.innerHeight || 0
});

// Default export
export default {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
  useSafeAreaFrame
};