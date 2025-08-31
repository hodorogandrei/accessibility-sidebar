/**
 * Advanced Romanian TTS Naturalness Engine
 * Implements sophisticated linguistic rules for natural Romanian speech synthesis
 */

class RomanianNaturalSpeech {
    constructor() {
        this.initializePhonologicalRules();
        this.initializeProsodyEngine();
        this.initializeContextEngine();
        this.neuralPatterns = new Map();
        this.conversationalMemory = [];
    }

    initializePhonologicalRules() {
        // Romanian phoneme inventory with IPA representations
        this.phonemeInventory = {
            vowels: {
                'a': { ipa: 'a', formants: { F1: 700, F2: 1220 }, duration: 80 },
                'e': { ipa: 'e', formants: { F1: 530, F2: 1840 }, duration: 70 },
                'i': { ipa: 'i', formants: { F1: 320, F2: 2300 }, duration: 65 },
                'o': { ipa: 'o', formants: { F1: 500, F2: 1000 }, duration: 75 },
                'u': { ipa: 'u', formants: { F1: 320, F2: 800 }, duration: 70 },
                'ă': { ipa: 'ə', formants: { F1: 500, F2: 1500 }, duration: 60 },
                'â': { ipa: 'ɨ', formants: { F1: 400, F2: 1600 }, duration: 65 },
                'î': { ipa: 'ɨ', formants: { F1: 400, F2: 1600 }, duration: 65 }
            },
            diphthongs: {
                'ea': { ipa: 'e̯a', transition: 'smooth', duration: 120 },
                'oa': { ipa: 'o̯a', transition: 'smooth', duration: 125 },
                'ia': { ipa: 'ja', transition: 'glide', duration: 110 },
                'ie': { ipa: 'je', transition: 'glide', duration: 105 },
                'ua': { ipa: 'wa', transition: 'glide', duration: 115 },
                'ue': { ipa: 'we', transition: 'glide', duration: 110 },
                'ău': { ipa: 'aw', transition: 'falling', duration: 130 },
                'eu': { ipa: 'ew', transition: 'falling', duration: 125 },
                'ou': { ipa: 'ow', transition: 'falling', duration: 120 },
                'âu': { ipa: 'ɨw', transition: 'falling', duration: 125 }
            },
            consonants: {
                // Stops
                'p': { manner: 'stop', place: 'bilabial', voiced: false, duration: 50 },
                'b': { manner: 'stop', place: 'bilabial', voiced: true, duration: 45 },
                't': { manner: 'stop', place: 'alveolar', voiced: false, duration: 55 },
                'd': { manner: 'stop', place: 'alveolar', voiced: true, duration: 50 },
                'k': { manner: 'stop', place: 'velar', voiced: false, duration: 60 },
                'g': { manner: 'stop', place: 'velar', voiced: true, duration: 55 },
                
                // Fricatives
                'f': { manner: 'fricative', place: 'labiodental', voiced: false, duration: 70 },
                'v': { manner: 'fricative', place: 'labiodental', voiced: true, duration: 65 },
                's': { manner: 'fricative', place: 'alveolar', voiced: false, duration: 75 },
                'z': { manner: 'fricative', place: 'alveolar', voiced: true, duration: 70 },
                'ș': { manner: 'fricative', place: 'postalveolar', voiced: false, duration: 80 },
                'j': { manner: 'fricative', place: 'postalveolar', voiced: true, duration: 75 },
                'h': { manner: 'fricative', place: 'glottal', voiced: false, duration: 60 },
                
                // Affricates
                'ț': { manner: 'affricate', place: 'alveolar', voiced: false, duration: 85 },
                'c': { manner: 'affricate', place: 'postalveolar', voiced: false, duration: 90 },
                'g': { manner: 'affricate', place: 'postalveolar', voiced: true, duration: 85 },
                
                // Nasals
                'm': { manner: 'nasal', place: 'bilabial', voiced: true, duration: 60 },
                'n': { manner: 'nasal', place: 'alveolar', voiced: true, duration: 55 },
                
                // Liquids
                'l': { manner: 'lateral', place: 'alveolar', voiced: true, duration: 50 },
                'r': { manner: 'trill', place: 'alveolar', voiced: true, duration: 45 }
            }
        };

        // Coarticulation rules - how sounds affect each other
        this.coarticulationRules = {
            // Palatalization before front vowels
            palatalization: {
                triggers: ['i', 'e', 'ea', 'ia'],
                affects: ['t', 'd', 's', 'z', 'n', 'l'],
                modification: (consonant, vowel) => {
                    return {
                        pitch: '+5%',
                        formantShift: 200,
                        duration: consonant.duration * 0.9
                    };
                }
            },
            
            // Vowel nasalization near nasal consonants
            nasalization: {
                triggers: ['m', 'n'],
                affects: ['a', 'e', 'i', 'o', 'u', 'ă', 'â'],
                modification: (vowel, nasal) => {
                    return {
                        nasalResonance: true,
                        duration: vowel.duration * 1.1,
                        formantShift: -50
                    };
                }
            },
            
            // Voice assimilation in consonant clusters
            voiceAssimilation: {
                rule: (c1, c2) => {
                    if (c1.voiced !== c2.voiced) {
                        // Regressive assimilation (second consonant affects first)
                        return { adjustFirst: true, voicing: c2.voiced };
                    }
                    return null;
                }
            },
            
            // Vowel reduction in unstressed syllables
            vowelReduction: {
                affects: ['a', 'e', 'o'],
                condition: 'unstressed',
                modification: (vowel) => {
                    return {
                        centralization: true,
                        duration: vowel.duration * 0.8,
                        amplitude: '-10%'
                    };
                }
            }
        };

        // Phonotactic constraints (sound combination rules)
        this.phonotactics = {
            syllableStructure: {
                maxOnset: 3,  // Maximum consonants at syllable start (e.g., 'stră')
                maxCoda: 2,   // Maximum consonants at syllable end (e.g., 'punct')
                validOnsets: [
                    'pr', 'br', 'tr', 'dr', 'kr', 'gr',
                    'pl', 'bl', 'kl', 'gl', 'fl', 'vl',
                    'sp', 'st', 'sk', 'șt', 'șp',
                    'str', 'spr', 'skr', 'ștr'
                ],
                validCodas: [
                    'st', 'șt', 'nt', 'nd', 'nk', 'mp',
                    'ft', 'pt', 'kt', 'lt', 'rt', 'rn'
                ]
            },
            
            // Hiatus resolution (vowel-vowel sequences)
            hiatusResolution: {
                'a-i': { insert: 'glide', sound: 'j' },
                'e-a': { insert: 'none', transition: 'smooth' },
                'o-a': { insert: 'none', transition: 'smooth' },
                'i-e': { insert: 'glide', sound: 'j' },
                'u-a': { insert: 'glide', sound: 'w' }
            }
        };
    }

    initializeProsodyEngine() {
        // Romanian stress patterns
        this.stressRules = {
            // Default: stress on penultimate syllable
            defaultPosition: -2,
            
            // Exceptions based on word endings
            suffixRules: {
                // Stress on last syllable
                '-tor': -1, '-oare': -1, '-el': -1, '-ea': -1,
                '-ie': -1, '-ică': -1, '-ist': -1, '-ism': -1,
                
                // Stress on antepenultimate
                '-ește': -3, '-ească': -3, '-ărie': -3,
                
                // Verbal forms
                '-ează': -2, '-ește': -2, '-ăsc': -2,
                '-ui': -2, '-âi': -2, '-ură': -2
            },
            
            // Compound words maintain original stress
            compounds: {
                'binecuvânta': [2, 5],  // Two stresses
                'binefăcător': [2, 5],
                'răufăcător': [1, 4]
            }
        };

        // Intonation patterns for different sentence types
        this.intonationPatterns = {
            declarative: {
                contour: [
                    { position: 0, pitch: 100 },
                    { position: 0.3, pitch: 110 },
                    { position: 0.6, pitch: 105 },
                    { position: 1.0, pitch: 80 }
                ],
                finalLengthening: 1.2
            },
            
            interrogative: {
                yesNo: {
                    contour: [
                        { position: 0, pitch: 100 },
                        { position: 0.5, pitch: 105 },
                        { position: 0.8, pitch: 115 },
                        { position: 1.0, pitch: 140 }
                    ],
                    finalLengthening: 1.3
                },
                whQuestion: {
                    contour: [
                        { position: 0, pitch: 120 },  // High start on question word
                        { position: 0.3, pitch: 110 },
                        { position: 0.7, pitch: 95 },
                        { position: 1.0, pitch: 85 }
                    ],
                    finalLengthening: 1.1
                }
            },
            
            exclamative: {
                contour: [
                    { position: 0, pitch: 110 },
                    { position: 0.4, pitch: 130 },
                    { position: 0.7, pitch: 120 },
                    { position: 1.0, pitch: 90 }
                ],
                emphasis: 'strong',
                rate: 1.1
            },
            
            imperative: {
                contour: [
                    { position: 0, pitch: 115 },
                    { position: 0.5, pitch: 125 },
                    { position: 1.0, pitch: 75 }
                ],
                emphasis: 'moderate',
                rate: 0.95
            }
        };

        // Rhythm patterns (Romanian is syllable-timed)
        this.rhythmPatterns = {
            syllableTiming: {
                isochrony: 0.8,  // How equal syllable durations are
                stressRatio: 1.3,  // Stressed vs unstressed duration
                compressionFactor: 0.9  // For fast speech
            },
            
            // Rhythmic groups (breath groups)
            phrasingRules: {
                minWords: 2,
                maxWords: 7,
                pauseAfterComma: 200,
                pauseAfterSemicolon: 300,
                pauseAfterPeriod: 500,
                breathGroupPause: 150
            }
        };
    }

    initializeContextEngine() {
        // Semantic context analysis
        this.semanticContexts = {
            formal: {
                markers: ['dumneavoastră', 'vă rog', 'cu stimă', 'respectuos'],
                adjustments: {
                    rate: 0.95,
                    pitch: 0.98,
                    articulation: 'precise',
                    pauseMultiplier: 1.1
                }
            },
            
            informal: {
                markers: ['tu', 'tău', 'hei', 'bă', 'frate'],
                adjustments: {
                    rate: 1.05,
                    pitch: 1.02,
                    articulation: 'relaxed',
                    contractions: true
                }
            },
            
            emotional: {
                joy: {
                    markers: ['fericit', 'bucuros', 'vesel', 'minunat'],
                    adjustments: { rate: 1.1, pitch: 1.15, brightness: '+20%' }
                },
                sadness: {
                    markers: ['trist', 'supărat', 'nefericit', 'durere'],
                    adjustments: { rate: 0.9, pitch: 0.95, brightness: '-15%' }
                },
                anger: {
                    markers: ['furios', 'nervos', 'supărat', 'enervat'],
                    adjustments: { rate: 1.05, pitch: 1.1, intensity: '+25%' }
                },
                fear: {
                    markers: ['frică', 'teamă', 'speriat', 'îngrijorat'],
                    adjustments: { rate: 1.15, pitch: 1.05, tremolo: true }
                }
            },
            
            technical: {
                markers: ['sistem', 'aplicație', 'funcție', 'parametru'],
                adjustments: {
                    rate: 0.98,
                    clarity: 'high',
                    pauseAtTerms: true
                }
            }
        };

        // Discourse markers and their prosodic effects
        this.discourseMarkers = {
            'deci': { pause: 'before', pitch: '+5%', lengthening: 1.2 },
            'așadar': { pause: 'both', pitch: '-5%', emphasis: true },
            'de fapt': { pause: 'before', pitch: '+8%', rate: 0.95 },
            'oricum': { pause: 'after', pitch: '-3%', rate: 1.05 },
            'totuși': { pause: 'both', pitch: '+10%', emphasis: true },
            'în plus': { pause: 'before', pitch: '+5%', rate: 0.98 },
            'pe de altă parte': { pause: 'both', pitch: 'reset', rate: 0.95 },
            'în concluzie': { pause: 'before', pitch: '-8%', rate: 0.92, final: true }
        };

        // Topic-comment structure
        this.informationStructure = {
            topicMarkers: ['despre', 'în privința', 'referitor la', 'cu privire la'],
            focusMarkers: ['exact', 'chiar', 'tocmai', 'numai', 'doar'],
            contrastiveMarkers: ['dar', 'însă', 'totuși', 'pe când'],
            
            applyTopicProsody: (text) => {
                return {
                    topicPitch: '+3%',
                    topicRate: 0.98,
                    commentPitch: 'baseline',
                    commentRate: 1.0
                };
            }
        };
    }

    /**
     * Advanced phonetic processing with coarticulation
     */
    processPhonetics(text) {
        const words = text.split(/\s+/);
        const phoneticWords = [];

        for (const word of words) {
            const phonemes = this.wordToPhonemes(word);
            const coarticulatedPhonemes = this.applyCoarticulation(phonemes);
            const syllabified = this.syllabifyWord(coarticulatedPhonemes);
            const stressed = this.applyStressPattern(syllabified, word);
            
            phoneticWords.push({
                orthographic: word,
                phonetic: stressed,
                duration: this.calculateWordDuration(stressed),
                pitch: this.calculateWordPitch(stressed, word)
            });
        }

        return this.connectWords(phoneticWords);
    }

    /**
     * Convert word to phoneme sequence
     */
    wordToPhonemes(word) {
        const phonemes = [];
        let i = 0;
        
        while (i < word.length) {
            // Check for digraphs and special combinations
            if (i < word.length - 1) {
                const digraph = word.substring(i, i + 2);
                
                // Check diphthongs
                if (this.phonemeInventory.diphthongs[digraph]) {
                    phonemes.push({
                        type: 'diphthong',
                        value: digraph,
                        ...this.phonemeInventory.diphthongs[digraph]
                    });
                    i += 2;
                    continue;
                }
                
                // Check special consonant combinations
                if (digraph === 'ch') {
                    phonemes.push({
                        type: 'consonant',
                        value: 'k',
                        ...this.phonemeInventory.consonants['k']
                    });
                    i += 2;
                    continue;
                }
                
                if (digraph === 'gh') {
                    phonemes.push({
                        type: 'consonant',
                        value: 'g',
                        ...this.phonemeInventory.consonants['g']
                    });
                    i += 2;
                    continue;
                }
            }
            
            // Single character
            const char = word[i].toLowerCase();
            
            if (this.phonemeInventory.vowels[char]) {
                phonemes.push({
                    type: 'vowel',
                    value: char,
                    ...this.phonemeInventory.vowels[char]
                });
            } else if (this.phonemeInventory.consonants[char]) {
                phonemes.push({
                    type: 'consonant',
                    value: char,
                    ...this.phonemeInventory.consonants[char]
                });
            } else {
                // Unknown character, treat as pause
                phonemes.push({
                    type: 'pause',
                    value: char,
                    duration: 10
                });
            }
            
            i++;
        }
        
        return phonemes;
    }

    /**
     * Apply coarticulation effects between adjacent phonemes
     */
    applyCoarticulation(phonemes) {
        const result = [];
        
        for (let i = 0; i < phonemes.length; i++) {
            const current = { ...phonemes[i] };
            const prev = i > 0 ? phonemes[i - 1] : null;
            const next = i < phonemes.length - 1 ? phonemes[i + 1] : null;
            
            // Apply palatalization
            if (next && this.coarticulationRules.palatalization.triggers.includes(next.value)) {
                if (this.coarticulationRules.palatalization.affects.includes(current.value)) {
                    const mod = this.coarticulationRules.palatalization.modification(current, next);
                    current.palatalized = true;
                    current.duration = mod.duration;
                    current.pitchAdjust = mod.pitch;
                }
            }
            
            // Apply nasalization
            if ((prev && prev.manner === 'nasal') || (next && next.manner === 'nasal')) {
                if (current.type === 'vowel') {
                    current.nasalized = true;
                    current.duration *= 1.1;
                }
            }
            
            // Apply voice assimilation
            if (next && current.type === 'consonant' && next.type === 'consonant') {
                const assimilation = this.coarticulationRules.voiceAssimilation.rule(current, next);
                if (assimilation && assimilation.adjustFirst) {
                    current.voiced = assimilation.voicing;
                }
            }
            
            result.push(current);
        }
        
        return result;
    }

    /**
     * Syllabify word according to Romanian phonotactics
     */
    syllabifyWord(phonemes) {
        const syllables = [];
        let currentSyllable = { onset: [], nucleus: null, coda: [] };
        let state = 'onset';
        
        for (const phoneme of phonemes) {
            if (phoneme.type === 'vowel' || phoneme.type === 'diphthong') {
                if (currentSyllable.nucleus) {
                    // New syllable
                    syllables.push(currentSyllable);
                    currentSyllable = { onset: [], nucleus: phoneme, coda: [] };
                    state = 'coda';
                } else {
                    currentSyllable.nucleus = phoneme;
                    state = 'coda';
                }
            } else if (phoneme.type === 'consonant') {
                if (state === 'onset' || !currentSyllable.nucleus) {
                    currentSyllable.onset.push(phoneme);
                } else {
                    // Check if this consonant should start a new syllable
                    if (currentSyllable.coda.length > 0) {
                        const potentialOnset = currentSyllable.coda.concat(phoneme);
                        if (this.isValidOnset(potentialOnset)) {
                            // Move consonants to next syllable
                            syllables.push(currentSyllable);
                            currentSyllable = { onset: potentialOnset, nucleus: null, coda: [] };
                            state = 'onset';
                        } else {
                            currentSyllable.coda.push(phoneme);
                        }
                    } else {
                        currentSyllable.coda.push(phoneme);
                    }
                }
            }
        }
        
        if (currentSyllable.nucleus) {
            syllables.push(currentSyllable);
        }
        
        return syllables;
    }

    /**
     * Check if consonant cluster is valid syllable onset
     */
    isValidOnset(consonants) {
        if (consonants.length === 0) return true;
        if (consonants.length === 1) return true;
        
        const cluster = consonants.map(c => c.value).join('');
        return this.phonotactics.syllableStructure.validOnsets.includes(cluster);
    }

    /**
     * Apply stress pattern to syllabified word
     */
    applyStressPattern(syllables, word) {
        let stressPosition = this.stressRules.defaultPosition;
        
        // Check for suffix rules
        for (const [suffix, position] of Object.entries(this.stressRules.suffixRules)) {
            if (word.endsWith(suffix.substring(1))) {
                stressPosition = position;
                break;
            }
        }
        
        // Check for compound words
        if (this.stressRules.compounds[word]) {
            // Apply multiple stresses
            const positions = this.stressRules.compounds[word];
            positions.forEach(pos => {
                if (syllables[pos - 1]) {
                    syllables[pos - 1].stress = 'primary';
                }
            });
            return syllables;
        }
        
        // Apply single stress
        const stressIndex = stressPosition < 0 
            ? syllables.length + stressPosition 
            : stressPosition - 1;
            
        if (syllables[stressIndex]) {
            syllables[stressIndex].stress = 'primary';
            
            // Apply secondary stress if word is long enough
            if (syllables.length > 4) {
                const secondaryIndex = stressIndex > 2 ? 0 : syllables.length - 1;
                syllables[secondaryIndex].stress = 'secondary';
            }
        }
        
        return syllables;
    }

    /**
     * Calculate duration for entire word
     */
    calculateWordDuration(syllables) {
        let totalDuration = 0;
        
        for (const syllable of syllables) {
            // Onset duration
            totalDuration += syllable.onset.reduce((sum, p) => sum + (p.duration || 50), 0);
            
            // Nucleus duration (adjusted for stress)
            let nucleusDuration = syllable.nucleus.duration || 80;
            if (syllable.stress === 'primary') {
                nucleusDuration *= 1.3;
            } else if (syllable.stress === 'secondary') {
                nucleusDuration *= 1.15;
            }
            totalDuration += nucleusDuration;
            
            // Coda duration
            totalDuration += syllable.coda.reduce((sum, p) => sum + (p.duration || 50), 0);
        }
        
        return totalDuration;
    }

    /**
     * Calculate pitch contour for word
     */
    calculateWordPitch(syllables, word) {
        const pitchContour = [];
        
        for (let i = 0; i < syllables.length; i++) {
            const syllable = syllables[i];
            let pitch = 100; // Baseline
            
            // Stress-based pitch
            if (syllable.stress === 'primary') {
                pitch = 115;
            } else if (syllable.stress === 'secondary') {
                pitch = 108;
            } else {
                pitch = 95;
            }
            
            // Position-based adjustment
            if (i === 0) {
                pitch += 5; // Slightly higher start
            } else if (i === syllables.length - 1) {
                pitch -= 10; // Lower at end (for declaratives)
            }
            
            pitchContour.push({
                position: i / syllables.length,
                pitch: pitch,
                syllable: syllable
            });
        }
        
        return pitchContour;
    }

    /**
     * Connect words with appropriate juncture phenomena
     */
    connectWords(phoneticWords) {
        const connected = [];
        
        for (let i = 0; i < phoneticWords.length; i++) {
            const current = phoneticWords[i];
            const next = phoneticWords[i + 1];
            
            connected.push(current);
            
            if (next) {
                // Check for liaison
                const lastSound = this.getLastSound(current);
                const firstSound = this.getFirstSound(next);
                
                // Apply sandhi rules (sound changes at word boundaries)
                const juncture = this.calculateJuncture(lastSound, firstSound);
                if (juncture) {
                    connected.push(juncture);
                }
            }
        }
        
        return connected;
    }

    /**
     * Get last phonetic sound of word
     */
    getLastSound(word) {
        const lastSyllable = word.phonetic[word.phonetic.length - 1];
        if (lastSyllable.coda.length > 0) {
            return lastSyllable.coda[lastSyllable.coda.length - 1];
        }
        return lastSyllable.nucleus;
    }

    /**
     * Get first phonetic sound of word
     */
    getFirstSound(word) {
        const firstSyllable = word.phonetic[0];
        if (firstSyllable.onset.length > 0) {
            return firstSyllable.onset[0];
        }
        return firstSyllable.nucleus;
    }

    /**
     * Calculate juncture between words
     */
    calculateJuncture(sound1, sound2) {
        // Avoid hiatus (vowel-vowel sequences)
        if ((sound1.type === 'vowel' || sound1.type === 'diphthong') &&
            (sound2.type === 'vowel' || sound2.type === 'diphthong')) {
            
            const hiatusKey = `${sound1.value}-${sound2.value}`;
            const resolution = this.phonotactics.hiatusResolution[hiatusKey];
            
            if (resolution) {
                if (resolution.insert === 'glide') {
                    return {
                        type: 'glide',
                        value: resolution.sound,
                        duration: 30
                    };
                }
            }
            
            // Default: add small pause
            return {
                type: 'pause',
                duration: 50
            };
        }
        
        // Consonant clusters at boundaries
        if (sound1.type === 'consonant' && sound2.type === 'consonant') {
            // Check for assimilation
            if (sound1.place === sound2.place) {
                // Gemination (lengthening)
                return {
                    type: 'lengthening',
                    duration: 20
                };
            }
        }
        
        // Default: minimal pause
        return {
            type: 'pause',
            duration: 10
        };
    }

    /**
     * Analyze and apply prosody based on sentence type and context
     */
    applyProsody(text, phoneticData) {
        const sentenceType = this.detectSentenceType(text);
        const emotionalContext = this.detectEmotionalContext(text);
        const discourseStructure = this.analyzeDiscourseStructure(text);
        
        // Get base intonation pattern
        let intonationPattern = this.intonationPatterns[sentenceType] || 
                              this.intonationPatterns.declarative;
        
        // Modify based on emotional context
        if (emotionalContext) {
            intonationPattern = this.blendIntonationWithEmotion(
                intonationPattern, 
                emotionalContext
            );
        }
        
        // Apply discourse markers
        const markedSegments = this.applyDiscourseMarkers(text, phoneticData);
        
        // Calculate rhythm and phrasing
        const rhythmicGroups = this.createRhythmicGroups(markedSegments);
        
        // Generate final prosodic representation
        return this.generateProsodicRepresentation(
            rhythmicGroups,
            intonationPattern,
            discourseStructure
        );
    }

    /**
     * Detect sentence type from punctuation and structure
     */
    detectSentenceType(text) {
        if (text.includes('?')) {
            // Check if it's a yes/no or wh-question
            const whWords = ['cine', 'ce', 'unde', 'când', 'cum', 'de ce', 'care', 'cât'];
            const hasWhWord = whWords.some(word => 
                text.toLowerCase().includes(word)
            );
            
            return hasWhWord ? 'whQuestion' : 'yesNo';
        } else if (text.includes('!')) {
            // Check if imperative or exclamative
            const imperativeMarkers = ['să', 'hai', 'haide'];
            const hasImperative = imperativeMarkers.some(marker =>
                text.toLowerCase().startsWith(marker)
            );
            
            return hasImperative ? 'imperative' : 'exclamative';
        } else {
            return 'declarative';
        }
    }

    /**
     * Detect emotional context from lexical markers
     */
    detectEmotionalContext(text) {
        const lowerText = text.toLowerCase();
        
        for (const [emotion, config] of Object.entries(this.semanticContexts.emotional)) {
            if (config.markers.some(marker => lowerText.includes(marker))) {
                return {
                    emotion: emotion,
                    intensity: this.calculateEmotionalIntensity(text, config.markers),
                    adjustments: config.adjustments
                };
            }
        }
        
        return null;
    }

    /**
     * Calculate emotional intensity based on marker frequency
     */
    calculateEmotionalIntensity(text, markers) {
        const words = text.toLowerCase().split(/\s+/);
        const markerCount = words.filter(word => 
            markers.includes(word)
        ).length;
        
        const intensity = markerCount / words.length;
        
        if (intensity > 0.1) return 'high';
        if (intensity > 0.05) return 'medium';
        return 'low';
    }

    /**
     * Analyze discourse structure
     */
    analyzeDiscourseStructure(text) {
        const structure = {
            topic: null,
            comment: null,
            focus: [],
            contrast: []
        };
        
        // Find topic markers
        for (const marker of this.informationStructure.topicMarkers) {
            const index = text.indexOf(marker);
            if (index !== -1) {
                structure.topic = {
                    start: index,
                    end: index + marker.length,
                    marker: marker
                };
                break;
            }
        }
        
        // Find focus markers
        for (const marker of this.informationStructure.focusMarkers) {
            let index = text.indexOf(marker);
            while (index !== -1) {
                structure.focus.push({
                    position: index,
                    marker: marker
                });
                index = text.indexOf(marker, index + 1);
            }
        }
        
        return structure;
    }

    /**
     * Blend base intonation with emotional prosody
     */
    blendIntonationWithEmotion(basePattern, emotionalContext) {
        const blended = JSON.parse(JSON.stringify(basePattern));
        const adjustments = emotionalContext.adjustments;
        
        // Adjust pitch contour
        if (adjustments.pitch) {
            const pitchMultiplier = parseFloat(adjustments.pitch);
            blended.contour = blended.contour.map(point => ({
                ...point,
                pitch: point.pitch * pitchMultiplier
            }));
        }
        
        // Adjust rate
        if (adjustments.rate) {
            blended.rate = adjustments.rate;
        }
        
        // Add emotional effects
        if (adjustments.tremolo) {
            blended.tremolo = {
                frequency: 4,  // Hz
                depth: 0.1     // 10% variation
            };
        }
        
        if (adjustments.brightness) {
            blended.brightness = adjustments.brightness;
        }
        
        return blended;
    }

    /**
     * Apply discourse markers to phonetic segments
     */
    applyDiscourseMarkers(text, phoneticData) {
        const segments = [...phoneticData];
        
        for (const [marker, effects] of Object.entries(this.discourseMarkers)) {
            const index = text.indexOf(marker);
            if (index !== -1) {
                // Find corresponding phonetic segment
                const segmentIndex = this.findPhoneticSegmentIndex(segments, index);
                
                if (segmentIndex !== -1) {
                    // Apply effects
                    if (effects.pause === 'before' || effects.pause === 'both') {
                        segments.splice(segmentIndex, 0, {
                            type: 'pause',
                            duration: 200
                        });
                    }
                    
                    if (effects.pause === 'after' || effects.pause === 'both') {
                        segments.splice(segmentIndex + 1, 0, {
                            type: 'pause',
                            duration: 200
                        });
                    }
                    
                    // Apply pitch and rate changes
                    segments[segmentIndex].pitchAdjust = effects.pitch;
                    segments[segmentIndex].rateAdjust = effects.rate;
                    segments[segmentIndex].emphasis = effects.emphasis;
                }
            }
        }
        
        return segments;
    }

    /**
     * Find phonetic segment corresponding to text position
     */
    findPhoneticSegmentIndex(segments, textPosition) {
        let currentPosition = 0;
        
        for (let i = 0; i < segments.length; i++) {
            if (segments[i].orthographic) {
                const wordLength = segments[i].orthographic.length;
                if (currentPosition <= textPosition && 
                    textPosition < currentPosition + wordLength) {
                    return i;
                }
                currentPosition += wordLength + 1; // +1 for space
            }
        }
        
        return -1;
    }

    /**
     * Create rhythmic groups for natural phrasing
     */
    createRhythmicGroups(segments) {
        const groups = [];
        let currentGroup = [];
        let wordCount = 0;
        
        for (const segment of segments) {
            if (segment.orthographic) {
                currentGroup.push(segment);
                wordCount++;
                
                // Check if we should end the group
                const shouldEndGroup = 
                    wordCount >= this.rhythmPatterns.phrasingRules.maxWords ||
                    (wordCount >= this.rhythmPatterns.phrasingRules.minWords && 
                     this.isNaturalBreak(segment));
                
                if (shouldEndGroup) {
                    groups.push({
                        segments: currentGroup,
                        type: 'rhythmic_group',
                        wordCount: wordCount
                    });
                    currentGroup = [];
                    wordCount = 0;
                }
            } else if (segment.type === 'pause') {
                if (currentGroup.length > 0) {
                    groups.push({
                        segments: currentGroup,
                        type: 'rhythmic_group',
                        wordCount: wordCount
                    });
                    currentGroup = [];
                    wordCount = 0;
                }
                groups.push(segment);
            }
        }
        
        if (currentGroup.length > 0) {
            groups.push({
                segments: currentGroup,
                type: 'rhythmic_group',
                wordCount: wordCount
            });
        }
        
        return groups;
    }

    /**
     * Check if position is natural breaking point
     */
    isNaturalBreak(segment) {
        const punctuation = [',', ';', ':', '-'];
        return punctuation.some(p => 
            segment.orthographic.includes(p)
        );
    }

    /**
     * Generate final prosodic representation
     */
    generateProsodicRepresentation(rhythmicGroups, intonation, discourse) {
        const prosody = {
            groups: [],
            globalContour: intonation.contour,
            rate: intonation.rate || 1.0,
            emphasis: intonation.emphasis
        };
        
        for (let i = 0; i < rhythmicGroups.length; i++) {
            const group = rhythmicGroups[i];
            
            if (group.type === 'rhythmic_group') {
                const groupProsody = {
                    segments: group.segments,
                    localContour: this.calculateLocalContour(
                        group, 
                        i / rhythmicGroups.length
                    ),
                    timing: this.calculateGroupTiming(group),
                    prominence: this.calculateProminence(group, discourse)
                };
                
                prosody.groups.push(groupProsody);
            } else {
                prosody.groups.push(group);
            }
        }
        
        return prosody;
    }

    /**
     * Calculate local pitch contour for rhythmic group
     */
    calculateLocalContour(group, globalPosition) {
        const contour = [];
        const segmentCount = group.segments.length;
        
        for (let i = 0; i < segmentCount; i++) {
            const segment = group.segments[i];
            const localPosition = i / segmentCount;
            
            // Interpolate from global contour
            const globalPitch = this.interpolatePitch(
                this.intonationPatterns.declarative.contour,
                globalPosition + localPosition / 10
            );
            
            // Add local variations
            let localPitch = globalPitch;
            
            if (segment.phonetic) {
                // Add stress-based variation
                const hasStress = segment.phonetic.some(syll => 
                    syll.stress === 'primary'
                );
                
                if (hasStress) {
                    localPitch *= 1.1;
                }
            }
            
            contour.push({
                position: localPosition,
                pitch: localPitch,
                segment: segment
            });
        }
        
        return contour;
    }

    /**
     * Interpolate pitch value from contour
     */
    interpolatePitch(contour, position) {
        // Find surrounding points
        let before = contour[0];
        let after = contour[contour.length - 1];
        
        for (let i = 0; i < contour.length - 1; i++) {
            if (contour[i].position <= position && 
                contour[i + 1].position > position) {
                before = contour[i];
                after = contour[i + 1];
                break;
            }
        }
        
        // Linear interpolation
        const range = after.position - before.position;
        const relativePos = (position - before.position) / range;
        const pitchDiff = after.pitch - before.pitch;
        
        return before.pitch + pitchDiff * relativePos;
    }

    /**
     * Calculate timing for rhythmic group
     */
    calculateGroupTiming(group) {
        const timing = {
            totalDuration: 0,
            syllableDurations: [],
            stressPattern: []
        };
        
        for (const segment of group.segments) {
            if (segment.duration) {
                timing.totalDuration += segment.duration;
            }
            
            if (segment.phonetic) {
                for (const syllable of segment.phonetic) {
                    const syllDuration = this.calculateSyllableDuration(syllable);
                    timing.syllableDurations.push(syllDuration);
                    
                    if (syllable.stress) {
                        timing.stressPattern.push({
                            position: timing.syllableDurations.length - 1,
                            level: syllable.stress
                        });
                    }
                }
            }
        }
        
        // Apply syllable-timed rhythm
        timing.adjustedDurations = this.applySyllableTiming(
            timing.syllableDurations,
            timing.stressPattern
        );
        
        return timing;
    }

    /**
     * Calculate duration for single syllable
     */
    calculateSyllableDuration(syllable) {
        let duration = 0;
        
        // Onset
        duration += syllable.onset.reduce((sum, p) => 
            sum + (p.duration || 50), 0
        );
        
        // Nucleus
        duration += syllable.nucleus.duration || 80;
        
        // Coda
        duration += syllable.coda.reduce((sum, p) => 
            sum + (p.duration || 50), 0
        );
        
        // Adjust for stress
        if (syllable.stress === 'primary') {
            duration *= this.rhythmPatterns.syllableTiming.stressRatio;
        } else if (syllable.stress === 'secondary') {
            duration *= (this.rhythmPatterns.syllableTiming.stressRatio * 0.8);
        }
        
        return duration;
    }

    /**
     * Apply syllable-timed rhythm characteristic of Romanian
     */
    applySyllableTiming(durations, stressPattern) {
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        const adjusted = [];
        
        for (let i = 0; i < durations.length; i++) {
            let targetDuration = avgDuration;
            
            // Check if syllable is stressed
            const isStressed = stressPattern.some(s => s.position === i);
            
            if (isStressed) {
                targetDuration *= this.rhythmPatterns.syllableTiming.stressRatio;
            }
            
            // Apply isochrony (tendency toward equal duration)
            const currentDuration = durations[i];
            const adjustedDuration = currentDuration * (1 - this.rhythmPatterns.syllableTiming.isochrony) +
                                    targetDuration * this.rhythmPatterns.syllableTiming.isochrony;
            
            adjusted.push(adjustedDuration);
        }
        
        return adjusted;
    }

    /**
     * Calculate prominence for information structure
     */
    calculateProminence(group, discourse) {
        const prominence = {
            level: 'normal',
            focusWords: [],
            topicMarking: false
        };
        
        // Check if group contains topic
        if (discourse.topic) {
            const containsTopic = group.segments.some(seg =>
                seg.orthographic && 
                seg.orthographic.includes(discourse.topic.marker)
            );
            
            if (containsTopic) {
                prominence.topicMarking = true;
                prominence.level = 'reduced';
            }
        }
        
        // Check for focus markers
        for (const focus of discourse.focus) {
            const containsFocus = group.segments.some(seg =>
                seg.orthographic && 
                seg.orthographic.includes(focus.marker)
            );
            
            if (containsFocus) {
                prominence.focusWords.push(focus.marker);
                prominence.level = 'enhanced';
            }
        }
        
        return prominence;
    }

    /**
     * Generate SSML with all enhancements
     */
    generateEnhancedSSML(text, options = {}) {
        const phoneticData = this.processPhonetics(text);
        const prosody = this.applyProsody(text, phoneticData);
        
        let ssml = '<speak version="1.1" xml:lang="ro-RO">\n';
        
        // Add voice selection if specified
        if (options.voice) {
            ssml += `  <voice name="${options.voice}">\n`;
        }
        
        // Process each prosodic group
        for (const group of prosody.groups) {
            if (group.type === 'rhythmic_group') {
                ssml += this.groupToSSML(group, prosody);
            } else if (group.type === 'pause') {
                ssml += `    <break time="${group.duration}ms"/>\n`;
            }
        }
        
        if (options.voice) {
            ssml += '  </voice>\n';
        }
        
        ssml += '</speak>';
        
        return ssml;
    }

    /**
     * Convert prosodic group to SSML
     */
    groupToSSML(group, globalProsody) {
        let ssml = '    <prosody';
        
        // Add rate if different from default
        if (globalProsody.rate && globalProsody.rate !== 1.0) {
            ssml += ` rate="${Math.round(globalProsody.rate * 100)}%"`;
        }
        
        // Add pitch contour
        if (group.localContour && group.localContour.length > 0) {
            const contourString = group.localContour.map(point =>
                `(${Math.round(point.position * 100)}%, ${Math.round(point.pitch)}Hz)`
            ).join(' ');
            ssml += ` contour="${contourString}"`;
        }
        
        ssml += '>\n';
        
        // Add segments with appropriate markup
        for (const segment of group.segments) {
            if (segment.emphasis) {
                ssml += `      <emphasis level="${segment.emphasis}">`;
            }
            
            // Add phoneme hints for difficult words
            if (segment.phonetic && this.needsPhonemeHint(segment)) {
                ssml += `<phoneme alphabet="ipa" ph="${this.toIPA(segment.phonetic)}">`;
                ssml += segment.orthographic;
                ssml += '</phoneme>';
            } else {
                ssml += segment.orthographic;
            }
            
            if (segment.emphasis) {
                ssml += '</emphasis>';
            }
            
            ssml += ' ';
        }
        
        ssml += '\n    </prosody>\n';
        
        return ssml;
    }

    /**
     * Check if word needs phoneme hint
     */
    needsPhonemeHint(segment) {
        // Words that are often mispronounced
        const difficultWords = [
            'societate', 'februarie', 'creier', 'miere',
            'Europe', 'euro', 'poezie', 'geografie'
        ];
        
        return difficultWords.includes(segment.orthographic.toLowerCase());
    }

    /**
     * Convert phonetic representation to IPA
     */
    toIPA(phonetic) {
        let ipa = '';
        
        for (const syllable of phonetic) {
            // Add stress marker if needed
            if (syllable.stress === 'primary') {
                ipa += 'ˈ';
            } else if (syllable.stress === 'secondary') {
                ipa += 'ˌ';
            }
            
            // Add onset
            for (const phoneme of syllable.onset) {
                ipa += phoneme.ipa || phoneme.value;
            }
            
            // Add nucleus
            ipa += syllable.nucleus.ipa || syllable.nucleus.value;
            
            // Add coda
            for (const phoneme of syllable.coda) {
                ipa += phoneme.ipa || phoneme.value;
            }
        }
        
        return ipa;
    }
}

// Export the enhanced class
export default RomanianNaturalSpeech;