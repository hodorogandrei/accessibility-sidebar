# Contributing to Accessibility Sidebar

Thank you for your interest in contributing to the Accessibility Sidebar project! This project is deeply rooted in neurodivergent advocacy and digital inclusion, and we welcome contributions from developers who share our mission of making the web accessible for everyone.

## 🌟 Our Mission

This project exists to break down digital barriers for neurodivergent individuals, including those with ADHD, autism, and other accessibility needs. Every contribution helps build a more inclusive web.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Types](#contribution-types)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community and Support](#community-and-support)

## 🤝 Code of Conduct

### Our Commitment

We are committed to creating an inclusive, welcoming environment for all contributors, especially those from neurodivergent communities. We welcome contributors of all backgrounds, abilities, and experience levels.

### Expected Behavior

- Use inclusive language and be respectful of diverse perspectives
- Be patient and understanding, especially with newcomers
- Focus on constructive feedback and collaborative problem-solving
- Respect accessibility requirements and inclusive design principles
- Give credit where credit is due

### Unacceptable Behavior

- Discrimination based on neurodivergence, disability, or any personal characteristic
- Dismissing accessibility concerns or requirements
- Hostile or inflammatory language
- Any form of harassment or exclusionary behavior

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 7.0.0 or higher (comes with Node.js)
- **Git**: For version control
- Basic knowledge of JavaScript, React, and accessibility principles

### First-Time Contributors

Looking for a good place to start? Look for issues labeled with:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community help needed
- `accessibility` - Accessibility-focused improvements
- `documentation` - Documentation improvements

## 🛠️ Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/accessibility-sidebar.git
cd accessibility-sidebar
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your development settings in .env
# Set your Git author information for commits
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Development Commands

```bash
# Start development build with hot reload
npm run dev

# Build for production
npm run build

# Build minified version
npm run build:minified

# Run linting
npm run lint

# Format code
npm run format
```

## 🎯 Contribution Types

### Code Contributions

- **New Features**: Accessibility tools and enhancements
- **Bug Fixes**: Resolving issues that affect accessibility or functionality
- **Performance**: Optimizations that improve user experience
- **Browser Compatibility**: Ensuring wide device and browser support

### Non-Code Contributions

- **Documentation**: Improving guides, examples, and API documentation
- **Accessibility Testing**: Manual testing with assistive technologies
- **Translations**: Multi-language support (especially Romanian and English)
- **Design**: UX/UI improvements that enhance accessibility
- **Community**: Helping other contributors and users

## 🔄 Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/voice-navigation` - New features
- `fix/contrast-mode-bug` - Bug fixes
- `docs/setup-guide` - Documentation updates
- `accessibility/screen-reader-support` - Accessibility improvements

### Commit Messages

Follow conventional commit format:

```
type: brief description

Detailed explanation if needed (optional)

- List specific changes
- Reference any issues (#123)
```

**Types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting (no functional changes)
- `refactor:` - Code restructuring (no functional changes)
- `test:` - Adding or updating tests
- `accessibility:` - Accessibility improvements
- `perf:` - Performance improvements

**Examples:**
```
feat: add keyboard navigation for sidebar controls

Implements full keyboard support for all sidebar functions
- Tab navigation between controls
- Enter/Space activation
- Escape to close
- Arrow keys for value adjustments

Fixes #45
```

## 📝 Code Standards

### JavaScript/React Standards

- **ES6+**: Use modern JavaScript features
- **React Hooks**: Prefer functional components with hooks
- **JSX**: Follow React best practices for component structure
- **Props**: Use TypeScript-style prop validation when possible

### Code Style

```javascript
// Use descriptive variable names
const isHighContrastEnabled = settings.highContrast;

// Prefer const/let over var
const accessibilitySettings = {
  fontSize: 'normal',
  contrast: false,
  lineHeight: 1.5
};

// Use template literals for strings
const ariaLabel = `Font size: ${currentSize}, click to ${action}`;

// Comment complex accessibility logic
// Ensure screen readers announce state changes
announceToScreenReader(message);
```

### File Organization

```
src/
├── components/          # Reusable React components
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── styles/             # CSS and styling
└── accessibility/      # Accessibility-specific utilities
```

## ♿ Accessibility Guidelines

### WCAG Compliance

All contributions must maintain **WCAG 2.1 AA compliance**:

- **Perceivable**: Content must be presentable in ways users can perceive
- **Operable**: Interface components must be operable by all users
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for various assistive technologies

### Accessibility Checklist

Before submitting code, verify:

- [ ] **Keyboard Navigation**: All interactive elements are keyboard accessible
- [ ] **Screen Reader Support**: Proper ARIA labels and semantic HTML
- [ ] **Color Contrast**: Meets WCAG AA standards (4.5:1 for normal text)
- [ ] **Focus Indicators**: Clear visual focus indicators for all interactive elements
- [ ] **Alternative Text**: Images have meaningful alt attributes
- [ ] **Error Handling**: Accessible error messages and form validation
- [ ] **State Communication**: State changes are announced to assistive technologies

### Testing with Assistive Technologies

Test your changes with:
- **Keyboard only** navigation (unplug your mouse)
- **Screen readers** (NVDA, JAWS, VoiceOver)
- **Voice control** software
- **High contrast** mode
- **Browser zoom** up to 200%

### Semantic HTML

```html
<!-- Good: Semantic button -->
<button aria-label="Increase font size" onClick={increaseFontSize}>
  A+
</button>

<!-- Bad: Non-semantic div -->
<div className="button" onClick={increaseFontSize}>
  A+
</div>
```

### ARIA Best Practices

```javascript
// Use ARIA attributes appropriately
<div 
  role="slider"
  aria-label="Font size"
  aria-valuemin="1"
  aria-valuemax="3"
  aria-valuenow={currentSize}
  tabIndex="0"
/>

// Announce dynamic changes
const announceChange = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};
```

## 🧪 Testing

### Accessibility Testing

```bash
# Manual testing checklist before submitting:
# 1. Test with keyboard navigation
# 2. Test with screen reader
# 3. Verify color contrast ratios
# 4. Test in high contrast mode
# 5. Test with browser zoom at 200%
```

### Automated Testing

```bash
# When available, run accessibility tests
npm run test:a11y

# Lint for accessibility issues
npm run lint
```

### Cross-Browser Testing

Test your changes in:
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Testing

- Ensure the minified build remains under 20KB gzipped
- Test on slow 3G networks
- Verify smooth animations and interactions

## 🔍 Pull Request Process

### Before Submitting

1. **Test thoroughly** with accessibility tools and manual testing
2. **Run linting** and fix all issues: `npm run lint`
3. **Format code**: `npm run format`
4. **Build successfully**: `npm run build`
5. **Update documentation** if you've changed APIs or added features

### Pull Request Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Accessibility improvement
- [ ] Documentation update

## Accessibility Checklist
- [ ] Tested with keyboard navigation
- [ ] Tested with screen reader
- [ ] Verified color contrast compliance
- [ ] Added/updated ARIA labels where needed
- [ ] Semantic HTML used appropriately

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed
- [ ] Cross-browser testing completed

## Screenshots/Demo
If applicable, add screenshots or a demo of your changes.
```

### Review Process

1. **Automated checks** must pass (linting, building)
2. **Accessibility review** by maintainers
3. **Code review** for quality and standards
4. **Testing verification** by reviewers
5. **Final approval** and merge

## 📋 Issue Guidelines

### Creating Issues

Use our issue templates:

- **Bug Report**: For reporting bugs or accessibility issues
- **Feature Request**: For suggesting new accessibility features
- **Accessibility Issue**: For WCAG compliance problems
- **Documentation**: For documentation improvements

### Issue Labels

- `bug` - Something isn't working correctly
- `enhancement` - New feature or improvement
- `accessibility` - Accessibility-related issues
- `good first issue` - Good for newcomers
- `help wanted` - Community assistance needed
- `documentation` - Documentation needs
- `priority: high` - Critical issues
- `browser: specific` - Browser-specific issues

### Writing Good Issues

```markdown
## Description
Clear description of the issue or feature request.

## Steps to Reproduce (for bugs)
1. Go to...
2. Click on...
3. See error...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Accessibility Impact
How does this affect users with disabilities?

## Environment
- Browser: Chrome 91
- OS: Windows 10
- Assistive Technology: JAWS 2021
```

## 🏗️ Architecture Guidelines

### Component Structure

```javascript
// AccessibleComponent.jsx
import React, { useState, useEffect, useRef } from 'react';

const AccessibleComponent = ({ 
  onValueChange, 
  initialValue = 'default',
  ariaLabel 
}) => {
  const [value, setValue] = useState(initialValue);
  const componentRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.focus();
    }
  }, []);

  // Announce changes to screen readers
  const handleValueChange = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
    
    // Announce change
    announceToScreenReader(`Value changed to ${newValue}`);
  };

  return (
    <div
      ref={componentRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={handleKeyboardInteraction}
      onClick={handleClick}
    >
      {/* Component content */}
    </div>
  );
};

export default AccessibleComponent;
```

### State Management

- Use React hooks for local state
- Implement proper state announcements for screen readers
- Persist accessibility settings in localStorage
- Provide state restoration capabilities

### Performance Considerations

- Minimize bundle size impact
- Use lazy loading for optional features
- Optimize for slow networks and older devices
- Implement smooth animations with proper motion preferences

## 🌍 Internationalization

### Language Support

- **Primary**: English
- **Secondary**: Romanian (reflecting the project's advocacy focus)
- **Future**: Additional languages based on community needs

### Text Externalization

```javascript
// Use consistent text externalization
const messages = {
  en: {
    increaseFontSize: 'Increase font size',
    decreaseFontSize: 'Decrease font size',
    toggleContrast: 'Toggle high contrast mode'
  },
  ro: {
    increaseFontSize: 'Mărește dimensiunea fontului',
    decreaseFontSize: 'Micșorează dimensiunea fontului',
    toggleContrast: 'Comută modul de contrast ridicat'
  }
};
```

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes affecting accessibility APIs
- **MINOR**: New accessibility features
- **PATCH**: Bug fixes and accessibility improvements

### Release Checklist

- [ ] All tests pass
- [ ] Accessibility audit completed
- [ ] Cross-browser testing verified
- [ ] Documentation updated
- [ ] Performance benchmarks met
- [ ] Bundle size under limits

## 🎓 Learning Resources

### Accessibility Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility Documentation](https://reactjs.org/docs/accessibility.html)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

### Neurodivergent Advocacy

- [AboutADHD.com](https://aboutadhd.com) - ADHD advocacy and resources
- [About ADHD Romania](https://despreadhd.ro) - Romanian ADHD community
- [Asociația SuntAutist](https://suntautist.ro) - Autism advocacy in Romania

## 💬 Community and Support

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and community interaction
- **Email**: contact@andreihodorog.com for direct contact

### Community Guidelines

- Be patient and kind, especially with newcomers
- Focus on inclusive and accessible solutions
- Share knowledge and help others learn
- Celebrate diverse perspectives and approaches

## 🙏 Recognition

### Contributors

All contributors will be recognized in our README and release notes. We especially celebrate contributions that improve accessibility and digital inclusion.

### Neurodivergent Contributors

We actively encourage participation from neurodivergent developers and provide accommodations as needed for different communication and contribution styles.

---

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (CC BY-NC-SA 4.0 International License).

---

**Thank you for contributing to a more accessible web!** 🌍♿

Your contributions help break down digital barriers and create inclusive experiences for everyone, especially neurodivergent individuals who benefit most from accessible design.

---

*This contributing guide is a living document. If you have suggestions for improvements, please feel free to propose changes.*