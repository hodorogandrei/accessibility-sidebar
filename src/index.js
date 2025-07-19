// Main entry point for the accessibility sidebar
export { default as AccessibilitySidebar } from '../AccessibilitySidebar.jsx';
export { default as AccessibilitySidebarEnhanced } from '../accessibility-sidebar-enhanced.jsx';

// For direct browser usage
if (typeof window !== 'undefined') {
  // Load the enhanced web version for browser usage
  import('../accessibility-sidebar-enhanced.jsx').then(module => {
    window.AccessibilitySidebar = module.default;
  });
}