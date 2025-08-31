/**
 * Real-time Romanian TTS Optimization System
 * Dynamically adjusts pronunciation based on context and feedback
 */

class RomanianRealtimeOptimizer {
    constructor() {
        this.processingPipeline = this.initializePipeline();
        this.acousticAnalyzer = new AcousticFeatureAnalyzer();
        this.intelligibilityPredictor = new IntelligibilityModel();
        this.naturalnessScorerr = new NaturalnessScorer();
        this.dynamicAdjuster = new DynamicPronunciationAdjuster();
    }

    initializePipeline() {
        return {
            stages: [
                { name: 'lexical', function: this.lexicalAnalysis.bind(this) },
                { name: 'phonological', function: this.phonologicalProcessing.bind(this) },
                { name: 'prosodic', function: this.prosodicModeling.bind(this) },
                { name: 'acoustic', function: this.acousticRealization.bind(this) },
                { name: 'optimization', function: this.realtimeOptimization.bind(this) }
            ],
            
            bufferSize: 512,  // samples
            lookahead: 200,   // ms
            latency: 20,      // ms target latency
            
            adaptiveParameters: {
                clarity: 0.8,
                naturalness: 0.7,
                expressiveness: 0.6,
                intelligibility: 0.9
            }
        };
    }

    /**
     * Lexical Analysis Stage
     * Performs deep morphological and semantic analysis
     */
    lexicalAnalysis(text) {
        const analysis = {
            tokens: [],
            morphemes: [],
            semanticRoles: [],
            pragmaticMarkers: []
        };

        // Advanced tokenization with sub-word units
        const words = text.split(/\s+/);
        
        for (const word of words) {
            const token = {
                surface: word,
                lemma: this.lemmatize(word),
                pos: this.tagPOS(word),
                morphology: this.analyzeMorphology(word),
                semantics: this.extractSemantics(word),
                frequency: this.getWordFrequency(word),
                predictability: this.calculatePredictability(word, words)
            };
            
            // Decompose into morphemes
            token.morphemes = this.decomposeMorphemes(word);
            
            // Identify special categories
            token.isContentWord = this.isContentWord(token.pos);
            token.isFunctionWord = !token.isContentWord;
            token.isNamedEntity = this.detectNamedEntity(word);
            token.isLoanword = this.detectLoanword(word);
            token.isAbbreviation = this.detectAbbreviation(word);
            
            analysis.tokens.push(token);
        }

        // Extract semantic roles and relationships
        analysis.semanticRoles = this.extractSemanticRoles(analysis.tokens);
        analysis.pragmaticMarkers = this.identifyPragmaticMarkers(analysis.tokens);
        
        // Calculate information density
        analysis.informationDensity = this.calculateInformationDensity(analysis.tokens);
        
        return analysis;
    }

    /**
     * Advanced morphological decomposition
     */
    decomposeMorphemes(word) {
        const morphemes = [];
        
        // Romanian prefixes
        const prefixes = [
            'ne', 'în', 'îm', 'des', 'dez', 're', 'pre', 'anti', 'contra',
            'sub', 'super', 'inter', 'trans', 'ultra', 'extra', 'auto'
        ];
        
        // Romanian suffixes
        const suffixes = [
            // Verbal
            'ez', 'esc', 'ează', 'ește', 'ăsc', 'ui', 'âi', 'î', 'u',
            'am', 'ai', 'a', 'ăm', 'ați', 'au', 'eam', 'eai', 'ea',
            'asem', 'aseși', 'ase', 'aserăm', 'aserăți', 'aseră',
            
            // Nominal
            'tor', 'toare', 'ător', 'ătoare', 'ime', 'ărie', 'erie',
            'ist', 'ism', 'itate', 'ență', 'anță', 'ință', 'eață',
            'el', 'ică', 'uț', 'uleț', 'ișor', 'aș', 'an', 'ean',
            
            // Adjectival
            'os', 'oasă', 'nic', 'nică', 'esc', 'ească', 'bil', 'bilă'
        ];
        
        let remaining = word.toLowerCase();
        
        // Extract prefixes
        for (const prefix of prefixes) {
            if (remaining.startsWith(prefix)) {
                morphemes.push({
                    type: 'prefix',
                    form: prefix,
                    meaning: this.getPrefixMeaning(prefix)
                });
                remaining = remaining.substring(prefix.length);
                break;
            }
        }
        
        // Extract suffixes
        for (const suffix of suffixes) {
            if (remaining.endsWith(suffix)) {
                const root = remaining.substring(0, remaining.length - suffix.length);
                if (root.length > 2) {  // Ensure meaningful root
                    morphemes.push({
                        type: 'root',
                        form: root,
                        meaning: this.getRootMeaning(root)
                    });
                    morphemes.push({
                        type: 'suffix',
                        form: suffix,
                        meaning: this.getSuffixMeaning(suffix)
                    });
                    remaining = '';
                    break;
                }
            }
        }
        
        // If no decomposition, treat as single morpheme
        if (remaining && morphemes.length === 0) {
            morphemes.push({
                type: 'root',
                form: remaining,
                meaning: this.getRootMeaning(remaining)
            });
        }
        
        return morphemes;
    }

    /**
     * Calculate word predictability from context
     */
    calculatePredictability(word, context) {
        // Simplified n-gram model
        const index = context.indexOf(word);
        if (index <= 0) return 0.5;
        
        const previousWord = context[index - 1];
        const bigram = `${previousWord}_${word}`;
        
        // Common Romanian bigrams
        const commonBigrams = {
            'în_care': 0.9,
            'de_la': 0.9,
            'și_cu': 0.8,
            'pentru_că': 0.85,
            'dar_nu': 0.75,
            'este_un': 0.8,
            'este_o': 0.8,
            'sunt_în': 0.7,
            'am_fost': 0.75,
            'nu_este': 0.8,
            'nu_sunt': 0.75,
            'că_nu': 0.7,
            'la_fel': 0.85,
            'în_timp': 0.8,
            'timp_ce': 0.9
        };
        
        return commonBigrams[bigram] || 0.3;
    }

    /**
     * Calculate information density for speech rate adjustment
     */
    calculateInformationDensity(tokens) {
        let totalInformation = 0;
        
        for (const token of tokens) {
            // Content words carry more information
            const contentWeight = token.isContentWord ? 1.0 : 0.3;
            
            // Rare words carry more information
            const frequencyWeight = 1 - (token.frequency || 0.5);
            
            // Unpredictable words carry more information
            const predictabilityWeight = 1 - (token.predictability || 0.5);
            
            // Named entities are information-dense
            const entityWeight = token.isNamedEntity ? 1.5 : 1.0;
            
            totalInformation += contentWeight * frequencyWeight * 
                              predictabilityWeight * entityWeight;
        }
        
        return totalInformation / tokens.length;
    }

    /**
     * Phonological Processing Stage
     * Applies complex phonological rules
     */
    phonologicalProcessing(lexicalData) {
        const processed = {
            segments: [],
            syllables: [],
            feet: [],
            phonologicalWords: []
        };

        for (const token of lexicalData.tokens) {
            // Convert to phonological representation
            const phonological = this.lexicalToPhonological(token);
            
            // Apply phonological rules in order
            let segments = phonological.segments;
            
            // 1. Vowel harmony (limited in Romanian)
            segments = this.applyVowelHarmony(segments);
            
            // 2. Consonant mutations
            segments = this.applyConsonantMutations(segments, token);
            
            // 3. Epenthesis (vowel insertion)
            segments = this.applyEpenthesis(segments);
            
            // 4. Deletion rules
            segments = this.applyDeletionRules(segments, token);
            
            // 5. Assimilation processes
            segments = this.applyAssimilation(segments);
            
            // 6. Palatalization
            segments = this.applyPalatalization(segments);
            
            // 7. Final devoicing
            segments = this.applyFinalDevoicing(segments);
            
            // Syllabification
            const syllables = this.syllabify(segments);
            
            // Stress assignment
            const stressedSyllables = this.assignStress(syllables, token);
            
            // Foot structure
            const feet = this.buildFeet(stressedSyllables);
            
            processed.segments.push(...segments);
            processed.syllables.push(...stressedSyllables);
            processed.feet.push(...feet);
            processed.phonologicalWords.push({
                token: token,
                segments: segments,
                syllables: stressedSyllables,
                feet: feet
            });
        }

        // Apply sandhi rules across word boundaries
        processed.segments = this.applySandhi(processed.segments);
        
        return processed;
    }

    /**
     * Apply vowel harmony rules
     */
    applyVowelHarmony(segments) {
        // Romanian has limited vowel harmony, mainly in loanwords
        const harmonized = [...segments];
        
        for (let i = 0; i < harmonized.length - 1; i++) {
            // ă → a before back vowels
            if (harmonized[i].phoneme === 'ă') {
                const next = harmonized[i + 1];
                if (next && /[ou]/.test(next.phoneme)) {
                    harmonized[i].phoneme = 'a';
                    harmonized[i].harmonized = true;
                }
            }
        }
        
        return harmonized;
    }

    /**
     * Apply palatalization rules
     */
    applyPalatalization(segments) {
        const palatalized = [...segments];
        
        for (let i = 0; i < palatalized.length - 1; i++) {
            const current = palatalized[i];
            const next = palatalized[i + 1];
            
            // Palatalize consonants before front vowels
            if (/[tdsnlrk]/.test(current.phoneme) && /[ie]/.test(next?.phoneme)) {
                current.palatalized = true;
                current.features.place = 'palatal';
                
                // Acoustic adjustments for palatalization
                current.acoustics = {
                    ...current.acoustics,
                    F2_locus: (current.acoustics?.F2_locus || 1800) + 300,
                    spectralPeak: (current.acoustics?.spectralPeak || 3000) + 500
                };
            }
        }
        
        return palatalized;
    }

    /**
     * Prosodic Modeling Stage
     * Creates sophisticated prosodic contours
     */
    prosodicModeling(phonologicalData) {
        const prosody = {
            pitch: [],
            intensity: [],
            duration: [],
            rhythm: null
        };

        // Build prosodic hierarchy
        const hierarchy = this.buildProsodicHierarchy(phonologicalData);
        
        // Generate pitch contour using ToBI-like model
        prosody.pitch = this.generatePitchContour(hierarchy);
        
        // Model intensity patterns
        prosody.intensity = this.modelIntensityPattern(hierarchy);
        
        // Calculate durations with all factors
        prosody.duration = this.calculateDurations(hierarchy);
        
        // Analyze and adjust rhythm
        prosody.rhythm = this.analyzeRhythm(prosody.duration);
        
        // Apply declination
        prosody.pitch = this.applyDeclination(prosody.pitch);
        
        // Add boundary tones
        prosody = this.addBoundaryTones(prosody, hierarchy);
        
        // Model focus and emphasis
        prosody = this.modelFocusEffects(prosody, hierarchy);
        
        return prosody;
    }

    /**
     * Generate pitch contour using autosegmental model
     */
    generatePitchContour(hierarchy) {
        const contour = [];
        const baseF0 = 120;  // Hz
        
        for (const phrase of hierarchy.intonationalPhrases) {
            // Phrase accent
            const phraseAccent = this.selectPhraseAccent(phrase);
            
            for (const word of phrase.words) {
                // Pitch accent selection
                const pitchAccent = this.selectPitchAccent(word, phrase);
                
                // Generate targets
                const targets = this.generatePitchTargets(pitchAccent, phraseAccent);
                
                // Interpolate between targets
                const wordContour = this.interpolatePitchTargets(targets, word.duration);
                
                contour.push(...wordContour);
            }
            
            // Boundary tone
            const boundaryTone = this.selectBoundaryTone(phrase);
            contour.push(...this.generateBoundaryContour(boundaryTone));
        }
        
        return contour;
    }

    /**
     * Select appropriate pitch accent based on context
     */
    selectPitchAccent(word, phrase) {
        // Romanian pitch accent inventory
        const accents = {
            H: { peak: 1.3, alignment: 'early' },      // High
            L: { peak: 0.8, alignment: 'late' },       // Low
            LH: { peak: 1.25, alignment: 'rise' },     // Rising
            HL: { peak: 1.2, alignment: 'fall' },      // Falling
            LHL: { peak: 1.3, alignment: 'complex' }   // Rise-fall
        };
        
        // Select based on information structure
        if (word.isFocus) {
            return phrase.type === 'question' ? accents.LH : accents.HL;
        } else if (word.isGiven) {
            return accents.L;
        } else if (word.isContentWord) {
            return accents.H;
        } else {
            return null;  // No accent
        }
    }

    /**
     * Acoustic Realization Stage
     * Converts abstract representations to acoustic parameters
     */
    acousticRealization(prosodicData) {
        const acoustic = {
            formants: [],
            spectralTilt: [],
            harmonics: [],
            noise: [],
            voicing: []
        };

        // Generate formant trajectories
        acoustic.formants = this.generateFormantTrajectories(prosodicData);
        
        // Calculate spectral characteristics
        acoustic.spectralTilt = this.calculateSpectralTilt(prosodicData);
        
        // Model harmonic structure
        acoustic.harmonics = this.modelHarmonicStructure(prosodicData);
        
        // Add noise components
        acoustic.noise = this.generateNoiseComponents(prosodicData);
        
        // Voice source modeling
        acoustic.voicing = this.modelVoiceSource(prosodicData);
        
        // Apply coarticulation in acoustic domain
        acoustic = this.applyAcousticCoarticulation(acoustic);
        
        return acoustic;
    }

    /**
     * Generate smooth formant trajectories
     */
    generateFormantTrajectories(data) {
        const trajectories = {
            F1: [],
            F2: [],
            F3: [],
            F4: []
        };

        for (const segment of data.segments) {
            const targets = this.getFormantTargets(segment);
            
            // Add transitions between segments
            if (trajectories.F1.length > 0) {
                const transition = this.calculateFormantTransition(
                    trajectories,
                    targets,
                    segment.duration
                );
                
                // Add transition points
                for (const formant of ['F1', 'F2', 'F3', 'F4']) {
                    trajectories[formant].push(...transition[formant]);
                }
            }
            
            // Add steady state
            for (const formant of ['F1', 'F2', 'F3', 'F4']) {
                const steadyState = Array(segment.steadyStateDuration).fill(targets[formant]);
                trajectories[formant].push(...steadyState);
            }
        }

        // Smooth trajectories
        for (const formant of ['F1', 'F2', 'F3', 'F4']) {
            trajectories[formant] = this.smoothTrajectory(trajectories[formant]);
        }

        return trajectories;
    }

    /**
     * Real-time Optimization Stage
     * Dynamically adjusts parameters for optimal output
     */
    realtimeOptimization(acousticData) {
        const optimized = { ...acousticData };
        
        // Predict intelligibility
        const intelligibilityScore = this.intelligibilityPredictor.predict(acousticData);
        
        // Predict naturalness
        const naturalnessScore = this.naturalnessScorerr.score(acousticData);
        
        // Dynamic adjustments based on scores
        if (intelligibilityScore < this.processingPipeline.adaptiveParameters.intelligibility) {
            optimized.adjustments = this.enhanceIntelligibility(optimized);
        }
        
        if (naturalnessScore < this.processingPipeline.adaptiveParameters.naturalness) {
            optimized.adjustments = this.enhanceNaturalness(optimized);
        }
        
        // Context-aware optimization
        optimized.contextOptimizations = this.optimizeForContext(optimized);
        
        // Perceptual optimization
        optimized.perceptualEnhancements = this.optimizePerceptually(optimized);
        
        return optimized;
    }

    /**
     * Enhance intelligibility when score is low
     */
    enhanceIntelligibility(data) {
        const enhancements = {
            formantExpansion: 1.1,      // Expand vowel space
            consonantIntensification: 1.2,  // Boost consonants
            speechRateReduction: 0.9,    // Slow down
            pauseInsertion: true,        // Add micro-pauses
            f0RangeExpansion: 1.15      // Increase pitch range
        };

        // Apply formant expansion
        if (data.formants) {
            data.formants.F1 = data.formants.F1.map(f => f * enhancements.formantExpansion);
            data.formants.F2 = data.formants.F2.map(f => f * enhancements.formantExpansion);
        }

        // Boost consonant energy
        data.segments.forEach(segment => {
            if (segment.type === 'consonant') {
                segment.intensity *= enhancements.consonantIntensification;
            }
        });

        // Adjust speech rate
        data.duration = data.duration.map(d => d / enhancements.speechRateReduction);

        return enhancements;
    }

    /**
     * Enhance naturalness when score is low
     */
    enhanceNaturalness(data) {
        const enhancements = {
            microProsody: this.addMicroProsody(data),
            coarticulation: this.enhanceCoarticulation(data),
            voiceQuality: this.varyVoiceQuality(data),
            rhythmicVariation: this.addRhythmicVariation(data)
        };

        return enhancements;
    }

    /**
     * Add micro-prosodic variations
     */
    addMicroProsody(data) {
        // Add small F0 perturbations
        const f0Perturbation = data.pitch.map(p => 
            p * (1 + (Math.random() - 0.5) * 0.02)
        );

        // Add duration variations
        const durationPerturbation = data.duration.map(d => 
            d * (1 + (Math.random() - 0.5) * 0.05)
        );

        return {
            f0: f0Perturbation,
            duration: durationPerturbation
        };
    }
}

/**
 * Acoustic Feature Analyzer
 * Extracts and analyzes acoustic features in real-time
 */
class AcousticFeatureAnalyzer {
    constructor() {
        this.features = {
            spectral: ['centroid', 'spread', 'flux', 'rolloff', 'flatness'],
            temporal: ['zcr', 'rms', 'energy', 'onset', 'offset'],
            cepstral: ['mfcc', 'plp', 'lpcc'],
            prosodic: ['f0', 'intensity', 'duration', 'rhythm']
        };

        this.windowSize = 512;
        this.hopSize = 256;
    }

    /**
     * Extract comprehensive acoustic features
     */
    extractFeatures(signal) {
        const features = {};

        // Spectral features
        features.spectral = this.extractSpectralFeatures(signal);
        
        // Temporal features
        features.temporal = this.extractTemporalFeatures(signal);
        
        // Cepstral features
        features.cepstral = this.extractCepstralFeatures(signal);
        
        // Prosodic features
        features.prosodic = this.extractProsodicFeatures(signal);

        // Higher-level features
        features.phonetic = this.extractPhoneticFeatures(features);
        features.voice = this.extractVoiceFeatures(signal);

        return features;
    }

    /**
     * Extract spectral features
     */
    extractSpectralFeatures(signal) {
        const spectrum = this.fft(signal);
        
        return {
            centroid: this.spectralCentroid(spectrum),
            spread: this.spectralSpread(spectrum),
            flux: this.spectralFlux(spectrum),
            rolloff: this.spectralRolloff(spectrum),
            flatness: this.spectralFlatness(spectrum),
            contrast: this.spectralContrast(spectrum),
            bandwidth: this.spectralBandwidth(spectrum)
        };
    }

    /**
     * Calculate spectral centroid (brightness)
     */
    spectralCentroid(spectrum) {
        let weightedSum = 0;
        let magnitudeSum = 0;
        
        for (let i = 0; i < spectrum.length; i++) {
            const freq = i * 22050 / spectrum.length;
            weightedSum += freq * spectrum[i];
            magnitudeSum += spectrum[i];
        }
        
        return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
    }

    /**
     * Extract voice quality features
     */
    extractVoiceFeatures(signal) {
        return {
            jitter: this.calculateJitter(signal),
            shimmer: this.calculateShimmer(signal),
            hnr: this.harmonicToNoiseRatio(signal),
            cppd: this.cepstralPeakProminence(signal),
            spectralTilt: this.calculateSpectralTilt(signal)
        };
    }
}

/**
 * Intelligibility Prediction Model
 * Predicts speech intelligibility in real-time
 */
class IntelligibilityModel {
    constructor() {
        this.weights = this.initializeWeights();
        this.threshold = 0.7;
    }

    initializeWeights() {
        // Feature weights learned from data
        return {
            vowelSpace: 0.25,
            consonantClarity: 0.30,
            speechRate: 0.15,
            f0Range: 0.10,
            snr: 0.20
        };
    }

    /**
     * Predict intelligibility score
     */
    predict(acousticData) {
        const features = this.extractIntelligibilityFeatures(acousticData);
        
        let score = 0;
        for (const [feature, value] of Object.entries(features)) {
            score += value * this.weights[feature];
        }
        
        return Math.max(0, Math.min(1, score));
    }

    /**
     * Extract features relevant to intelligibility
     */
    extractIntelligibilityFeatures(data) {
        return {
            vowelSpace: this.calculateVowelSpace(data),
            consonantClarity: this.assessConsonantClarity(data),
            speechRate: this.calculateSpeechRate(data),
            f0Range: this.calculateF0Range(data),
            snr: this.estimateSNR(data)
        };
    }

    /**
     * Calculate vowel space area
     */
    calculateVowelSpace(data) {
        if (!data.formants) return 0.5;
        
        // Find vowel segments
        const vowels = {
            'i': [], 'e': [], 'a': [], 'o': [], 'u': []
        };
        
        // Calculate centroids for each vowel
        const centroids = {};
        for (const [vowel, points] of Object.entries(vowels)) {
            if (points.length > 0) {
                centroids[vowel] = {
                    F1: points.reduce((sum, p) => sum + p.F1, 0) / points.length,
                    F2: points.reduce((sum, p) => sum + p.F2, 0) / points.length
                };
            }
        }
        
        // Calculate area of vowel triangle/quadrilateral
        // Simplified: use distance between extreme vowels
        const area = this.polygonArea(Object.values(centroids));
        
        // Normalize (larger area = better intelligibility)
        return Math.min(1, area / 1000000);
    }
}

/**
 * Naturalness Scoring System
 * Evaluates how natural the speech sounds
 */
class NaturalnessScorer {
    constructor() {
        this.criteria = {
            prosodic: 0.3,
            segmental: 0.25,
            voice: 0.25,
            fluency: 0.2
        };
    }

    /**
     * Calculate overall naturalness score
     */
    score(acousticData) {
        const scores = {
            prosodic: this.scoreProsodicNaturalness(acousticData),
            segmental: this.scoreSegmentalNaturalness(acousticData),
            voice: this.scoreVoiceNaturalness(acousticData),
            fluency: this.scoreFluency(acousticData)
        };

        let totalScore = 0;
        for (const [criterion, weight] of Object.entries(this.criteria)) {
            totalScore += scores[criterion] * weight;
        }

        return totalScore;
    }

    /**
     * Score prosodic naturalness
     */
    scoreProsodicNaturalness(data) {
        const factors = {
            pitchVariability: this.assessPitchVariability(data),
            rhythmRegularity: this.assessRhythmRegularity(data),
            phrasingNaturalness: this.assessPhrasing(data),
            stressPatterns: this.assessStressPatterns(data)
        };

        return Object.values(factors).reduce((sum, val) => sum + val, 0) / 
               Object.keys(factors).length;
    }

    /**
     * Assess pitch variability (not too monotone, not too variable)
     */
    assessPitchVariability(data) {
        if (!data.pitch || data.pitch.length === 0) return 0.5;
        
        const mean = data.pitch.reduce((a, b) => a + b, 0) / data.pitch.length;
        const variance = data.pitch.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / 
                        data.pitch.length;
        const cv = Math.sqrt(variance) / mean;  // Coefficient of variation
        
        // Optimal CV is around 0.15-0.25
        if (cv < 0.1) return cv * 5;  // Too monotone
        if (cv > 0.3) return 1 - (cv - 0.3) * 2;  // Too variable
        return 1.0;  // In optimal range
    }
}

/**
 * Dynamic Pronunciation Adjuster
 * Makes real-time adjustments based on context
 */
class DynamicPronunciationAdjuster {
    constructor() {
        this.adjustmentHistory = [];
        this.maxHistorySize = 100;
    }

    /**
     * Dynamically adjust pronunciation based on multiple factors
     */
    adjust(segment, context) {
        const adjustments = {
            timing: this.adjustTiming(segment, context),
            articulation: this.adjustArticulation(segment, context),
            prosody: this.adjustProsody(segment, context),
            voice: this.adjustVoiceQuality(segment, context)
        };

        // Record adjustment for learning
        this.recordAdjustment(segment, adjustments, context);

        return this.applyAdjustments(segment, adjustments);
    }

    /**
     * Adjust timing based on context
     */
    adjustTiming(segment, context) {
        let durationMultiplier = 1.0;

        // Information density adjustment
        if (context.informationDensity > 0.7) {
            durationMultiplier *= 1.1;  // Slow down for high information
        }

        // Predictability adjustment
        if (context.predictability > 0.8) {
            durationMultiplier *= 0.95;  // Speed up predictable segments
        }

        // Position adjustment
        if (context.position === 'final') {
            durationMultiplier *= 1.2;  // Final lengthening
        } else if (context.position === 'initial') {
            durationMultiplier *= 1.05;  // Slight initial lengthening
        }

        // Emphasis adjustment
        if (context.emphasis) {
            durationMultiplier *= 1.15;
        }

        return { durationMultiplier };
    }

    /**
     * Learn from adjustment history
     */
    learnFromHistory() {
        if (this.adjustmentHistory.length < 10) return;

        // Analyze patterns in successful adjustments
        const patterns = this.findAdjustmentPatterns();
        
        // Update adjustment strategies
        this.updateStrategies(patterns);
    }

    /**
     * Find patterns in adjustment history
     */
    findAdjustmentPatterns() {
        const patterns = {
            timing: {},
            articulation: {},
            prosody: {},
            voice: {}
        };

        // Group by context features
        for (const record of this.adjustmentHistory) {
            const contextKey = this.getContextKey(record.context);
            
            for (const [type, adjustment] of Object.entries(record.adjustments)) {
                if (!patterns[type][contextKey]) {
                    patterns[type][contextKey] = [];
                }
                patterns[type][contextKey].push(adjustment);
            }
        }

        // Calculate average adjustments for each context
        for (const type of Object.keys(patterns)) {
            for (const context of Object.keys(patterns[type])) {
                patterns[type][context] = this.averageAdjustments(patterns[type][context]);
            }
        }

        return patterns;
    }
}

// Export the real-time optimizer
export {
    RomanianRealtimeOptimizer,
    AcousticFeatureAnalyzer,
    IntelligibilityModel,
    NaturalnessScorer,
    DynamicPronunciationAdjuster
};