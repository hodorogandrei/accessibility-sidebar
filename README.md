# Accessibility Sidebar

A comprehensive, lightweight accessibility widget that enhances web and mobile app usability with customizable accessibility features. This toolkit provides both React components and vanilla JavaScript implementations for maximum flexibility.

## 💜 Personal Mission

This project is deeply personal to me. As someone passionate about neurodivergent advocacy, I've dedicated my life to creating inclusive digital experiences. Through my work at AboutADHD.com, About ADHD Romania, and Asociația SuntAutist, I've seen firsthand how accessibility barriers can exclude and frustrate neurodivergent individuals.

Every line of code in this project represents my commitment to breaking down these barriers. This isn't just a technical tool—it's a bridge to digital inclusion for ADHD, autistic, and other neurodivergent communities who deserve equal access to the digital world.

## 🌟 Features

- **📝 Font Size Control**: Adjust text size with 3 levels (normal, large, very large)
- **🎨 High Contrast Mode**: Toggle between normal and high contrast color schemes
- **📏 Line Height Control**: Adjust spacing between lines of text for better readability
- **🔊 Text-to-Speech**: Read content aloud with multi-language support (Romanian and English)
- **💾 Persistent Settings**: Save and restore user preferences automatically
- **📱 Responsive Design**: Works on mobile, tablet, and desktop devices
- **🎯 Draggable Interface**: Moveable sidebar for optimal positioning
- **⚡ Zero Dependencies**: Standalone vanilla JS version requires no external libraries
- **📦 Multiple Formats**: Available as React component, enhanced JSX, and vanilla JS

## 🏆 Compliance Standards

- ✅ WCAG 2.1 AA Compliant
- ✅ Section 508 Compliant
- ✅ ADA Compliant
- ✅ EN 301 549 Compliant

## 🚀 Quick Start

### For Web Applications

#### CDN Installation (Easiest)
```html
<!-- Add to your HTML head -->
<script src="https://unpkg.com/accessibility-sidebar@latest/dist/accessibility-sidebar.min.js"></script>

<!-- Initialize anywhere in your body -->
<script>
  // The widget will automatically appear on your page
  window.AccessibilitySidebar();
</script>
```

#### NPM Installation
```bash
npm install accessibility-sidebar
```

**Vanilla JavaScript:**
```javascript
import AccessibilitySidebar from 'accessibility-sidebar/accessibility-sidebar-enhanced.js';

// Initialize the component
const widget = new AccessibilitySidebar();
document.body.appendChild(widget.element);
```

**React Component:**
```jsx
import React from 'react';
import AccessibilitySidebar from 'accessibility-sidebar/AccessibilitySidebar.jsx';

export default function App() {
  return (
    <div>
      <AccessibilitySidebar />
      <main>Your app content here</main>
    </div>
  );
}
```

### Available Components

This package includes multiple implementation options:

- **`AccessibilitySidebar.jsx`** - Main React component  
- **`accessibility-sidebar-enhanced.js`** - Vanilla JavaScript version
- **`accessibility-sidebar-enhanced.jsx`** - Enhanced React component with additional features
- **`AccessibilityExample.jsx`** - Usage example and demo component

## 🛠️ Advanced Configuration

### Web Configuration

```javascript
// Custom configuration
window.AccessibilitySidebar({
  position: { x: 20, y: 100 },
  theme: 'dark',
  languages: ['en', 'ro'],
  features: {
    fontSize: true,
    contrast: true,
    lineHeight: true,
    textToSpeech: true
  }
});
```

### React Component Configuration

```jsx
import AccessibilitySidebar from 'accessibility-sidebar/AccessibilitySidebar.jsx';

<AccessibilitySidebar
  onFontSizeChange={(size) => console.log('Font size changed:', size)}
  onContrastChange={(enabled) => console.log('High contrast:', enabled)}
  onLineHeightChange={(height) => console.log('Line height:', height)}
  initialPosition={{ x: 20, y: 100 }}
  theme="light"
/>
```

## 💻 Development Setup

### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn package manager

### Environment Configuration
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Configure your development settings in `.env`:
   ```bash
   # Git Configuration (for development)
   GIT_AUTHOR_EMAIL=your-email@example.com
   GIT_AUTHOR_NAME=Your Name
   
   # Development Settings
   NODE_ENV=development
   ```

### Build Commands

```bash
npm run dev          # Development build with hot reload
npm run build        # Production build
npm run build:minified  # Highly optimized minified build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Repository Structure

```
accessibility-sidebar/
├── src/
│   └── index.js                          # Webpack entry point
├── AccessibilitySidebar.jsx              # Main React component
├── accessibility-sidebar-enhanced.js     # Vanilla JS implementation
├── accessibility-sidebar-enhanced.jsx    # Enhanced React component
├── AccessibilityExample.jsx              # Usage examples
├── webpack.config.js                     # Build configuration
├── .babelrc                              # Babel configuration
├── .env.example                          # Environment template
└── dist/                                 # Built files (generated)
```

### Build Output

The build process generates optimized files in the `dist/` directory:
- **`accessibility-sidebar.js`** - Development build
- **`accessibility-sidebar.min.js`** - Production minified build (~15KB gzipped)
- **No dependencies**: Self-contained and universal compatibility

## 🎯 Use Cases

- **E-commerce websites**: Improve shopping experience for users with disabilities
- **Educational platforms**: Enhance readability for students
- **Government websites**: Meet accessibility compliance requirements
- **Mobile applications**: Provide accessible interfaces across devices
- **Corporate websites**: Demonstrate commitment to digital inclusion

## 🔧 Customization

### Styling
The widget respects your site's CSS custom properties and can be styled to match your brand:

```css
:root {
  --accessibility-primary-color: #007bff;
  --accessibility-background: #ffffff;
  --accessibility-text-color: #333333;
}
```

### Event Handling
```javascript
// Listen for accessibility changes
document.addEventListener('accessibilityChange', (event) => {
  console.log('Accessibility setting changed:', event.detail);
});
```

## 📱 Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

CC BY-NC-SA 4.0 International License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and inquiries, contact: contact@andreihodorog.com

---

*Making the web accessible for everyone, one website at a time.* 🌍♿