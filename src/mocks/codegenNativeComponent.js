// Mock for react-native/Libraries/Utilities/codegenNativeComponent
// This is a web compatibility shim for React Native's codegenNativeComponent

import React from 'react';

// Simple mock that returns a basic div component
export default function codegenNativeComponent(name) {
  return React.forwardRef((props, ref) => {
    const { style, children, ...otherProps } = props;
    return React.createElement('div', {
      ref,
      style,
      ...otherProps
    }, children);
  });
}