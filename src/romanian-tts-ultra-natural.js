/**
 * Ultra-Natural Romanian Speech Synthesis System
 * Implements biomechanical and psychoacoustic models for human-like speech
 */

class RomanianUltraNaturalTTS {
    constructor() {
        this.articulatoryModel = new ArticulatoryPhonetics();
        this.voiceQualityEngine = new VoiceQualityModulator();
        this.microProsodicController = new MicroProsodicTiming();
        this.sociolinguisticAdapter = new SociolinguisticVariation();
        this.psychoacousticProcessor = new PsychoacousticEnhancer();
        this.biomechanicalSimulator = new BiomechanicalModel();
    }
}

/**
 * Articulatory Phonetics Model
 * Simulates actual speech organ movements for realistic sound production
 */
class ArticulatoryPhonetics {
    constructor() {
        this.articulators = {
            // Tongue position parameters
            tongue: {
                tip: { x: 0, y: 0, z: 0 },      // Alveolar ridge contact
                blade: { x: 0, y: 0, z: 0 },    // Post-alveolar area
                body: { x: 0, y: 0, z: 0 },     // Palatal area
                root: { x: 0, y: 0, z: 0 },     // Pharyngeal area
                tension: 0.5,                    // Muscle tension (0-1)
                grooveWidth: 5                   // For sibilants (mm)
            },
            
            // Lip configuration
            lips: {
                aperture: 10,                    // Opening size (mm)
                protrusion: 0,                   // Forward extension (mm)
                spreading: 0,                    // Horizontal stretch (-1 to 1)
                rounding: 0,                     // Roundedness (0-1)
                tension: 0.5                     // Muscle tension
            },
            
            // Jaw position
            jaw: {
                opening: 5,                      // Vertical opening (mm)
                protrusion: 0,                   // Forward position (mm)
                lateralOffset: 0                 // Side movement (mm)
            },
            
            // Velum (soft palate)
            velum: {
                height: 0,                       // Raising/lowering (-1 to 1)
                tension: 0.5,                    // Muscular tension
                nasalPort: 0                     // Nasal cavity opening (0-1)
            },
            
            // Glottis (vocal folds)
            glottis: {
                opening: 0.5,                    // Glottal aperture (0-1)
                tension: 0.5,                    // Vocal fold tension
                thickness: 0.5,                  // Vocal fold thickness
                vibrationRate: 120,              // F0 in Hz
                creakiness: 0,                   // Creaky voice (0-1)
                breathiness: 0,                  // Breathy voice (0-1)
                falsetto: 0                      // Falsetto register (0-1)
            },
            
            // Larynx position
            larynx: {
                height: 0,                       // Vertical position (-1 to 1)
                tilt: 0,                         // Forward/backward tilt
                constriction: 0                  // Pharyngeal constriction
            }
        };

        this.coarticulationWindow = 3;          // Phones affected by coarticulation
        this.targetUndershoot = 0.15;           // Incomplete target achievement
        this.transitionDuration = 50;           // ms for articulator movement
    }

    /**
     * Calculate articulatory targets for Romanian phonemes
     */
    getArticulatoryTargets(phoneme) {
        const targets = {
            // Romanian vowels with precise articulation
            'a': {
                tongue: { body: { x: 0, y: -0.7, z: 0 }, root: { x: 0, y: -0.5, z: 0 }},
                jaw: { opening: 15 },
                lips: { aperture: 12, spreading: 0.2 },
                glottis: { vibrationRate: 120 }
            },
            'ă': {  // schwa
                tongue: { body: { x: 0, y: 0, z: 0 }},  // Central position
                jaw: { opening: 8 },
                lips: { aperture: 6, spreading: 0 },
                glottis: { vibrationRate: 125 }
            },
            'â': {  // close central unrounded
                tongue: { body: { x: 0, y: 0.3, z: 0 }, tension: 0.7 },
                jaw: { opening: 5 },
                lips: { aperture: 4, spreading: -0.1 },
                glottis: { vibrationRate: 130 }
            },
            'e': {
                tongue: { body: { x: 0.5, y: 0.3, z: 0 }},
                jaw: { opening: 8 },
                lips: { aperture: 7, spreading: 0.3 },
                glottis: { vibrationRate: 135 }
            },
            'i': {
                tongue: { body: { x: 0.8, y: 0.7, z: 0 }, tension: 0.8 },
                jaw: { opening: 3 },
                lips: { aperture: 3, spreading: 0.5 },
                glottis: { vibrationRate: 140 }
            },
            'o': {
                tongue: { body: { x: -0.5, y: 0.2, z: 0 }},
                jaw: { opening: 10 },
                lips: { aperture: 8, rounding: 0.7, protrusion: 3 },
                glottis: { vibrationRate: 115 }
            },
            'u': {
                tongue: { body: { x: -0.7, y: 0.5, z: 0 }, root: { x: -0.3, y: 0, z: 0 }},
                jaw: { opening: 5 },
                lips: { aperture: 4, rounding: 0.9, protrusion: 5 },
                glottis: { vibrationRate: 110 }
            },
            
            // Romanian specific consonants
            'ț': {  // voiceless alveolar affricate
                tongue: { tip: { x: 0.9, y: 0.8, z: 0 }, tension: 0.9 },
                jaw: { opening: 2 },
                lips: { aperture: 3 },
                glottis: { opening: 1, vibrationRate: 0 },
                timing: { closure: 40, release: 60 }  // Affricate timing
            },
            'ș': {  // voiceless postalveolar fricative
                tongue: { blade: { x: 0.7, y: 0.6, z: 0 }, grooveWidth: 3 },
                jaw: { opening: 4 },
                lips: { aperture: 5, protrusion: 2 },
                glottis: { opening: 0.8, vibrationRate: 0 }
            },
            'r': {  // alveolar trill
                tongue: { tip: { x: 0.9, y: 0.7, z: 0 }, tension: 0.3 },  // Low tension for trill
                jaw: { opening: 5 },
                aerodynamics: { pressure: 'high', flow: 'turbulent' },
                trillRate: 25,  // Hz
                trillCycles: 2  // Number of taps
            }
        };

        return targets[phoneme] || this.getDefaultTarget(phoneme);
    }

    /**
     * Simulate continuous articulatory movement between targets
     */
    interpolateArticulators(from, to, position) {
        const interpolated = {};
        
        // Use minimum jerk trajectory for biological realism
        const trajectoryPosition = this.minimumJerkTrajectory(position);
        
        // Interpolate each articulator
        for (const [articulator, fromConfig] of Object.entries(from)) {
            interpolated[articulator] = {};
            const toConfig = to[articulator] || fromConfig;
            
            for (const [param, fromValue] of Object.entries(fromConfig)) {
                if (typeof fromValue === 'number') {
                    const toValue = toConfig[param] || fromValue;
                    
                    // Apply target undershoot for naturalness
                    const undershootFactor = 1 - this.targetUndershoot * (1 - Math.abs(position - 0.5) * 2);
                    const targetValue = fromValue + (toValue - fromValue) * trajectoryPosition;
                    
                    interpolated[articulator][param] = targetValue * undershootFactor;
                } else if (typeof fromValue === 'object') {
                    interpolated[articulator][param] = this.interpolateNested(
                        fromValue, 
                        toConfig[param] || fromValue, 
                        trajectoryPosition
                    );
                }
            }
        }
        
        return interpolated;
    }

    /**
     * Minimum jerk trajectory for smooth biological motion
     */
    minimumJerkTrajectory(t) {
        // Smooth S-curve that mimics natural movement
        return t * t * t * (t * (6 * t - 15) + 10);
    }

    /**
     * Apply coarticulation effects across phoneme boundaries
     */
    applyCoarticulation(phonemeSequence) {
        const coarticulated = [];
        
        for (let i = 0; i < phonemeSequence.length; i++) {
            const current = phonemeSequence[i];
            const targets = { ...this.getArticulatoryTargets(current.phoneme) };
            
            // Look ahead and behind for coarticulation
            for (let j = -this.coarticulationWindow; j <= this.coarticulationWindow; j++) {
                if (j === 0) continue;
                
                const index = i + j;
                if (index >= 0 && index < phonemeSequence.length) {
                    const neighbor = phonemeSequence[index];
                    const neighborTargets = this.getArticulatoryTargets(neighbor.phoneme);
                    
                    // Calculate influence based on distance and articulator inertia
                    const influence = this.calculateCoarticulationInfluence(
                        current, neighbor, Math.abs(j)
                    );
                    
                    // Apply influence to relevant articulators
                    this.blendArticulators(targets, neighborTargets, influence);
                }
            }
            
            coarticulated.push({
                ...current,
                articulators: targets,
                coarticulationApplied: true
            });
        }
        
        return coarticulated;
    }

    /**
     * Calculate coarticulation influence based on phonetic features
     */
    calculateCoarticulationInfluence(current, neighbor, distance) {
        const baseInfluence = 0.3 / distance;  // Decreases with distance
        
        // Articulatory inertia factors
        const inertiaFactors = {
            tongue: 0.7,   // Tongue moves relatively quickly
            lips: 0.5,     // Lips are quite mobile
            jaw: 0.3,      // Jaw is slower
            velum: 0.2,    // Velum is slowest
            glottis: 0.8   // Glottis changes quickly
        };
        
        // Feature-based influence modification
        let modifier = 1.0;
        
        // Vowels influence consonants more than vice versa
        if (this.isVowel(neighbor.phoneme) && !this.isVowel(current.phoneme)) {
            modifier *= 1.3;
        }
        
        // Anticipatory (forward) coarticulation is stronger than carryover
        if (distance > 0) {  // Neighbor is after current
            modifier *= 1.2;
        }
        
        return baseInfluence * modifier;
    }

    /**
     * Blend articulatory configurations based on influence
     */
    blendArticulators(target, influence, amount) {
        for (const [articulator, config] of Object.entries(influence)) {
            if (!target[articulator]) continue;
            
            for (const [param, value] of Object.entries(config)) {
                if (typeof value === 'number' && typeof target[articulator][param] === 'number') {
                    target[articulator][param] = 
                        target[articulator][param] * (1 - amount) + value * amount;
                }
            }
        }
    }
}

/**
 * Voice Quality Modulation System
 * Adds natural voice quality variations
 */
class VoiceQualityModulator {
    constructor() {
        this.voiceQualities = {
            modal: {
                spectralTilt: 0,
                harmonicAmplitudes: [1, 0.7, 0.5, 0.3, 0.2],
                noise: 0.05,
                jitter: 0.01,
                shimmer: 0.02
            },
            breathy: {
                spectralTilt: -6,  // dB/octave
                harmonicAmplitudes: [1, 0.5, 0.3, 0.15, 0.08],
                noise: 0.25,
                jitter: 0.03,
                shimmer: 0.05,
                aspiration: 0.3
            },
            creaky: {
                spectralTilt: 3,
                harmonicAmplitudes: [1, 0.9, 0.7, 0.5, 0.4],
                noise: 0.02,
                jitter: 0.08,
                shimmer: 0.03,
                pulseIrregularity: 0.4,
                subharmonics: true
            },
            pressed: {
                spectralTilt: 2,
                harmonicAmplitudes: [1, 0.85, 0.75, 0.6, 0.5],
                noise: 0.01,
                jitter: 0.005,
                shimmer: 0.01,
                laryngealTension: 0.8
            },
            whispery: {
                spectralTilt: -9,
                harmonicAmplitudes: [0.3, 0.2, 0.1, 0.05, 0.02],
                noise: 0.7,
                jitter: 0.05,
                shimmer: 0.08,
                turbulence: 'high'
            },
            falsetto: {
                spectralTilt: -3,
                harmonicAmplitudes: [1, 0.3, 0.1, 0.03, 0.01],
                noise: 0.1,
                jitter: 0.02,
                shimmer: 0.03,
                f0Multiplier: 2.0
            }
        };

        this.emotionalVoiceQualities = {
            happy: {
                base: 'modal',
                modifications: {
                    spectralTilt: 2,
                    shimmer: 0.01,
                    brightness: 1.2,
                    f0Range: 1.3
                }
            },
            sad: {
                base: 'breathy',
                modifications: {
                    spectralTilt: -3,
                    jitter: 0.02,
                    darkness: 1.2,
                    f0Range: 0.7
                }
            },
            angry: {
                base: 'pressed',
                modifications: {
                    spectralTilt: 4,
                    shimmer: 0.03,
                    harshness: 1.3,
                    f0Range: 1.1
                }
            },
            fearful: {
                base: 'modal',
                modifications: {
                    jitter: 0.04,
                    shimmer: 0.05,
                    tremor: { rate: 5, depth: 0.1 },
                    f0Range: 1.4
                }
            },
            tired: {
                base: 'creaky',
                modifications: {
                    spectralTilt: -2,
                    jitter: 0.03,
                    darkness: 1.1,
                    f0Range: 0.6
                }
            }
        };

        // Physiological constraints
        this.vocalTractLength = 17.5;  // cm (average adult)
        this.glottalPulseShape = this.generateGlottalPulse();
    }

    /**
     * Generate realistic glottal pulse waveform
     */
    generateGlottalPulse() {
        // LF (Liljencrants-Fant) model parameters
        return {
            Tp: 0.4,   // Position of maximum flow (0-1)
            Te: 0.85,  // Position of excitation (0-1)
            Ta: 0.05,  // Return phase duration
            Ee: 1.0,   // Excitation strength
            
            generate: (t, voiceQuality) => {
                // Normalized time (0-1)
                if (t < 0 || t > 1) return 0;
                
                let flow;
                if (t < this.Tp) {
                    // Opening phase
                    flow = this.Ee * Math.sin(Math.PI * t / this.Tp / 2);
                } else if (t < this.Te) {
                    // Closing phase
                    const tau = (t - this.Tp) / (this.Te - this.Tp);
                    flow = this.Ee * Math.cos(Math.PI * tau / 2);
                } else {
                    // Return phase
                    const tau = (t - this.Te) / this.Ta;
                    flow = -this.Ee * Math.exp(-tau) * Math.sin(Math.PI * tau);
                }
                
                // Apply voice quality modifications
                return this.modifyPulseForQuality(flow, t, voiceQuality);
            }
        };
    }

    /**
     * Modify glottal pulse based on voice quality
     */
    modifyPulseForQuality(flow, t, quality) {
        if (quality.creaky && t > 0.5) {
            // Add irregular secondary pulse for creaky voice
            if (Math.random() < quality.pulseIrregularity) {
                flow *= 0.3 + Math.random() * 0.7;
            }
        }
        
        if (quality.breathy) {
            // Add aspiration noise
            flow += (Math.random() - 0.5) * quality.aspiration;
        }
        
        if (quality.pressed) {
            // Steeper closing phase
            if (t > this.glottalPulseShape.Tp && t < this.glottalPulseShape.Te) {
                flow *= 1 + quality.laryngealTension * 0.5;
            }
        }
        
        return flow;
    }

    /**
     * Apply voice quality to speech segment
     */
    applyVoiceQuality(segment, emotionalState = 'neutral', position = 'medial') {
        // Select base voice quality
        let quality = this.voiceQualities.modal;
        
        // Apply emotional modifications
        if (this.emotionalVoiceQualities[emotionalState]) {
            const emotional = this.emotionalVoiceQualities[emotionalState];
            quality = { ...this.voiceQualities[emotional.base] };
            
            // Apply modifications
            for (const [param, value] of Object.entries(emotional.modifications)) {
                if (typeof value === 'number') {
                    quality[param] = (quality[param] || 0) + value;
                } else {
                    quality[param] = value;
                }
            }
        }
        
        // Position-based modifications
        if (position === 'initial') {
            // Slightly breathy at utterance start
            quality.noise *= 1.2;
            quality.aspiration = (quality.aspiration || 0) + 0.1;
        } else if (position === 'final') {
            // Creaky at utterance end (vocal fry)
            quality.pulseIrregularity = (quality.pulseIrregularity || 0) + 0.2;
            quality.creaky = true;
        }
        
        // Apply jitter and shimmer
        segment.f0Contour = this.applyJitter(segment.f0Contour, quality.jitter);
        segment.amplitude = this.applyShimmer(segment.amplitude, quality.shimmer);
        
        // Apply spectral modifications
        segment.spectrum = this.applySpectralTilt(segment.spectrum, quality.spectralTilt);
        segment.harmonics = this.adjustHarmonics(segment.harmonics, quality.harmonicAmplitudes);
        
        // Add noise components
        segment.noise = this.generateNoise(quality.noise);
        
        // Apply tremor if present
        if (quality.tremor) {
            segment.f0Contour = this.applyTremor(
                segment.f0Contour, 
                quality.tremor.rate, 
                quality.tremor.depth
            );
        }
        
        return segment;
    }

    /**
     * Apply jitter (F0 perturbation)
     */
    applyJitter(f0Contour, jitterAmount) {
        return f0Contour.map(f0 => {
            const perturbation = (Math.random() - 0.5) * 2 * jitterAmount;
            return f0 * (1 + perturbation);
        });
    }

    /**
     * Apply shimmer (amplitude perturbation)
     */
    applyShimmer(amplitude, shimmerAmount) {
        return amplitude.map(amp => {
            const perturbation = (Math.random() - 0.5) * 2 * shimmerAmount;
            return amp * (1 + perturbation);
        });
    }

    /**
     * Apply tremor (slow modulation)
     */
    applyTremor(f0Contour, rate, depth) {
        const tremorPhase = Math.random() * Math.PI * 2;
        
        return f0Contour.map((f0, i) => {
            const time = i / f0Contour.length;
            const tremor = Math.sin(2 * Math.PI * rate * time + tremorPhase) * depth;
            return f0 * (1 + tremor);
        });
    }
}

/**
 * Micro-Prosodic Timing Controller
 * Handles subtle timing variations for naturalness
 */
class MicroProsodicTiming {
    constructor() {
        this.timingPatterns = {
            // Segment duration models
            intrinsicDuration: {
                // Vowels (ms)
                'i': 65, 'e': 70, 'a': 80, 'o': 75, 'u': 70,
                'ă': 60, 'â': 65, 'î': 65,
                
                // Consonants (ms)
                'p': 80, 'b': 70, 't': 85, 'd': 75, 'k': 90, 'g': 80,
                'f': 100, 'v': 90, 's': 110, 'z': 100, 'ș': 120, 'j': 110,
                'h': 80, 'm': 85, 'n': 80, 'l': 75, 'r': 90,
                'ț': 130, 'c': 140  // Affricates are longer
            },
            
            // Context-dependent duration factors
            contextFactors: {
                stressed: 1.3,
                unstressed: 0.8,
                phraseInitial: 1.1,
                phraseFinal: 1.4,
                prePausal: 1.5,
                preStressed: 0.9,
                postStressed: 0.85,
                clusterPosition: 0.9
            },
            
            // Compression factors for fast speech
            compressionRates: {
                slow: 1.3,
                normal: 1.0,
                fast: 0.75,
                veryFast: 0.6
            }
        };

        // Mora timing for rhythm (Romanian is mora-timed in some contexts)
        this.moraStructure = {
            light: 1.0,  // CV
            heavy: 1.5,  // CVC, CVV
            superheavy: 2.0  // CVCC, CVVC
        };

        // P-center (perceptual center) alignments
        this.pCenters = new Map();
        
        // Micro-timing deviations
        this.microDeviations = {
            consonantLengthening: 0.05,  // 5% random variation
            vowelLengthening: 0.08,      // 8% random variation
            rhythmicDeviation: 0.03      // 3% rhythm variation
        };
    }

    /**
     * Calculate precise segment durations with all factors
     */
    calculateSegmentDuration(segment, context) {
        // Base intrinsic duration
        let duration = this.timingPatterns.intrinsicDuration[segment.phoneme] || 80;
        
        // Apply stress factor
        if (context.stress === 'primary') {
            duration *= this.timingPatterns.contextFactors.stressed;
        } else if (context.stress === 'secondary') {
            duration *= 1.15;  // Intermediate value
        } else {
            duration *= this.timingPatterns.contextFactors.unstressed;
        }
        
        // Position in phrase
        if (context.position === 'initial') {
            duration *= this.timingPatterns.contextFactors.phraseInitial;
        } else if (context.position === 'final') {
            duration *= this.timingPatterns.contextFactors.phraseFinal;
            
            // Extra lengthening for phrase-final vowels
            if (this.isVowel(segment.phoneme)) {
                duration *= 1.2;
            }
        }
        
        // Pre-pausal lengthening
        if (context.beforePause) {
            duration *= this.timingPatterns.contextFactors.prePausal;
        }
        
        // Cluster effects
        if (context.inCluster) {
            duration *= this.timingPatterns.contextFactors.clusterPosition;
        }
        
        // Speaking rate
        duration *= this.timingPatterns.compressionRates[context.rate || 'normal'];
        
        // Add micro-variations for naturalness
        duration = this.addMicroVariations(duration, segment);
        
        // Apply mora constraints if applicable
        duration = this.applyMoraConstraints(duration, context);
        
        return Math.round(duration);
    }

    /**
     * Add subtle random variations to avoid robotic timing
     */
    addMicroVariations(duration, segment) {
        const variationType = this.isVowel(segment.phoneme) ? 
            'vowelLengthening' : 'consonantLengthening';
        
        const deviation = this.microDeviations[variationType];
        const randomFactor = 1 + (Math.random() - 0.5) * 2 * deviation;
        
        return duration * randomFactor;
    }

    /**
     * Apply mora-based timing constraints
     */
    applyMoraConstraints(duration, context) {
        if (!context.syllable) return duration;
        
        const syllableWeight = this.calculateSyllableWeight(context.syllable);
        const targetMoraDuration = 120;  // ms per mora
        
        let targetDuration;
        switch (syllableWeight) {
            case 'light':
                targetDuration = targetMoraDuration * this.moraStructure.light;
                break;
            case 'heavy':
                targetDuration = targetMoraDuration * this.moraStructure.heavy;
                break;
            case 'superheavy':
                targetDuration = targetMoraDuration * this.moraStructure.superheavy;
                break;
            default:
                return duration;
        }
        
        // Blend original duration with mora-based target
        const moraInfluence = 0.3;  // 30% influence from mora timing
        return duration * (1 - moraInfluence) + targetDuration * moraInfluence;
    }

    /**
     * Calculate syllable weight for mora timing
     */
    calculateSyllableWeight(syllable) {
        const structure = syllable.structure;  // e.g., "CVC", "CV", "CVCC"
        
        const vowelCount = (structure.match(/V/g) || []).length;
        const codaConsonants = structure.split('V')[1]?.length || 0;
        
        if (vowelCount > 1 || codaConsonants > 1) {
            return 'superheavy';
        } else if (codaConsonants === 1 || vowelCount === 2) {
            return 'heavy';
        } else {
            return 'light';
        }
    }

    /**
     * Calculate P-centers for rhythmic alignment
     */
    calculatePCenter(segment) {
        // P-center is the perceptual moment of occurrence
        // For CV syllables, it's typically 20-40ms after consonant onset
        
        const key = `${segment.onset}_${segment.nucleus}`;
        
        if (this.pCenters.has(key)) {
            return this.pCenters.get(key);
        }
        
        let pCenter;
        
        if (segment.onset) {
            const onsetDuration = this.timingPatterns.intrinsicDuration[segment.onset] || 80;
            
            // P-center depends on consonant type
            if (this.isPlosive(segment.onset)) {
                pCenter = onsetDuration * 0.8;  // Near the release
            } else if (this.isFricative(segment.onset)) {
                pCenter = onsetDuration * 0.5;  // Middle of frication
            } else {
                pCenter = onsetDuration * 0.3;  // Early for sonorants
            }
        } else {
            pCenter = 0;  // Vowel-initial syllables
        }
        
        this.pCenters.set(key, pCenter);
        return pCenter;
    }

    /**
     * Apply rhythmic timing adjustments for isochrony
     */
    applyRhythmicTiming(segments, targetRhythm = 'syllable-timed') {
        const stressedPositions = segments
            .map((s, i) => s.stress === 'primary' ? i : null)
            .filter(i => i !== null);
        
        if (stressedPositions.length < 2) return segments;
        
        // Calculate inter-stress intervals
        const intervals = [];
        for (let i = 1; i < stressedPositions.length; i++) {
            intervals.push({
                start: stressedPositions[i - 1],
                end: stressedPositions[i],
                segments: segments.slice(stressedPositions[i - 1], stressedPositions[i])
            });
        }
        
        if (targetRhythm === 'stress-timed') {
            // Make inter-stress intervals more equal (English-like)
            const avgDuration = intervals.reduce((sum, int) => 
                sum + int.segments.reduce((s, seg) => s + seg.duration, 0), 0
            ) / intervals.length;
            
            intervals.forEach(interval => {
                const currentDuration = interval.segments.reduce((s, seg) => s + seg.duration, 0);
                const ratio = avgDuration / currentDuration;
                
                // Compress or expand segments proportionally
                interval.segments.forEach(seg => {
                    seg.duration *= ratio;
                });
            });
        } else if (targetRhythm === 'syllable-timed') {
            // Romanian default - more equal syllable durations
            const avgSyllableDuration = segments.reduce((sum, s) => sum + s.duration, 0) / segments.length;
            
            segments.forEach(segment => {
                // Move toward average, but not completely
                const influence = 0.4;  // 40% regularization
                segment.duration = segment.duration * (1 - influence) + avgSyllableDuration * influence;
            });
        }
        
        return segments;
    }

    isVowel(phoneme) {
        return /[aeiouăâî]/i.test(phoneme);
    }

    isPlosive(phoneme) {
        return /[pbtdkg]/.test(phoneme);
    }

    isFricative(phoneme) {
        return /[fvszșjh]/.test(phoneme);
    }
}

/**
 * Sociolinguistic Variation Model
 * Adapts speech to social context and register
 */
class SociolinguisticVariation {
    constructor() {
        this.registers = {
            formal: {
                articulation: 'hyperarticulated',
                speechRate: 0.9,
                pauseFrequency: 1.2,
                reductionRate: 0.1,
                contraction: false,
                fillersAllowed: false,
                politenessMarkers: true
            },
            casual: {
                articulation: 'normal',
                speechRate: 1.0,
                pauseFrequency: 1.0,
                reductionRate: 0.3,
                contraction: true,
                fillersAllowed: true,
                politenessMarkers: false
            },
            intimate: {
                articulation: 'hypoarticulated',
                speechRate: 1.1,
                pauseFrequency: 0.8,
                reductionRate: 0.5,
                contraction: true,
                fillersAllowed: true,
                politenessMarkers: false
            }
        };

        // Regional variants
        this.dialectalFeatures = {
            muntenia: {  // Standard
                'ă': 'ə',
                diphthongs: 'preserved',
                rhoticity: 'trill',
                palatalization: 'standard'
            },
            moldova: {
                'e': 'ie',  // in certain contexts
                'ă': 'a',   // slightly more open
                diphthongs: 'modified',
                rhoticity: 'tap',
                palatalization: 'enhanced',
                specificWords: {
                    'este': 'ieste',
                    'eram': 'ieram'
                }
            },
            ardeal: {  // Transylvania
                vowelLength: 'extended',
                diphthongs: 'monophthongized',
                rhoticity: 'uvular',  // in some areas
                palatalization: 'reduced',
                intonation: 'falling'
            },
            banat: {
                vowelQuality: 'centralized',
                diphthongs: 'preserved',
                rhoticity: 'trill',
                palatalization: 'standard',
                rhythm: 'slower'
            },
            oltenia: {
                'ă': 'ʌ',  // slightly different quality
                diphthongs: 'preserved',
                rhoticity: 'trill',
                palatalization: 'standard',
                specificFeatures: {
                    softening: true
                }
            }
        };

        // Age-related variations
        this.ageVariations = {
            child: {
                f0Base: 250,
                f0Range: [200, 350],
                formantScaling: 1.3,
                speechRate: 0.85,
                articulationPrecision: 0.7
            },
            youngAdult: {
                f0Base: 120,  // male average
                f0Range: [80, 200],
                formantScaling: 1.0,
                speechRate: 1.05,
                articulationPrecision: 0.95
            },
            middleAge: {
                f0Base: 110,
                f0Range: [75, 180],
                formantScaling: 1.0,
                speechRate: 1.0,
                articulationPrecision: 1.0
            },
            elderly: {
                f0Base: 105,
                f0Range: [70, 160],
                formantScaling: 0.95,
                speechRate: 0.9,
                articulationPrecision: 0.85,
                tremor: { rate: 4, depth: 0.05 }
            }
        };

        // Gender-related variations
        this.genderVariations = {
            masculine: {
                f0Multiplier: 1.0,
                formantMultiplier: 1.0,
                breathiness: 0.02,
                creakiness: 0.1
            },
            feminine: {
                f0Multiplier: 1.8,
                formantMultiplier: 1.15,
                breathiness: 0.08,
                creakiness: 0.02
            },
            neutral: {
                f0Multiplier: 1.4,
                formantMultiplier: 1.07,
                breathiness: 0.05,
                creakiness: 0.05
            }
        };
    }

    /**
     * Apply sociolinguistic variations to speech
     */
    applySociolinguisticFeatures(speech, context) {
        let modifiedSpeech = { ...speech };
        
        // Apply register-based modifications
        if (context.register) {
            modifiedSpeech = this.applyRegister(modifiedSpeech, context.register);
        }
        
        // Apply dialectal features
        if (context.dialect) {
            modifiedSpeech = this.applyDialect(modifiedSpeech, context.dialect);
        }
        
        // Apply age variations
        if (context.age) {
            modifiedSpeech = this.applyAgeVariations(modifiedSpeech, context.age);
        }
        
        // Apply gender variations
        if (context.gender) {
            modifiedSpeech = this.applyGenderVariations(modifiedSpeech, context.gender);
        }
        
        // Apply social distance effects
        if (context.socialDistance) {
            modifiedSpeech = this.applySocialDistance(modifiedSpeech, context.socialDistance);
        }
        
        return modifiedSpeech;
    }

    /**
     * Apply register-specific modifications
     */
    applyRegister(speech, register) {
        const settings = this.registers[register] || this.registers.casual;
        
        // Modify articulation precision
        if (settings.articulation === 'hyperarticulated') {
            speech.segments.forEach(segment => {
                segment.targetAchievement = 0.95;  // Nearly complete targets
                segment.coarticulationStrength = 0.3;  // Less coarticulation
            });
        } else if (settings.articulation === 'hypoarticulated') {
            speech.segments.forEach(segment => {
                segment.targetAchievement = 0.7;  // Reduced targets
                segment.coarticulationStrength = 0.7;  // More coarticulation
            });
        }
        
        // Apply speech rate
        speech.rate = settings.speechRate;
        
        // Apply reduction
        if (settings.reductionRate > 0) {
            speech = this.applyPhoneticReduction(speech, settings.reductionRate);
        }
        
        // Handle contractions
        if (settings.contraction) {
            speech = this.applyContractions(speech);
        }
        
        return speech;
    }

    /**
     * Apply dialectal variations
     */
    applyDialect(speech, dialect) {
        const features = this.dialectalFeatures[dialect];
        if (!features) return speech;
        
        speech.segments.forEach(segment => {
            // Apply vowel modifications
            if (features.specificWords && features.specificWords[segment.word]) {
                segment.pronunciation = features.specificWords[segment.word];
            }
            
            // Modify rhoticity
            if (segment.phoneme === 'r') {
                switch (features.rhoticity) {
                    case 'tap':
                        segment.manner = 'tap';
                        segment.duration *= 0.6;
                        break;
                    case 'uvular':
                        segment.place = 'uvular';
                        break;
                }
            }
            
            // Apply palatalization changes
            if (features.palatalization === 'enhanced') {
                if (['t', 'd', 's', 'z', 'n', 'l'].includes(segment.phoneme)) {
                    const nextSegment = speech.segments[speech.segments.indexOf(segment) + 1];
                    if (nextSegment && /[ie]/.test(nextSegment.phoneme)) {
                        segment.palatalized = true;
                    }
                }
            }
        });
        
        // Apply rhythm changes
        if (dialect === 'banat') {
            speech.rate *= 0.9;  // Slower rhythm
        }
        
        return speech;
    }

    /**
     * Apply phonetic reduction in casual speech
     */
    applyPhoneticReduction(speech, reductionRate) {
        speech.segments.forEach((segment, index) => {
            // Reduce unstressed vowels
            if (segment.type === 'vowel' && !segment.stressed) {
                if (Math.random() < reductionRate) {
                    // Centralize vowel toward schwa
                    segment.centralization = 0.5;
                    segment.duration *= 0.8;
                }
            }
            
            // Delete unstressed schwas in certain contexts
            if (segment.phoneme === 'ă' && !segment.stressed) {
                const prev = speech.segments[index - 1];
                const next = speech.segments[index + 1];
                
                if (prev && next && !this.isVowel(prev.phoneme) && !this.isVowel(next.phoneme)) {
                    if (Math.random() < reductionRate * 0.5) {
                        segment.deleted = true;
                    }
                }
            }
            
            // Simplify consonant clusters
            if (segment.inCluster && Math.random() < reductionRate * 0.3) {
                segment.weakened = true;
                segment.duration *= 0.7;
            }
        });
        
        return speech;
    }

    /**
     * Apply contractions common in casual speech
     */
    applyContractions(speech) {
        const contractions = {
            'nu este': "nu-i",
            'să îi': "să-i",
            'să îl': "să-l",
            'de la': "de-la",
            'ce ai': "ce-ai",
            'nu am': "n-am",
            'nu ai': "n-ai",
            'nu are': "n-are"
        };
        
        // Apply contractions to text
        let text = speech.text;
        for (const [full, contracted] of Object.entries(contractions)) {
            text = text.replace(new RegExp(full, 'gi'), contracted);
        }
        speech.text = text;
        
        return speech;
    }

    isVowel(phoneme) {
        return /[aeiouăâî]/i.test(phoneme);
    }
}

/**
 * Psychoacoustic Enhancement System
 * Optimizes speech for human perception
 */
class PsychoacousticEnhancer {
    constructor() {
        // Critical bands for frequency perception
        this.criticalBands = this.calculateCriticalBands();
        
        // Masking thresholds
        this.maskingCurves = {
            simultaneous: this.generateSimultaneousMasking(),
            forward: this.generateForwardMasking(),
            backward: this.generateBackwardMasking()
        };
        
        // Formant enhancement parameters
        this.formantEnhancement = {
            F1: { bandwidth: 80, gain: 3 },   // First formant
            F2: { bandwidth: 100, gain: 4 },  // Second formant
            F3: { bandwidth: 150, gain: 2 },  // Third formant
            F4: { bandwidth: 200, gain: 1 }   // Fourth formant
        };
        
        // Spectral contrast enhancement
        this.spectralContrast = {
            peakEnhancement: 1.3,
            valleySuppression: 0.7,
            transitionSharpening: 1.2
        };
    }

    /**
     * Calculate critical bands (Bark scale)
     */
    calculateCriticalBands() {
        const bands = [];
        const frequencies = [20, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 
                           1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 
                           4400, 5300, 6400, 7700, 9500, 12000, 15500, 20000];
        
        for (let i = 0; i < frequencies.length - 1; i++) {
            bands.push({
                low: frequencies[i],
                high: frequencies[i + 1],
                center: (frequencies[i] + frequencies[i + 1]) / 2,
                bandwidth: frequencies[i + 1] - frequencies[i]
            });
        }
        
        return bands;
    }

    /**
     * Apply psychoacoustic enhancements to spectrum
     */
    enhanceSpectrum(spectrum, formants) {
        let enhanced = [...spectrum];
        
        // Enhance formant regions
        formants.forEach((formant, index) => {
            const enhancement = this.formantEnhancement[`F${index + 1}`];
            if (enhancement) {
                enhanced = this.enhanceFrequencyRegion(
                    enhanced,
                    formant.frequency,
                    enhancement.bandwidth,
                    enhancement.gain
                );
            }
        });
        
        // Apply spectral contrast enhancement
        enhanced = this.enhanceSpectralContrast(enhanced);
        
        // Apply masking-based optimization
        enhanced = this.optimizeWithMasking(enhanced);
        
        return enhanced;
    }

    /**
     * Enhance specific frequency region
     */
    enhanceFrequencyRegion(spectrum, centerFreq, bandwidth, gain) {
        const enhanced = [...spectrum];
        const binWidth = spectrum.length / 22050;  // Assuming 22.05 kHz sample rate
        
        const centerBin = Math.round(centerFreq * binWidth);
        const bandwidthBins = Math.round(bandwidth * binWidth);
        
        for (let i = -bandwidthBins; i <= bandwidthBins; i++) {
            const bin = centerBin + i;
            if (bin >= 0 && bin < spectrum.length) {
                // Gaussian window for smooth enhancement
                const distance = Math.abs(i) / bandwidthBins;
                const window = Math.exp(-distance * distance * 2);
                enhanced[bin] *= 1 + (gain - 1) * window;
            }
        }
        
        return enhanced;
    }

    /**
     * Enhance spectral contrast for clarity
     */
    enhanceSpectralContrast(spectrum) {
        const enhanced = [...spectrum];
        
        // Find peaks and valleys
        const peaks = [];
        const valleys = [];
        
        for (let i = 1; i < spectrum.length - 1; i++) {
            if (spectrum[i] > spectrum[i - 1] && spectrum[i] > spectrum[i + 1]) {
                peaks.push(i);
            } else if (spectrum[i] < spectrum[i - 1] && spectrum[i] < spectrum[i + 1]) {
                valleys.push(i);
            }
        }
        
        // Enhance peaks
        peaks.forEach(peak => {
            enhanced[peak] *= this.spectralContrast.peakEnhancement;
        });
        
        // Suppress valleys
        valleys.forEach(valley => {
            enhanced[valley] *= this.spectralContrast.valleySuppression;
        });
        
        return enhanced;
    }

    /**
     * Generate simultaneous masking curve
     */
    generateSimultaneousMasking() {
        return (maskerFreq, maskerLevel) => {
            // Simplified masking model
            return (freq) => {
                const distance = Math.log2(Math.abs(freq / maskerFreq));
                let maskingLevel;
                
                if (freq < maskerFreq) {
                    // Lower slope (upward masking)
                    maskingLevel = maskerLevel - 27 * distance;
                } else {
                    // Upper slope (downward masking)
                    maskingLevel = maskerLevel - 15 * distance;
                }
                
                return Math.max(0, maskingLevel);
            };
        };
    }

    /**
     * Generate forward masking curve (post-masking)
     */
    generateForwardMasking() {
        return (timeDifference) => {
            // Exponential decay of masking over time
            const decayRate = 0.005;  // 5ms time constant
            return Math.exp(-timeDifference * decayRate);
        };
    }

    /**
     * Generate backward masking curve (pre-masking)
     */
    generateBackwardMasking() {
        return (timeDifference) => {
            // Very short pre-masking effect
            if (timeDifference > 20) return 0;  // 20ms maximum
            return 0.5 * (1 - timeDifference / 20);
        };
    }

    /**
     * Optimize spectrum considering masking effects
     */
    optimizeWithMasking(spectrum) {
        const optimized = [...spectrum];
        
        // Calculate masking threshold for each frequency
        const maskingThreshold = new Array(spectrum.length).fill(0);
        
        for (let i = 0; i < spectrum.length; i++) {
            if (spectrum[i] > 0) {
                const maskerFreq = i * (22050 / spectrum.length);
                const maskingCurve = this.maskingCurves.simultaneous(maskerFreq, spectrum[i]);
                
                for (let j = 0; j < spectrum.length; j++) {
                    const freq = j * (22050 / spectrum.length);
                    maskingThreshold[j] = Math.max(
                        maskingThreshold[j],
                        maskingCurve(freq)
                    );
                }
            }
        }
        
        // Remove masked components to save bandwidth
        for (let i = 0; i < optimized.length; i++) {
            if (optimized[i] < maskingThreshold[i] * 1.1) {
                optimized[i] = 0;
            }
        }
        
        return optimized;
    }
}

/**
 * Biomechanical Speech Production Model
 * Simulates physical constraints of vocal tract
 */
class BiomechanicalModel {
    constructor() {
        // Vocal tract dimensions (adult male average)
        this.vocalTract = {
            length: 17.5,  // cm
            pharynxLength: 7,  // cm
            oralCavityLength: 10.5,  // cm
            
            // Cross-sectional areas at different points
            areas: {
                glottis: 0.05,     // cm²
                pharynx: 2.5,      // cm²
                velum: 1.8,        // cm²
                palate: 1.2,       // cm²
                alveolar: 0.8,     // cm²
                teeth: 0.3,        // cm²
                lips: 0.5          // cm²
            }
        };
        
        // Muscle dynamics
        this.muscles = {
            tongueBody: { mass: 100, stiffness: 1000, damping: 10 },
            tongueTip: { mass: 20, stiffness: 2000, damping: 15 },
            lips: { mass: 30, stiffness: 800, damping: 8 },
            jaw: { mass: 200, stiffness: 500, damping: 20 },
            velum: { mass: 10, stiffness: 300, damping: 5 }
        };
        
        // Aerodynamic parameters
        this.aerodynamics = {
            lungPressure: 8,  // cm H2O
            flowResistance: 0.1,
            turbulenceThreshold: 1000  // Reynolds number
        };
    }

    /**
     * Calculate vocal tract transfer function
     */
    calculateTransferFunction(articulatoryConfig) {
        const areas = this.mapArticulatorsToAreas(articulatoryConfig);
        const frequencies = [];
        const response = [];
        
        // Calculate resonances using tube model
        for (let freq = 0; freq < 5000; freq += 50) {
            const wavelength = 34000 / freq;  // Speed of sound / frequency
            const k = 2 * Math.PI / wavelength;
            
            // Simplified transmission line model
            let impedance = this.calculateInputImpedance(areas, k);
            let magnitude = 1 / Math.abs(impedance);
            
            frequencies.push(freq);
            response.push(magnitude);
        }
        
        // Extract formants from peaks
        const formants = this.findFormants(frequencies, response);
        
        return { frequencies, response, formants };
    }

    /**
     * Map articulator positions to area function
     */
    mapArticulatorsToAreas(config) {
        const areas = { ...this.vocalTract.areas };
        
        // Modify areas based on articulator positions
        if (config.tongue) {
            // Tongue body constriction affects pharynx and palate
            areas.pharynx *= (1 - config.tongue.body.y * 0.5);
            areas.palate *= (1 - config.tongue.body.y * 0.7);
            
            // Tongue tip affects alveolar region
            areas.alveolar *= (1 - config.tongue.tip.y * 0.8);
        }
        
        if (config.lips) {
            areas.lips = config.lips.aperture / 10;  // Convert mm to cm
        }
        
        if (config.jaw) {
            // Jaw opening affects overall oral cavity
            const jawFactor = config.jaw.opening / 20;  // Normalize
            areas.palate *= (0.5 + jawFactor);
            areas.alveolar *= (0.5 + jawFactor);
        }
        
        if (config.velum) {
            // Velum height affects nasal coupling
            const nasalCoupling = (1 + config.velum.height) / 2;
            areas.velum *= nasalCoupling;
        }
        
        return areas;
    }

    /**
     * Calculate input impedance of vocal tract
     */
    calculateInputImpedance(areas, k) {
        // Simplified calculation using concatenated tube model
        let impedance = { real: 1, imag: 0 };
        
        const sections = Object.values(areas);
        const sectionLength = this.vocalTract.length / sections.length;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const area = sections[i];
            const z0 = 1 / area;  // Characteristic impedance
            
            // Propagation through section
            const kl = k * sectionLength;
            const cos_kl = Math.cos(kl);
            const sin_kl = Math.sin(kl);
            
            // Update impedance
            const newReal = impedance.real * cos_kl - impedance.imag * z0 * sin_kl;
            const newImag = impedance.real * sin_kl / z0 + impedance.imag * cos_kl;
            
            impedance = { real: newReal, imag: newImag };
        }
        
        return Math.sqrt(impedance.real * impedance.real + impedance.imag * impedance.imag);
    }

    /**
     * Find formant frequencies from spectrum
     */
    findFormants(frequencies, response) {
        const formants = [];
        
        // Find peaks
        for (let i = 1; i < response.length - 1; i++) {
            if (response[i] > response[i - 1] && response[i] > response[i + 1]) {
                formants.push({
                    frequency: frequencies[i],
                    amplitude: response[i],
                    bandwidth: this.estimateBandwidth(frequencies, response, i)
                });
            }
        }
        
        // Sort by amplitude and take top 4
        formants.sort((a, b) => b.amplitude - a.amplitude);
        return formants.slice(0, 4);
    }

    /**
     * Estimate formant bandwidth
     */
    estimateBandwidth(frequencies, response, peakIndex) {
        const peakValue = response[peakIndex];
        const halfPower = peakValue / Math.sqrt(2);
        
        // Find -3dB points
        let lowerIndex = peakIndex;
        let upperIndex = peakIndex;
        
        while (lowerIndex > 0 && response[lowerIndex] > halfPower) {
            lowerIndex--;
        }
        
        while (upperIndex < response.length - 1 && response[upperIndex] > halfPower) {
            upperIndex++;
        }
        
        return frequencies[upperIndex] - frequencies[lowerIndex];
    }

    /**
     * Simulate articulator dynamics
     */
    simulateArticulatorMovement(articulator, target, current, dt) {
        const muscle = this.muscles[articulator];
        if (!muscle) return current;
        
        // Spring-mass-damper model
        const displacement = target - current;
        const springForce = muscle.stiffness * displacement;
        const dampingForce = -muscle.damping * (current - target) / dt;
        
        const totalForce = springForce + dampingForce;
        const acceleration = totalForce / muscle.mass;
        
        // Update position
        const velocity = acceleration * dt;
        const newPosition = current + velocity * dt;
        
        // Apply physical constraints
        return this.applyPhysicalConstraints(articulator, newPosition);
    }

    /**
     * Apply physical constraints to articulator positions
     */
    applyPhysicalConstraints(articulator, position) {
        const constraints = {
            tongueBody: { min: -1, max: 1 },
            tongueTip: { min: -0.5, max: 1 },
            lips: { min: 0, max: 2 },
            jaw: { min: 0, max: 30 },
            velum: { min: -1, max: 1 }
        };
        
        const constraint = constraints[articulator];
        if (!constraint) return position;
        
        return Math.max(constraint.min, Math.min(constraint.max, position));
    }

    /**
     * Calculate aerodynamic effects
     */
    calculateAerodynamics(articulatoryConfig) {
        const areas = this.mapArticulatorsToAreas(articulatoryConfig);
        const minArea = Math.min(...Object.values(areas));
        
        // Calculate flow velocity
        const pressure = this.aerodynamics.lungPressure;
        const flowVelocity = Math.sqrt(2 * pressure / this.aerodynamics.flowResistance);
        
        // Check for turbulence
        const reynoldsNumber = flowVelocity * minArea * 100;  // Simplified
        const turbulent = reynoldsNumber > this.aerodynamics.turbulenceThreshold;
        
        // Generate noise for fricatives
        let noiseLevel = 0;
        if (turbulent) {
            noiseLevel = (reynoldsNumber - this.aerodynamics.turbulenceThreshold) / 
                        this.aerodynamics.turbulenceThreshold;
            noiseLevel = Math.min(1, noiseLevel);
        }
        
        return {
            flow: flowVelocity * minArea,
            turbulent: turbulent,
            noiseLevel: noiseLevel,
            pressure: pressure
        };
    }
}

// Export the ultra-natural TTS system
export default RomanianUltraNaturalTTS;