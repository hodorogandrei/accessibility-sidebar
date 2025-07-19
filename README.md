# Accessibility Sidebar Toolkit

A comprehensive, lightweight accessibility widget that enhances web and mobile app usability with customizable accessibility features. This toolkit provides both React Native components and web-compatible versions for maximum flexibility.

## 🌟 Features

- **📝 Font Size Control**: Adjust text size with 3 levels (normal, large, very large)
- **🎨 High Contrast Mode**: Toggle between normal and high contrast color schemes
- **📏 Line Height Control**: Adjust spacing between lines of text for better readability
- **🔊 Text-to-Speech**: Read content aloud with multi-language support (Romanian and English)
- **💾 Persistent Settings**: Save and restore user preferences automatically
- **📱 Responsive Design**: Works on mobile, tablet, and desktop devices
- **🎯 Draggable Interface**: Moveable sidebar for optimal positioning

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

```javascript
import { AccessibilitySidebarEnhanced } from 'accessibility-sidebar';

// Initialize the component
const widget = AccessibilitySidebarEnhanced();
document.body.appendChild(widget);
```

### For React Native Applications

```bash
npm install accessibility-sidebar react-native-gesture-handler react-native-safe-area-context @react-native-async-storage/async-storage expo-speech react-native-vector-icons
```

```jsx
import React from 'react';
import { AccessibilitySidebar } from 'accessibility-sidebar';
import YourMainContent from './YourMainContent';

export default function App() {
  return (
    <AccessibilitySidebar>
      <YourMainContent />
    </AccessibilitySidebar>
  );
}
```

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

### React Native Configuration

```jsx
<AccessibilitySidebar
  onFontSizeChange={(size) => console.log('Font size changed:', size)}
  onContrastChange={(enabled) => console.log('High contrast:', enabled)}
  onLineHeightChange={(height) => console.log('Line height:', height)}
  targetContent={targetRef}
>
  <YourApp />
</AccessibilitySidebar>
```

## 📦 Build Options

### For Development
```bash
npm run dev          # Development build with hot reload
npm run build        # Production build
npm run build:minified  # Highly optimized minified build
```

### For Webmasters

The minified version (`accessibility-sidebar.min.js`) is optimized for production use:
- **Small footprint**: ~15KB gzipped
- **No dependencies**: Self-contained
- **Universal compatibility**: Works with any website
- **Easy integration**: Single script tag

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

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Issues: [GitHub Issues](https://github.com/hodorogandrei/accessibility-sidebar/issues)
- 📖 Documentation: [Full Documentation](https://github.com/hodorogandrei/accessibility-sidebar#readme)
- 💬 Community: [Discussions](https://github.com/hodorogandrei/accessibility-sidebar/discussions)

## 🌐 Live Demo

Try the widget in action: [Live Demo](https://hodorogandrei.github.io/accessibility-sidebar/)

---

*Making the web accessible for everyone, one website at a time.* 🌍♿