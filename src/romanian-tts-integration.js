class RomanianTTSIntegration {
    constructor() {
        this.initializeEnhancements();
        this.voiceProfiles = new Map();
        this.sessionCache = new Map();
        this.userPreferences = this.loadUserPreferences();
    }

    initializeEnhancements() {
        this.pronunciationRules = {
            contextual: {
                'ce': { before: ['a', 'o', 'u'], replacement: 'che' },
                'ci': { before: ['a', 'o', 'u'], replacement: 'chi' },
                'ge': { before: ['a', 'o', 'u'], replacement: 'ghe' },
                'gi': { before: ['a', 'o', 'u'], replacement: 'ghi' }
            },
            
            syllableStress: {
                patterns: [
                    { word: /(\w+)ește$/i, stress: -2 },
                    { word: /(\w+)ează$/i, stress: -2 },
                    { word: /(\w+)ției$/i, stress: -2 },
                    { word: /(\w+)ilor$/i, stress: -2 },
                    { word: /^în(\w+)/i, stress: 1 },
                    { word: /^des(\w+)/i, stress: 1 },
                    { word: /^pre(\w+)/i, stress: 1 }
                ]
            },
            
            liaisons: {
                'de a': 'dea',
                'de o': 'deo',
                'de un': 'deun',
                'de-a': 'dea',
                'să-i': 'săi',
                'să-l': 'săl',
                'că-i': 'căi',
                'că-l': 'căl'
            },
            
            regionalVariants: {
                standard: {
                    'â': 'î', 
                    'sunt': 'sînt'
                },
                moldovan: {
                    'este': 'ieste',
                    'ea': 'ia'
                },
                transylvanian: {
                    'foarte': 'tare',
                    'acum': 'amu'
                }
            }
        };

        this.emotionalTones = {
            neutral: { rate: 1.0, pitch: 1.0, emphasis: 'moderate' },
            happy: { rate: 1.1, pitch: 1.15, emphasis: 'moderate' },
            sad: { rate: 0.9, pitch: 0.95, emphasis: 'reduced' },
            excited: { rate: 1.2, pitch: 1.2, emphasis: 'strong' },
            calm: { rate: 0.85, pitch: 0.95, emphasis: 'reduced' },
            serious: { rate: 0.95, pitch: 0.9, emphasis: 'moderate' },
            questioning: { rate: 1.0, pitch: 1.1, emphasis: 'moderate', contour: 'rising' }
        };

        this.punctuationPauses = {
            '.': 400,
            '!': 350,
            '?': 400,
            ',': 200,
            ';': 250,
            ':': 300,
            '...': 500,
            '–': 250,
            '—': 300,
            '(': 150,
            ')': 150
        };
    }

    loadUserPreferences() {
        const defaults = {
            dialect: 'standard',
            emotionalTone: 'neutral',
            speakingSpeed: 'normal',
            pauseLength: 'normal',
            numberExpansion: true,
            abbreviationExpansion: true,
            emphasisLevel: 'moderate',
            useProsody: true
        };

        try {
            const saved = localStorage.getItem('romanian-tts-preferences');
            return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
        } catch {
            return defaults;
        }
    }

    saveUserPreferences(preferences) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
        try {
            localStorage.setItem('romanian-tts-preferences', JSON.stringify(this.userPreferences));
        } catch (e) {
            console.warn('Could not save TTS preferences:', e);
        }
    }

    analyzeVoiceCapabilities(voice) {
        if (this.voiceProfiles.has(voice.name)) {
            return this.voiceProfiles.get(voice.name);
        }

        const profile = {
            name: voice.name,
            lang: voice.lang,
            localService: voice.localService,
            quality: this.assessVoiceQuality(voice),
            capabilities: {
                ssml: this.testSSMLSupport(voice),
                prosody: this.testProsodySupport(voice),
                phonemes: this.testPhonemeSupport(voice),
                emphasis: this.testEmphasisSupport(voice)
            },
            optimalSettings: this.calculateOptimalSettings(voice)
        };

        this.voiceProfiles.set(voice.name, profile);
        return profile;
    }

    assessVoiceQuality(voice) {
        const qualityIndicators = {
            highQuality: ['Premium', 'Natural', 'Neural', 'HD'],
            mediumQuality: ['Standard', 'Default'],
            lowQuality: ['Compact', 'Basic', 'eSpeak']
        };

        for (const [quality, indicators] of Object.entries(qualityIndicators)) {
            if (indicators.some(ind => voice.name.includes(ind))) {
                return quality;
            }
        }

        return voice.localService ? 'mediumQuality' : 'highQuality';
    }

    testSSMLSupport(voice) {
        try {
            const test = new SpeechSynthesisUtterance();
            test.text = '<speak>Test</speak>';
            test.voice = voice;
            return true;
        } catch {
            return false;
        }
    }

    testProsodySupport(voice) {
        return voice.name.includes('Microsoft') || 
               voice.name.includes('Google') || 
               voice.name.includes('Amazon');
    }

    testPhonemeSupport(voice) {
        return voice.name.includes('Microsoft') || 
               voice.name.includes('Neural');
    }

    testEmphasisSupport(voice) {
        return !voice.name.includes('eSpeak') && 
               !voice.name.includes('Compact');
    }

    calculateOptimalSettings(voice) {
        const quality = this.assessVoiceQuality(voice);
        
        const settings = {
            highQuality: { rate: 0.95, pitch: 1.02, volume: 1.0 },
            mediumQuality: { rate: 0.9, pitch: 1.05, volume: 1.0 },
            lowQuality: { rate: 0.85, pitch: 1.0, volume: 1.0 }
        };

        return settings[quality] || settings.mediumQuality;
    }

    preprocessText(text) {
        text = this.normalizeWhitespace(text);
        text = this.fixCommonMisspellings(text);
        text = this.expandAbbreviations(text);
        text = this.processNumbers(text);
        text = this.applyDialectVariants(text);
        text = this.insertProsodyMarkers(text);
        
        return text;
    }

    normalizeWhitespace(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/\s+([.,!?;:])/g, '$1')
            .replace(/([.,!?;:])\s*$/g, '$1')
            .trim();
    }

    fixCommonMisspellings(text) {
        const corrections = {
            'sînt': 'sunt', 'cînd': 'când', 'mîine': 'mâine',
            'pîine': 'pâine', 'cîine': 'câine', 'romîn': 'român',
            'intilnire': 'întâlnire', 'intrebare': 'întrebare',
            'inceput': 'început', 'scoala': 'școala',
            'asa': 'așa', 'astept': 'aștept',
            'stie': 'știe', 'stiu': 'știu'
        };

        for (const [wrong, correct] of Object.entries(corrections)) {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            text = text.replace(regex, correct);
        }

        return text;
    }

    expandAbbreviations(text) {
        if (!this.userPreferences.abbreviationExpansion) return text;

        const abbreviations = {
            'nr.': 'numărul', 'str.': 'strada', 'bl.': 'blocul',
            'sc.': 'scara', 'ap.': 'apartamentul', 'et.': 'etajul',
            'p-ța': 'piața', 'b-dul': 'bulevardul', 'ș.a.': 'și așa mai departe',
            'etc.': 'etcetera', 'ex.': 'exemplu', 'pag.': 'pagina',
            'art.': 'articolul', 'lit.': 'litera', 'alin.': 'alineatul',
            'cf.': 'conform', 'cca.': 'circa', 'max.': 'maxim',
            'min.': 'minim', 'tel.': 'telefon', 'fax.': 'fax'
        };

        for (const [abbr, expansion] of Object.entries(abbreviations)) {
            const regex = new RegExp(`\\b${abbr.replace('.', '\\.')}`, 'gi');
            text = text.replace(regex, expansion);
        }

        return text;
    }

    processNumbers(text) {
        if (!this.userPreferences.numberExpansion) return text;

        const processOrdinals = (text) => {
            const ordinals = {
                '1-ul': 'primul', '1-a': 'prima', '1-ii': 'primii', '1-ele': 'primele',
                '2-lea': 'al doilea', '2-a': 'a doua',
                '3-lea': 'al treilea', '3-a': 'a treia',
                '4-lea': 'al patrulea', '4-a': 'a patra',
                '5-lea': 'al cincilea', '5-a': 'a cincea'
            };

            for (const [pattern, replacement] of Object.entries(ordinals)) {
                text = text.replace(new RegExp(pattern, 'gi'), replacement);
            }
            return text;
        };

        const expandNumber = (num) => {
            const numbers = {
                0: 'zero', 1: 'unu', 2: 'doi', 3: 'trei', 4: 'patru',
                5: 'cinci', 6: 'șase', 7: 'șapte', 8: 'opt', 9: 'nouă',
                10: 'zece', 11: 'unsprezece', 12: 'doisprezece',
                13: 'treisprezece', 14: 'paisprezece', 15: 'cincisprezece',
                16: 'șaisprezece', 17: 'șaptesprezece', 18: 'optsprezece',
                19: 'nouăsprezece', 20: 'douăzeci', 30: 'treizeci',
                40: 'patruzeci', 50: 'cincizeci', 60: 'șaizeci',
                70: 'șaptezeci', 80: 'optzeci', 90: 'nouăzeci',
                100: 'o sută', 200: 'două sute', 300: 'trei sute',
                1000: 'o mie', 2000: 'două mii'
            };

            if (numbers[num]) return numbers[num];

            if (num < 100) {
                const tens = Math.floor(num / 10) * 10;
                const ones = num % 10;
                return ones === 0 ? numbers[tens] : `${numbers[tens]} și ${numbers[ones]}`;
            }

            if (num < 1000) {
                const hundreds = Math.floor(num / 100);
                const remainder = num % 100;
                const hundredsWord = hundreds === 1 ? 'o sută' : `${numbers[hundreds]} sute`;
                return remainder === 0 ? hundredsWord : `${hundredsWord} ${expandNumber(remainder)}`;
            }

            return num.toString();
        };

        text = processOrdinals(text);
        
        text = text.replace(/\b(\d+)\b/g, (match, num) => {
            const number = parseInt(num, 10);
            if (number <= 2000) {
                return expandNumber(number);
            }
            return match;
        });

        return text;
    }

    applyDialectVariants(text) {
        const dialect = this.userPreferences.dialect;
        if (dialect === 'standard') return text;

        const variants = this.pronunciationRules.regionalVariants[dialect];
        if (!variants) return text;

        for (const [standard, variant] of Object.entries(variants)) {
            const regex = new RegExp(`\\b${standard}\\b`, 'gi');
            text = text.replace(regex, variant);
        }

        return text;
    }

    insertProsodyMarkers(text) {
        if (!this.userPreferences.useProsody) return text;

        const sentences = text.split(/([.!?]+)/);
        const processed = [];

        for (let i = 0; i < sentences.length; i++) {
            let sentence = sentences[i];
            
            if (sentence.includes('?')) {
                sentence = this.addQuestionIntonation(sentence);
            } else if (sentence.includes('!')) {
                sentence = this.addExclamationEmphasis(sentence);
            } else if (sentence.length > 100) {
                sentence = this.addBreathingPauses(sentence);
            }

            processed.push(sentence);
        }

        return processed.join('');
    }

    addQuestionIntonation(text) {
        const words = text.split(' ');
        const lastWords = words.slice(-3);
        
        if (lastWords.length > 0) {
            lastWords[lastWords.length - 1] = 
                `<prosody pitch="+20%">${lastWords[lastWords.length - 1]}</prosody>`;
            words.splice(-3, 3, ...lastWords);
        }
        
        return words.join(' ');
    }

    addExclamationEmphasis(text) {
        const importantWords = ['important', 'urgent', 'atenție', 'pericol', 'avertizare'];
        
        for (const word of importantWords) {
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            text = text.replace(regex, '<emphasis level="strong">$1</emphasis>');
        }
        
        return text;
    }

    addBreathingPauses(text) {
        const clauses = text.split(/([,;])/);
        const processed = [];
        
        for (let i = 0; i < clauses.length; i++) {
            processed.push(clauses[i]);
            if (clauses[i] === ',' || clauses[i] === ';') {
                processed.push('<break time="200ms"/>');
            }
        }
        
        return processed.join('');
    }

    createAdaptiveChunks(text, voiceProfile) {
        const maxChunkSize = voiceProfile.quality === 'highQuality' ? 250 : 150;
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const chunks = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length <= maxChunkSize) {
                currentChunk += sentence + ' ';
            } else {
                if (currentChunk) {
                    chunks.push(this.optimizeChunk(currentChunk.trim(), voiceProfile));
                }
                
                if (sentence.length <= maxChunkSize) {
                    currentChunk = sentence + ' ';
                } else {
                    const subChunks = this.splitLongSentence(sentence, maxChunkSize);
                    subChunks.forEach(sub => chunks.push(this.optimizeChunk(sub, voiceProfile)));
                    currentChunk = '';
                }
            }
        }

        if (currentChunk.trim()) {
            chunks.push(this.optimizeChunk(currentChunk.trim(), voiceProfile));
        }

        return chunks;
    }

    splitLongSentence(sentence, maxSize) {
        const words = sentence.split(' ');
        const chunks = [];
        let current = '';

        for (const word of words) {
            if ((current + word).length <= maxSize) {
                current += (current ? ' ' : '') + word;
            } else {
                if (current) chunks.push(current);
                current = word;
            }
        }

        if (current) chunks.push(current);
        return chunks;
    }

    optimizeChunk(chunk, voiceProfile) {
        if (voiceProfile.capabilities.ssml) {
            chunk = this.wrapInSSML(chunk, voiceProfile);
        }

        const cacheKey = `${chunk}_${voiceProfile.name}`;
        if (this.sessionCache.has(cacheKey)) {
            return this.sessionCache.get(cacheKey);
        }

        const optimized = {
            text: chunk,
            settings: this.calculateChunkSettings(chunk, voiceProfile),
            duration: this.estimateChunkDuration(chunk)
        };

        this.sessionCache.set(cacheKey, optimized);
        return optimized;
    }

    wrapInSSML(text, voiceProfile) {
        if (!voiceProfile.capabilities.ssml) return text;

        const tone = this.emotionalTones[this.userPreferences.emotionalTone];
        
        return `<speak version="1.0" xml:lang="ro-RO">
            <prosody rate="${tone.rate}" pitch="${tone.pitch}">
                ${text}
            </prosody>
        </speak>`;
    }

    calculateChunkSettings(chunk, voiceProfile) {
        const baseSettings = voiceProfile.optimalSettings;
        const wordCount = chunk.split(/\s+/).length;
        
        let rateAdjustment = 1.0;
        if (wordCount < 5) rateAdjustment = 0.95;
        else if (wordCount > 30) rateAdjustment = 1.05;
        
        const hasQuestion = chunk.includes('?');
        const hasExclamation = chunk.includes('!');
        
        return {
            rate: baseSettings.rate * rateAdjustment,
            pitch: baseSettings.pitch * (hasQuestion ? 1.1 : hasExclamation ? 1.05 : 1.0),
            volume: baseSettings.volume
        };
    }

    estimateChunkDuration(chunk) {
        const words = chunk.split(/\s+/).length;
        const avgWordDuration = 350;
        const punctuationPauses = (chunk.match(/[.,;:!?]/g) || []).length * 150;
        
        return words * avgWordDuration + punctuationPauses;
    }

    async speakEnhanced(text, voice, callbacks = {}) {
        const voiceProfile = this.analyzeVoiceCapabilities(voice);
        const processedText = this.preprocessText(text);
        const chunks = this.createAdaptiveChunks(processedText, voiceProfile);
        
        let currentChunkIndex = 0;
        let isSpeaking = true;

        const speakNextChunk = () => {
            if (!isSpeaking || currentChunkIndex >= chunks.length) {
                if (callbacks.onComplete) callbacks.onComplete();
                return;
            }

            const chunk = chunks[currentChunkIndex];
            const utterance = new SpeechSynthesisUtterance(chunk.text);
            
            utterance.voice = voice;
            utterance.lang = 'ro-RO';
            utterance.rate = chunk.settings.rate;
            utterance.pitch = chunk.settings.pitch;
            utterance.volume = chunk.settings.volume;

            utterance.onstart = () => {
                if (callbacks.onProgress) {
                    callbacks.onProgress({
                        current: currentChunkIndex + 1,
                        total: chunks.length,
                        percentage: Math.round(((currentChunkIndex + 1) / chunks.length) * 100)
                    });
                }
            };

            utterance.onend = () => {
                currentChunkIndex++;
                if (currentChunkIndex < chunks.length && isSpeaking) {
                    const pauseDuration = this.calculateInterChunkPause(
                        chunks[currentChunkIndex - 1], 
                        chunks[currentChunkIndex]
                    );
                    setTimeout(speakNextChunk, pauseDuration);
                } else {
                    if (callbacks.onComplete) callbacks.onComplete();
                }
            };

            utterance.onerror = (event) => {
                isSpeaking = false;
                if (callbacks.onError) callbacks.onError(event);
            };

            speechSynthesis.speak(utterance);
        };

        speechSynthesis.cancel();
        
        if (callbacks.onStart) callbacks.onStart();
        
        setTimeout(speakNextChunk, 100);

        return {
            stop: () => {
                isSpeaking = false;
                speechSynthesis.cancel();
                if (callbacks.onStop) callbacks.onStop();
            },
            pause: () => {
                speechSynthesis.pause();
                if (callbacks.onPause) callbacks.onPause();
            },
            resume: () => {
                speechSynthesis.resume();
                if (callbacks.onResume) callbacks.onResume();
            }
        };
    }

    calculateInterChunkPause(previousChunk, nextChunk) {
        const lastChar = previousChunk.text.slice(-1);
        const pauseDuration = this.punctuationPauses[lastChar] || 200;
        
        const speedMultiplier = {
            slow: 1.5,
            normal: 1.0,
            fast: 0.7
        };
        
        return pauseDuration * (speedMultiplier[this.userPreferences.speakingSpeed] || 1.0);
    }

    getRecommendedVoice(voices) {
        const romanianVoices = voices.filter(v => 
            v.lang.includes('ro') || 
            v.name.toLowerCase().includes('romanian')
        );

        if (romanianVoices.length === 0) return null;

        const scoredVoices = romanianVoices.map(voice => {
            const profile = this.analyzeVoiceCapabilities(voice);
            let score = 0;
            
            if (profile.quality === 'highQuality') score += 10;
            else if (profile.quality === 'mediumQuality') score += 5;
            
            if (profile.capabilities.ssml) score += 3;
            if (profile.capabilities.prosody) score += 3;
            if (profile.capabilities.emphasis) score += 2;
            if (profile.localService) score += 1;
            
            if (voice.name.includes('Female')) score += 1;
            
            return { voice, score };
        });

        scoredVoices.sort((a, b) => b.score - a.score);
        return scoredVoices[0].voice;
    }
}

export default RomanianTTSIntegration;