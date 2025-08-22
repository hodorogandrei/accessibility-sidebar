// Main entry point for the accessibility sidebar

// For browser/web usage, use the enhanced version that doesn't require React Native
if (typeof window !== 'undefined') {
  // Load the enhanced web version for browser usage
  import('../accessibility-sidebar-enhanced.js').then(module => {
    window.AccessibilitySidebar = module.default;
  });
}

// Export the web-compatible versions
export { default as AccessibilitySidebarEnhanced } from '../accessibility-sidebar-enhanced.jsx';
export { default as AccessibilitySidebarVanilla } from '../accessibility-sidebar-enhanced.js';