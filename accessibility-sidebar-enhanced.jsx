// Enhanced Accessibility Sidebar with Narrator - Standalone JSX Component
window.AccessibilitySidebar = () => {
  // State for panel visibility and settings
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 16, y: 100 });
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Voice and narrator states
  const [availableRomanianVoices, setAvailableRomanianVoices] = React.useState([]);
  const [selectedVoice, setSelectedVoice] = React.useState(null);
  const [readingProgress, setReadingProgress] = React.useState(0);
  const [currentUtterance, setCurrentUtterance] = React.useState(null);
  const [speechRate, setSpeechRate] = React.useState(0.8);
  const [speechPitch, setSpeechPitch] = React.useState(1.0);

  // Accessibility states
  const [fontSize, setFontSize] = React.useState(0); // 0: normal, 1: larger, 2: largest
  const [highContrast, setHighContrast] = React.useState(false);
  const [lineHeight, setLineHeight] = React.useState(0); // 0: normal, 1: larger, 2: largest
  const [isReading, setIsReading] = React.useState(false);

  // Check for mobile devices
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Voice setup and management
  React.useEffect(() => {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const romanianVoices = voices.filter(voice =>
        voice.lang.includes('ro') ||
        voice.name.toLowerCase().includes('romanian') ||
        voice.name.toLowerCase().includes('română')
      );
      setAvailableRomanianVoices(romanianVoices);

      // Auto-select the best Romanian voice
      if (romanianVoices.length > 0 && !selectedVoice) {
        const bestVoice = romanianVoices.find(v => 
          !v.name.toLowerCase().includes('standard') && 
          !v.name.toLowerCase().includes('compact')
        ) || romanianVoices[0];
        setSelectedVoice(bestVoice);
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoice]);

  // Handle font size changes
  const handleFontSizeChange = () => {
    const newSize = (fontSize + 1) % 3;
    setFontSize(newSize);

    // Remove existing classes
    document.body.classList.remove('font-size-larger', 'font-size-largest');

    // Add appropriate class
    if (newSize === 1) {
      document.body.classList.add('font-size-larger');
    } else if (newSize === 2) {
      document.body.classList.add('font-size-largest');
    }
  };

  // Handle contrast toggle
  const handleContrastToggle = () => {
    const newState = !highContrast;
    setHighContrast(newState);

    if (newState) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  // Handle line height changes
  const handleLineHeightChange = () => {
    const newHeight = (lineHeight + 1) % 3;
    setLineHeight(newHeight);

    // Remove existing classes
    document.body.classList.remove('line-height-larger', 'line-height-largest');

    // Add appropriate class
    if (newHeight === 1) {
      document.body.classList.add('line-height-larger');
    } else if (newHeight === 2) {
      document.body.classList.add('line-height-largest');
    }
  };

  // Enhanced text-to-speech with narrator features
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browserul dvs. nu suportă citirea cu voce tare');
      return;
    }

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setReadingProgress(0);
      setCurrentUtterance(null);
    } else {
      // Get all the text from the main content
      const contentArea = document.querySelector('.content-area') || document.querySelector('main') || document.body;
      
      // Get text content from relevant elements, excluding navigation and controls
      const textElements = contentArea.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote, td');
      const textContent = Array.from(textElements)
        .filter(el => {
          // Exclude navigation, accessibility controls, and other UI elements
          return !el.closest('.toc') && 
                 !el.closest('.content-nav') && 
                 !el.closest('.accessibility-sidebar') &&
                 !el.closest('.back-to-top') &&
                 !el.closest('.search-container') &&
                 !el.closest('nav') &&
                 !el.closest('header') &&
                 !el.closest('footer') &&
                 !el.classList.contains('sr-only');
        })
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0)
        .join('. ');

      if (!textContent) {
        alert('Nu s-a găsit conținut pentru citire');
        return;
      }

      // Split into manageable chunks for better speech synthesis
      const sentences = textContent.match(/[^\.!?]+[\.!?]+/g) || [textContent];
      const chunks = [];
      
      let currentChunk = '';
      sentences.forEach(sentence => {
        if ((currentChunk + sentence).length > 200) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      });
      if (currentChunk) chunks.push(currentChunk.trim());

      let currentIndex = 0;

      const speakNext = () => {
        if (currentIndex < chunks.length && isReading) {
          const utterance = new SpeechSynthesisUtterance(chunks[currentIndex]);
          utterance.lang = 'ro-RO';
          utterance.rate = speechRate;
          utterance.pitch = speechPitch;
          utterance.volume = 1.0;

          // Use selected voice if available
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }

          utterance.onstart = () => {
            const progress = Math.round((currentIndex / chunks.length) * 100);
            setReadingProgress(progress);
          };

          utterance.onend = () => {
            currentIndex++;
            if (currentIndex < chunks.length) {
              // Small pause between chunks
              setTimeout(speakNext, 300);
            } else {
              setIsReading(false);
              setReadingProgress(100);
              // Reset progress after completion
              setTimeout(() => setReadingProgress(0), 2000);
            }
          };

          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            setIsReading(false);
            setReadingProgress(0);
            alert('Eroare la citirea cu voce tare: ' + event.error);
          };

          setCurrentUtterance(utterance);
          window.speechSynthesis.speak(utterance);
        }
      };

      setIsReading(true);
      setReadingProgress(0);
      
      // Cancel any previous speech
      window.speechSynthesis.cancel();
      
      // Start speaking
      setTimeout(speakNext, 100); // Small delay to ensure cancellation is complete
    }
  };

  // Handle speech rate change
  const handleSpeechRateChange = () => {
    const rates = [0.6, 0.8, 1.0, 1.2];
    const currentIndex = rates.indexOf(speechRate);
    const newRate = rates[(currentIndex + 1) % rates.length];
    setSpeechRate(newRate);
  };

  // Handle voice selection
  const handleVoiceChange = () => {
    if (availableRomanianVoices.length <= 1) return;
    
    const currentIndex = availableRomanianVoices.indexOf(selectedVoice);
    const nextIndex = (currentIndex + 1) % availableRomanianVoices.length;
    setSelectedVoice(availableRomanianVoices[nextIndex]);
  };

  // Handle panel dragging
  const handleMouseDown = (e) => {
    if (isMobile) return; // No dragging on mobile

    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });

    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    // Calculate new position with bounds checking
    const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - startPos.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - startPos.y));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Set up mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Reset position when switching between mobile and desktop
  React.useEffect(() => {
    if (isMobile) {
      setPosition({ x: 16, y: window.innerHeight - 80 });
    } else {
      setPosition({ x: 16, y: 100 });
    }
  }, [isMobile]);

  // Handle keyboard accessibility
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Reset all settings
  const resetAllSettings = () => {
    setFontSize(0);
    setHighContrast(false);
    setLineHeight(0);
    setSpeechRate(0.8);
    setSpeechPitch(1.0);
    
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setReadingProgress(0);
    }

    // Remove all classes
    document.body.classList.remove(
      'font-size-larger',
      'font-size-largest',
      'high-contrast',
      'line-height-larger',
      'line-height-largest'
    );
  };

  // Get current voice name for display
  const getCurrentVoiceName = () => {
    if (!selectedVoice) return 'Implicit';
    return selectedVoice.name.length > 20 
      ? selectedVoice.name.substring(0, 20) + '...'
      : selectedVoice.name;
  };

  // Get speech rate label
  const getSpeechRateLabel = () => {
    switch (speechRate) {
      case 0.6: return 'Încet';
      case 0.8: return 'Normal';
      case 1.0: return 'Mediu';
      case 1.2: return 'Rapid';
      default: return 'Normal';
    }
  };

  return (
    <React.Fragment>
      {/* Enhanced CSS for animations and narrator features */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }

          @keyframes reading-progress {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }

          @media (prefers-reduced-motion: reduce) {
            .accessibility-sidebar {
              transition: none !important;
            }

            @keyframes pulse {
              0%, 50%, 100% { opacity: 1; }
            }
          }

          .a11y-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
          }

          .a11y-icon.large {
            width: 24px;
            height: 24px;
          }

          .reading-progress-indicator {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #4CAF50, #2196F3);
            border-radius: 0 0 12px 12px;
            transition: width 0.3s ease;
          }

          .voice-indicator {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 2px;
            line-height: 1;
          }
        `}
      </style>

      <div
        className={`accessibility-sidebar ${isPanelOpen ? 'expanded' : 'collapsed'} ${isMobile ? 'mobile' : 'desktop'}`}
        style={{
          position: 'fixed',
          top: isMobile ? 'auto' : `${position.y}px`,
          left: isMobile ? 'auto' : `${position.x}px`,
          bottom: isMobile ? '20px' : 'auto',
          right: isMobile ? '20px' : 'auto',
          zIndex: 9999,
          transition: 'all 0.3s ease',
          background: highContrast ? '#000' : 'white',
          color: highContrast ? '#fff' : '#333',
          border: `2px solid ${highContrast ? '#fff' : '#2196F3'}`,
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: isPanelOpen ? '16px' : '8px',
          width: isPanelOpen ? (isMobile ? '300px' : '300px') : '56px',
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          cursor: isDragging ? 'grabbing' : 'auto',
          position: 'relative'
        }}
      >
        {/* Reading progress indicator */}
        {isReading && readingProgress > 0 && (
          <div 
            className="reading-progress-indicator"
            style={{
              width: `${readingProgress}%`
            }}
          />
        )}

        {/* Panel Header */}
        <div
          className="accessibility-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            cursor: isMobile ? 'auto' : 'grab',
            padding: '4px'
          }}
          onMouseDown={handleMouseDown}
          role="presentation"
        >
          {isPanelOpen && (
            <div className="title" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="a11y-icon">
                <i className="fas fa-universal-access" aria-hidden="true"></i>
              </div>
              <span>Accesibilitate</span>
            </div>
          )}

          <button
            aria-label={isPanelOpen ? "Închide panoul de accesibilitate" : "Deschide panoul de accesibilitate"}
            title={isPanelOpen ? "Închide panoul" : "Opțiuni de accesibilitate"}
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              color: highContrast ? '#fff' : '#2196F3',
              marginLeft: isPanelOpen ? '0' : 'auto',
              marginRight: isPanelOpen ? '0' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onKeyDown={(e) => handleKeyDown(e, () => setIsPanelOpen(!isPanelOpen))}
          >
            {isPanelOpen ? (
              <div className="a11y-icon large">
                <i className="fas fa-compress" aria-hidden="true"></i>
              </div>
            ) : (
              <div className="a11y-icon large">
                <i className="fas fa-universal-access" aria-hidden="true"></i>
              </div>
            )}
          </button>
        </div>

        {/* Control Buttons - Only visible when panel is expanded */}
        {isPanelOpen && (
          <div
            className="control-buttons"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            role="group"
            aria-label="Controale de accesibilitate"
          >
            {/* Font Size Control */}
            <button
              aria-label={`Mărime text: ${fontSize === 0 ? 'normal' : fontSize === 1 ? 'mare' : 'foarte mare'}`}
              aria-pressed={fontSize > 0}
              className={`control-button ${fontSize > 0 ? 'active' : ''}`}
              onClick={handleFontSizeChange}
              onKeyDown={(e) => handleKeyDown(e, handleFontSizeChange)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: fontSize > 0 ? (highContrast ? '#fff' : '#e3f2fd') : (highContrast ? '#333' : '#f5f5f5'),
                color: fontSize > 0 ? (highContrast ? '#000' : '#2196F3') : (highContrast ? '#fff' : '#333'),
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: fontSize > 0 ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              <div className="a11y-icon" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9.62 12L12 5.67L14.37 12M11 3L5.5 21h2.25l1.12-3h6.25l1.13 3h2.25L13 3h-2z"/>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>Mărime text</span>
                <small style={{ fontSize: '12px', opacity: '0.8' }}>
                  {fontSize === 0 ? 'Normal' : fontSize === 1 ? 'Mare' : 'Foarte mare'}
                </small>
              </div>
            </button>

            {/* Contrast Control */}
            <button
              aria-label={`Contrast: ${highContrast ? 'ridicat' : 'normal'}`}
              aria-pressed={highContrast}
              className={`control-button ${highContrast ? 'active' : ''}`}
              onClick={handleContrastToggle}
              onKeyDown={(e) => handleKeyDown(e, handleContrastToggle)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: highContrast ? (highContrast ? '#fff' : '#e3f2fd') : (highContrast ? '#333' : '#f5f5f5'),
                color: highContrast ? (highContrast ? '#000' : '#2196F3') : (highContrast ? '#fff' : '#333'),
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: highContrast ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              <div className="a11y-icon" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {highContrast ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>Contrast</span>
                <small style={{ fontSize: '12px', opacity: '0.8' }}>
                  {highContrast ? 'Ridicat' : 'Normal'}
                </small>
              </div>
            </button>

            {/* Line Height Control */}
            <button
              aria-label={`Spațiu între rânduri: ${lineHeight === 0 ? 'normal' : lineHeight === 1 ? 'mare' : 'foarte mare'}`}
              aria-pressed={lineHeight > 0}
              className={`control-button ${lineHeight > 0 ? 'active' : ''}`}
              onClick={handleLineHeightChange}
              onKeyDown={(e) => handleKeyDown(e, handleLineHeightChange)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: lineHeight > 0 ? (highContrast ? '#fff' : '#e3f2fd') : (highContrast ? '#333' : '#f5f5f5'),
                color: lineHeight > 0 ? (highContrast ? '#000' : '#2196F3') : (highContrast ? '#fff' : '#333'),
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: lineHeight > 0 ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              <div className="a11y-icon" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"/>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>Spațiu între rânduri</span>
                <small style={{ fontSize: '12px', opacity: '0.8' }}>
                  {lineHeight === 0 ? 'Normal' : lineHeight === 1 ? 'Mare' : 'Foarte mare'}
                </small>
              </div>
            </button>

            {/* Text-to-Speech Control */}
            <button
              aria-label={isReading ? "Oprește citirea" : "Citește cu voce tare"}
              aria-pressed={isReading}
              className={`control-button ${isReading ? 'active' : ''}`}
              onClick={handleReadAloud}
              onKeyDown={(e) => handleKeyDown(e, handleReadAloud)}
              disabled={!('speechSynthesis' in window)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isReading ? (highContrast ? '#fff' : '#e3f2fd') : (highContrast ? '#333' : '#f5f5f5'),
                color: isReading ? (highContrast ? '#000' : '#2196F3') : (highContrast ? '#fff' : '#333'),
                cursor: 'speechSynthesis' in window ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                fontWeight: isReading ? 'bold' : 'normal',
                opacity: 'speechSynthesis' in window ? 1 : 0.7,
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              <div className="a11y-icon" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isReading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                    <rect x="3" y="11" width="18" height="2" transform="rotate(-45 12 12)"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{isReading ? "Oprește citirea" : "Citește cu voce tare"}</span>
                <small style={{ fontSize: '12px', opacity: '0.8' }}>
                  {'speechSynthesis' in window 
                    ? (isReading ? `Progres: ${readingProgress}%` : 'Inactiv')
                    : 'Indisponibil'}
                </small>
              </div>
            </button>

            {/* Speech Rate Control */}
            {availableRomanianVoices.length > 0 && (
              <button
                aria-label={`Viteza citirii: ${getSpeechRateLabel()}`}
                onClick={handleSpeechRateChange}
                onKeyDown={(e) => handleKeyDown(e, handleSpeechRateChange)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: highContrast ? '#333' : '#f5f5f5',
                  color: highContrast ? '#fff' : '#333',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  width: '100%'
                }}
              >
                <div className="a11y-icon" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="M12 6v6l4 2-1 1.73L10.27 13V6z"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span>Viteza citirii</span>
                  <small style={{ fontSize: '12px', opacity: '0.8' }}>
                    {getSpeechRateLabel()}
                  </small>
                </div>
              </button>
            )}

            {/* Voice Selection */}
            {availableRomanianVoices.length > 1 && (
              <button
                aria-label={`Voce: ${getCurrentVoiceName()}`}
                onClick={handleVoiceChange}
                onKeyDown={(e) => handleKeyDown(e, handleVoiceChange)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: highContrast ? '#333' : '#f5f5f5',
                  color: highContrast ? '#fff' : '#333',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  width: '100%'
                }}
              >
                <div className="a11y-icon" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span>Voce narrator</span>
                  <small style={{ fontSize: '12px', opacity: '0.8' }}>
                    {getCurrentVoiceName()}
                  </small>
                </div>
              </button>
            )}

            {/* Reset All Settings */}
            <button
              aria-label="Resetează toate setările"
              className="control-button reset"
              onClick={resetAllSettings}
              onKeyDown={(e) => handleKeyDown(e, resetAllSettings)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: highContrast ? '#444' : '#f5f5f5',
                color: highContrast ? '#fff' : '#666',
                cursor: 'pointer',
                textAlign: 'left',
                marginTop: '8px',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              <div className="a11y-icon" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
                </svg>
              </div>
              <span>Resetează setările</span>
            </button>
          </div>
        )}

        {/* Collapsed state status indicators */}
        {!isPanelOpen && (
          <div
            className="status-indicators"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            {fontSize > 0 && (
              <div
                aria-hidden="true"
                title="Mărime text mărită"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: highContrast ? '#fff' : '#2196F3'
                }}
              />
            )}

            {highContrast && (
              <div
                aria-hidden="true"
                title="Contrast ridicat activat"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: highContrast ? '#fff' : '#2196F3'
                }}
              />
            )}

            {lineHeight > 0 && (
              <div
                aria-hidden="true"
                title="Spațiu între rânduri mărit"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: highContrast ? '#fff' : '#2196F3'
                }}
              />
            )}

            {isReading && (
              <div
                aria-hidden="true"
                title="Citire vocală activă"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: highContrast ? '#fff' : '#2196F3',
                  animation: 'pulse 1.5s infinite'
                }}
              />
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};