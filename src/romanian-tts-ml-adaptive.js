/**
 * Machine Learning-Inspired Adaptive Romanian TTS System
 * Uses pattern recognition and adaptive learning to improve pronunciation over time
 */

class RomanianAdaptiveTTS {
    constructor() {
        this.neuralNetwork = this.initializeNeuralPatterns();
        this.conversationalState = new ConversationalStateManager();
        this.pronunciationCache = new AdaptivePronunciationCache();
        this.userFeedbackSystem = new UserFeedbackLearner();
        this.contextualMemory = new ContextualMemory();
    }

    initializeNeuralPatterns() {
        return {
            // Simulated neural network weights for pronunciation patterns
            wordEmbeddings: new Map(),
            contextVectors: new Map(),
            attentionWeights: new Map(),
            
            // Pattern recognition layers
            layers: {
                phonetic: this.createPhoneticLayer(),
                prosodic: this.createProsodicLayer(),
                semantic: this.createSemanticLayer(),
                pragmatic: this.createPragmaticLayer()
            },
            
            // Learning parameters
            learningRate: 0.01,
            momentum: 0.9,
            adaptationThreshold: 0.7
        };
    }

    createPhoneticLayer() {
        return {
            // Phonetic feature extraction
            features: {
                voicing: { weight: 0.8, bias: 0.1 },
                place: { weight: 0.9, bias: 0.05 },
                manner: { weight: 0.85, bias: 0.08 },
                nasality: { weight: 0.7, bias: 0.15 },
                palatalization: { weight: 0.75, bias: 0.12 }
            },
            
            // Activation functions for feature combination
            activation: (inputs) => {
                const sigmoid = x => 1 / (1 + Math.exp(-x));
                return inputs.map(sigmoid);
            },
            
            // Feature interactions matrix
            interactions: [
                [1.0, 0.7, 0.5, 0.3, 0.6],  // voicing
                [0.7, 1.0, 0.8, 0.4, 0.9],  // place
                [0.5, 0.8, 1.0, 0.5, 0.7],  // manner
                [0.3, 0.4, 0.5, 1.0, 0.2],  // nasality
                [0.6, 0.9, 0.7, 0.2, 1.0]   // palatalization
            ]
        };
    }

    createProsodicLayer() {
        return {
            // Prosodic contour generation
            contourGenerator: {
                baseline: 100,  // Hz
                range: 80,      // Hz variation
                smoothing: 0.3, // Smoothing factor
                
                generateContour: (length, pattern) => {
                    const contour = [];
                    for (let i = 0; i < length; i++) {
                        const position = i / length;
                        const value = this.calculateContourPoint(position, pattern);
                        contour.push(value);
                    }
                    return this.smoothContour(contour);
                }
            },
            
            // Rhythm pattern recognition
            rhythmDetector: {
                patterns: {
                    iambic: [0.7, 1.0],
                    trochaic: [1.0, 0.7],
                    dactylic: [1.0, 0.7, 0.7],
                    anapestic: [0.7, 0.7, 1.0]
                },
                
                detectPattern: (stresses) => {
                    let bestMatch = null;
                    let bestScore = 0;
                    
                    for (const [name, pattern] of Object.entries(this.patterns)) {
                        const score = this.comparePatterns(stresses, pattern);
                        if (score > bestScore) {
                            bestScore = score;
                            bestMatch = name;
                        }
                    }
                    
                    return { pattern: bestMatch, confidence: bestScore };
                }
            }
        };
    }

    createSemanticLayer() {
        return {
            // Word importance scoring
            importanceScorer: {
                weights: {
                    contentWord: 1.0,
                    functionWord: 0.3,
                    namedEntity: 1.2,
                    emotionalWord: 1.1,
                    technicalTerm: 0.9
                },
                
                scoreWord: (word, context) => {
                    const baseScore = this.getWordTypeScore(word);
                    const contextBoost = this.getContextualBoost(word, context);
                    const frequencyPenalty = this.getFrequencyPenalty(word);
                    
                    return baseScore * contextBoost * (1 - frequencyPenalty);
                }
            },
            
            // Semantic field clustering
            semanticFields: {
                technical: ['sistem', 'aplicație', 'funcție', 'parametru', 'algoritm'],
                emotional: ['fericit', 'trist', 'bucuros', 'supărat', 'entuziasmat'],
                temporal: ['azi', 'mâine', 'ieri', 'acum', 'atunci', 'înainte'],
                spatial: ['aici', 'acolo', 'sus', 'jos', 'lângă', 'departe'],
                social: ['mulțumesc', 'vă rog', 'scuze', 'bună', 'salut']
            }
        };
    }

    createPragmaticLayer() {
        return {
            // Speech act recognition
            speechActs: {
                assertion: { confidence: 0, markers: ['este', 'sunt', 'am'] },
                question: { confidence: 0, markers: ['?', 'ce', 'cum', 'unde'] },
                request: { confidence: 0, markers: ['vă rog', 'puteți', 'ați putea'] },
                greeting: { confidence: 0, markers: ['bună', 'salut', 'hello'] },
                thanks: { confidence: 0, markers: ['mulțumesc', 'mersi', 'thanks'] }
            },
            
            // Politeness level detection
            politenessDetector: {
                levels: {
                    formal: { score: 0, markers: ['dumneavoastră', 'vă rog', 'ați binevoi'] },
                    neutral: { score: 0, markers: ['tu', 'puteți', 'poate'] },
                    informal: { score: 0, markers: ['bă', 'mă', 'frate', 'boss'] }
                },
                
                detectLevel: (text) => {
                    const scores = {};
                    for (const [level, config] of Object.entries(this.levels)) {
                        scores[level] = this.calculatePolitenessScore(text, config.markers);
                    }
                    return this.selectBestLevel(scores);
                }
            }
        };
    }

    calculateContourPoint(position, pattern) {
        // Sine wave modulation for natural contour
        const baseWave = Math.sin(position * Math.PI * 2);
        const harmonics = Math.sin(position * Math.PI * 4) * 0.3 + 
                         Math.sin(position * Math.PI * 8) * 0.1;
        
        // Pattern-specific modulation
        const patternModulation = this.getPatternModulation(position, pattern);
        
        return this.neuralNetwork.layers.prosodic.contourGenerator.baseline + 
               (baseWave + harmonics) * this.neuralNetwork.layers.prosodic.contourGenerator.range * 
               patternModulation;
    }

    smoothContour(contour) {
        const smoothed = [];
        const windowSize = 3;
        
        for (let i = 0; i < contour.length; i++) {
            let sum = 0;
            let count = 0;
            
            for (let j = -windowSize; j <= windowSize; j++) {
                const index = i + j;
                if (index >= 0 && index < contour.length) {
                    const weight = Math.exp(-Math.abs(j) / 2);
                    sum += contour[index] * weight;
                    count += weight;
                }
            }
            
            smoothed.push(sum / count);
        }
        
        return smoothed;
    }

    getPatternModulation(position, pattern) {
        switch(pattern) {
            case 'rising':
                return 0.5 + position * 0.5;
            case 'falling':
                return 1.0 - position * 0.5;
            case 'rise-fall':
                return position < 0.5 ? 0.5 + position : 1.5 - position;
            case 'fall-rise':
                return position < 0.5 ? 1.0 - position : position - 0.5;
            default:
                return 1.0;
        }
    }
}

/**
 * Conversational State Manager
 * Maintains context across utterances for more natural conversation
 */
class ConversationalStateManager {
    constructor() {
        this.history = [];
        this.currentTopic = null;
        this.emotionalState = 'neutral';
        this.turnCount = 0;
        this.speakerModel = {
            pace: 'normal',
            energy: 'medium',
            formality: 'neutral'
        };
    }

    updateState(utterance) {
        this.history.push({
            text: utterance,
            timestamp: Date.now(),
            topic: this.currentTopic,
            emotion: this.emotionalState,
            turn: this.turnCount++
        });

        // Maintain sliding window of context
        if (this.history.length > 10) {
            this.history.shift();
        }

        // Update topic tracking
        this.updateTopic(utterance);
        
        // Update emotional state
        this.updateEmotionalState(utterance);
        
        // Update speaker model
        this.updateSpeakerModel();
    }

    updateTopic(utterance) {
        // Simple topic extraction based on nouns and named entities
        const topics = this.extractTopics(utterance);
        
        if (topics.length > 0) {
            // Check topic continuity
            const previousTopic = this.currentTopic;
            const topicSimilarity = this.calculateTopicSimilarity(previousTopic, topics[0]);
            
            if (topicSimilarity < 0.3) {
                // Topic shift detected
                this.currentTopic = topics[0];
                return 'topic_shift';
            } else {
                // Topic continuation
                this.currentTopic = this.mergeTopic(previousTopic, topics[0]);
                return 'topic_continuation';
            }
        }
        
        return 'no_topic';
    }

    extractTopics(text) {
        // Simplified topic extraction
        const nouns = text.match(/\b[A-ZĂÂÎȘȚ][a-zăâîșț]+\b/g) || [];
        return nouns.slice(0, 3);
    }

    calculateTopicSimilarity(topic1, topic2) {
        if (!topic1 || !topic2) return 0;
        
        // Levenshtein distance normalized
        const distance = this.levenshteinDistance(topic1, topic2);
        const maxLength = Math.max(topic1.length, topic2.length);
        
        return 1 - (distance / maxLength);
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    mergeTopic(previous, current) {
        // Simple merge strategy
        return `${previous}_${current}`;
    }

    updateEmotionalState(utterance) {
        const emotions = {
            positive: ['fericit', 'bucuros', 'minunat', 'excelent', 'super'],
            negative: ['trist', 'supărat', 'rău', 'groaznic', 'teribil'],
            neutral: ['bine', 'ok', 'normal', 'așa', 'decent']
        };

        let scores = {
            positive: 0,
            negative: 0,
            neutral: 0
        };

        const words = utterance.toLowerCase().split(/\s+/);
        
        for (const word of words) {
            for (const [emotion, markers] of Object.entries(emotions)) {
                if (markers.includes(word)) {
                    scores[emotion]++;
                }
            }
        }

        // Decay previous emotional state
        const previousWeight = 0.3;
        const currentWeight = 0.7;

        if (this.emotionalState === 'positive') scores.positive += previousWeight * 2;
        if (this.emotionalState === 'negative') scores.negative += previousWeight * 2;
        if (this.emotionalState === 'neutral') scores.neutral += previousWeight * 2;

        // Select dominant emotion
        const maxEmotion = Object.entries(scores).reduce((a, b) => 
            scores[a[0]] > scores[b[0]] ? a : b
        );

        this.emotionalState = maxEmotion[0];
    }

    updateSpeakerModel() {
        // Analyze recent history for speaker characteristics
        const recentUtterances = this.history.slice(-5);
        
        if (recentUtterances.length === 0) return;

        // Calculate average utterance length
        const avgLength = recentUtterances.reduce((sum, item) => 
            sum + item.text.length, 0
        ) / recentUtterances.length;

        // Update pace based on length
        if (avgLength < 50) {
            this.speakerModel.pace = 'slow';
        } else if (avgLength > 150) {
            this.speakerModel.pace = 'fast';
        } else {
            this.speakerModel.pace = 'normal';
        }

        // Update energy based on emotional states
        const emotionCounts = recentUtterances.reduce((counts, item) => {
            counts[item.emotion] = (counts[item.emotion] || 0) + 1;
            return counts;
        }, {});

        if (emotionCounts.positive > emotionCounts.negative) {
            this.speakerModel.energy = 'high';
        } else if (emotionCounts.negative > emotionCounts.positive) {
            this.speakerModel.energy = 'low';
        } else {
            this.speakerModel.energy = 'medium';
        }
    }

    getConversationalAdjustments() {
        const adjustments = {
            rate: 1.0,
            pitch: 1.0,
            emphasis: 'normal',
            pauseDuration: 1.0
        };

        // Adjust based on pace
        switch (this.speakerModel.pace) {
            case 'slow':
                adjustments.rate = 0.9;
                adjustments.pauseDuration = 1.2;
                break;
            case 'fast':
                adjustments.rate = 1.1;
                adjustments.pauseDuration = 0.8;
                break;
        }

        // Adjust based on energy
        switch (this.speakerModel.energy) {
            case 'high':
                adjustments.pitch = 1.05;
                adjustments.emphasis = 'moderate';
                break;
            case 'low':
                adjustments.pitch = 0.95;
                adjustments.emphasis = 'reduced';
                break;
        }

        // Adjust based on emotional state
        switch (this.emotionalState) {
            case 'positive':
                adjustments.pitch *= 1.03;
                adjustments.rate *= 1.02;
                break;
            case 'negative':
                adjustments.pitch *= 0.97;
                adjustments.rate *= 0.98;
                break;
        }

        return adjustments;
    }
}

/**
 * Adaptive Pronunciation Cache
 * Learns from usage patterns and optimizes frequently used pronunciations
 */
class AdaptivePronunciationCache {
    constructor(maxSize = 1000) {
        this.cache = new Map();
        this.accessCounts = new Map();
        this.maxSize = maxSize;
        this.hitRate = 0;
        this.totalAccesses = 0;
    }

    get(key) {
        this.totalAccesses++;
        
        if (this.cache.has(key)) {
            this.hitRate = (this.hitRate * (this.totalAccesses - 1) + 1) / this.totalAccesses;
            this.accessCounts.set(key, (this.accessCounts.get(key) || 0) + 1);
            
            // Move to front (LRU)
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            
            return value;
        }
        
        this.hitRate = (this.hitRate * (this.totalAccesses - 1)) / this.totalAccesses;
        return null;
    }

    set(key, value) {
        // Remove oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            this.accessCounts.delete(firstKey);
        }
        
        this.cache.set(key, value);
        this.accessCounts.set(key, 1);
    }

    adapt() {
        // Reorganize cache based on access patterns
        const entries = Array.from(this.cache.entries());
        const counts = this.accessCounts;
        
        // Sort by access count (most accessed first)
        entries.sort((a, b) => {
            const countA = counts.get(a[0]) || 0;
            const countB = counts.get(b[0]) || 0;
            return countB - countA;
        });
        
        // Rebuild cache with frequently accessed items first
        this.cache.clear();
        entries.forEach(([key, value]) => {
            this.cache.set(key, value);
        });
        
        // Prune rarely accessed items if hit rate is low
        if (this.hitRate < 0.5 && this.cache.size > this.maxSize * 0.8) {
            const threshold = this.calculatePruneThreshold();
            
            for (const [key, count] of this.accessCounts.entries()) {
                if (count < threshold) {
                    this.cache.delete(key);
                    this.accessCounts.delete(key);
                }
            }
        }
    }

    calculatePruneThreshold() {
        const counts = Array.from(this.accessCounts.values());
        counts.sort((a, b) => a - b);
        
        // Use median as threshold
        const median = counts[Math.floor(counts.length / 2)];
        return Math.max(2, median);
    }

    getStatistics() {
        return {
            size: this.cache.size,
            hitRate: this.hitRate,
            totalAccesses: this.totalAccesses,
            mostAccessed: this.getMostAccessed(5)
        };
    }

    getMostAccessed(n) {
        const sorted = Array.from(this.accessCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, n);
        
        return sorted.map(([key, count]) => ({
            key: key,
            count: count,
            percentage: (count / this.totalAccesses * 100).toFixed(2)
        }));
    }
}

/**
 * User Feedback Learner
 * Adapts pronunciation based on implicit and explicit user feedback
 */
class UserFeedbackLearner {
    constructor() {
        this.feedbackHistory = [];
        this.pronunciationScores = new Map();
        this.adjustmentRules = new Map();
        this.confidenceThreshold = 0.7;
    }

    recordFeedback(text, pronunciation, feedback) {
        const entry = {
            text: text,
            pronunciation: pronunciation,
            feedback: feedback,
            timestamp: Date.now(),
            features: this.extractFeatures(text, pronunciation)
        };

        this.feedbackHistory.push(entry);
        this.updateScores(entry);
        this.deriveRules();
    }

    extractFeatures(text, pronunciation) {
        return {
            length: text.length,
            wordCount: text.split(/\s+/).length,
            hasDiacritics: /[ăâîșț]/i.test(text),
            hasNumbers: /\d/.test(text),
            hasPunctuation: /[.,!?;:]/.test(text),
            sentenceType: this.detectSentenceType(text),
            complexity: this.calculateComplexity(text)
        };
    }

    detectSentenceType(text) {
        if (text.includes('?')) return 'question';
        if (text.includes('!')) return 'exclamation';
        if (text.includes('...')) return 'trailing';
        return 'declarative';
    }

    calculateComplexity(text) {
        const words = text.split(/\s+/);
        const avgWordLength = words.reduce((sum, word) => 
            sum + word.length, 0
        ) / words.length;
        
        const complexityScore = avgWordLength * 0.3 + 
                               words.length * 0.2 + 
                               (text.match(/[ăâîșț]/gi) || []).length * 0.5;
        
        if (complexityScore < 5) return 'simple';
        if (complexityScore < 10) return 'moderate';
        return 'complex';
    }

    updateScores(entry) {
        const key = this.generateKey(entry.features);
        const currentScore = this.pronunciationScores.get(key) || {
            positive: 0,
            negative: 0,
            confidence: 0
        };

        if (entry.feedback === 'positive') {
            currentScore.positive++;
        } else if (entry.feedback === 'negative') {
            currentScore.negative++;
        }

        currentScore.confidence = currentScore.positive / 
                                 (currentScore.positive + currentScore.negative);

        this.pronunciationScores.set(key, currentScore);
    }

    generateKey(features) {
        return `${features.sentenceType}_${features.complexity}_${features.hasDiacritics}`;
    }

    deriveRules() {
        // Analyze patterns in feedback to create adjustment rules
        for (const [key, score] of this.pronunciationScores.entries()) {
            if (score.confidence >= this.confidenceThreshold) {
                // High confidence positive pattern
                this.adjustmentRules.set(key, {
                    type: 'positive',
                    adjustments: this.calculatePositiveAdjustments(key)
                });
            } else if (score.confidence <= (1 - this.confidenceThreshold)) {
                // High confidence negative pattern
                this.adjustmentRules.set(key, {
                    type: 'negative',
                    adjustments: this.calculateNegativeAdjustments(key)
                });
            }
        }
    }

    calculatePositiveAdjustments(key) {
        // Preserve successful patterns
        return {
            rate: 1.0,
            pitch: 1.0,
            emphasis: 'maintain',
            pauseMultiplier: 1.0
        };
    }

    calculateNegativeAdjustments(key) {
        // Adjust problematic patterns
        const parts = key.split('_');
        const sentenceType = parts[0];
        const complexity = parts[1];
        
        const adjustments = {
            rate: 1.0,
            pitch: 1.0,
            emphasis: 'normal',
            pauseMultiplier: 1.0
        };

        if (complexity === 'complex') {
            adjustments.rate = 0.9;  // Slow down
            adjustments.pauseMultiplier = 1.2;  // Longer pauses
        }

        if (sentenceType === 'question') {
            adjustments.pitch = 1.1;  // Higher pitch for questions
        }

        return adjustments;
    }

    getAdjustments(text, pronunciation) {
        const features = this.extractFeatures(text, pronunciation);
        const key = this.generateKey(features);
        const rule = this.adjustmentRules.get(key);
        
        if (rule) {
            return rule.adjustments;
        }
        
        // Default adjustments
        return {
            rate: 1.0,
            pitch: 1.0,
            emphasis: 'normal',
            pauseMultiplier: 1.0
        };
    }

    learn() {
        // Periodic learning cycle
        if (this.feedbackHistory.length < 10) return;
        
        // Use simple gradient descent to optimize parameters
        const learningRate = 0.01;
        
        for (const entry of this.feedbackHistory.slice(-50)) {
            const predicted = this.predict(entry.text);
            const actual = entry.feedback === 'positive' ? 1 : 0;
            const error = actual - predicted;
            
            // Update weights based on error
            const features = entry.features;
            for (const [feature, value] of Object.entries(features)) {
                if (typeof value === 'number') {
                    // Simplified weight update
                    const currentWeight = this.getWeight(feature);
                    const newWeight = currentWeight + learningRate * error * value;
                    this.setWeight(feature, newWeight);
                }
            }
        }
    }

    predict(text) {
        // Simple prediction based on learned weights
        const features = this.extractFeatures(text, null);
        let score = 0;
        
        for (const [feature, value] of Object.entries(features)) {
            if (typeof value === 'number') {
                score += this.getWeight(feature) * value;
            }
        }
        
        // Sigmoid activation
        return 1 / (1 + Math.exp(-score));
    }

    getWeight(feature) {
        // Retrieve or initialize weight
        return this.weights?.get(feature) || Math.random() * 0.1;
    }

    setWeight(feature, value) {
        if (!this.weights) {
            this.weights = new Map();
        }
        this.weights.set(feature, value);
    }
}

/**
 * Contextual Memory System
 * Maintains long-term context for improved coherence
 */
class ContextualMemory {
    constructor(capacity = 100) {
        this.shortTermMemory = [];  // Last 5 utterances
        this.longTermMemory = new Map();  // Topic-based storage
        this.episodicMemory = [];  // Conversation episodes
        this.capacity = capacity;
    }

    store(utterance, context) {
        // Update short-term memory
        this.shortTermMemory.push({
            utterance: utterance,
            context: context,
            timestamp: Date.now()
        });
        
        if (this.shortTermMemory.length > 5) {
            const old = this.shortTermMemory.shift();
            // Move to long-term if significant
            if (this.isSignificant(old)) {
                this.transferToLongTerm(old);
            }
        }

        // Update episodic memory
        this.updateEpisodicMemory(utterance, context);
    }

    isSignificant(memory) {
        // Check if memory is worth preserving
        const significanceFactors = {
            hasNamedEntity: /[A-Z][a-z]+/.test(memory.utterance),
            hasNumber: /\d+/.test(memory.utterance),
            hasQuestion: /\?/.test(memory.utterance),
            isLong: memory.utterance.length > 100,
            hasEmotionalMarker: /fericit|trist|bucuros|supărat/.test(memory.utterance)
        };

        const score = Object.values(significanceFactors).filter(v => v).length;
        return score >= 2;
    }

    transferToLongTerm(memory) {
        const topic = this.extractTopic(memory.utterance);
        
        if (!this.longTermMemory.has(topic)) {
            this.longTermMemory.set(topic, []);
        }
        
        const topicMemories = this.longTermMemory.get(topic);
        topicMemories.push(memory);
        
        // Maintain capacity
        if (topicMemories.length > 10) {
            topicMemories.shift();
        }
    }

    extractTopic(utterance) {
        // Simple topic extraction
        const words = utterance.split(/\s+/);
        const nouns = words.filter(w => 
            w.length > 4 && /^[A-ZĂÂÎȘȚ]/.test(w)
        );
        
        return nouns[0] || 'general';
    }

    updateEpisodicMemory(utterance, context) {
        if (this.episodicMemory.length === 0 || this.isNewEpisode(context)) {
            this.episodicMemory.push({
                id: Date.now(),
                utterances: [utterance],
                startTime: Date.now(),
                context: context
            });
        } else {
            const currentEpisode = this.episodicMemory[this.episodicMemory.length - 1];
            currentEpisode.utterances.push(utterance);
        }

        // Limit episode count
        if (this.episodicMemory.length > this.capacity) {
            this.episodicMemory.shift();
        }
    }

    isNewEpisode(context) {
        if (this.episodicMemory.length === 0) return true;
        
        const lastEpisode = this.episodicMemory[this.episodicMemory.length - 1];
        const timeDiff = Date.now() - lastEpisode.startTime;
        
        // New episode if more than 5 minutes passed or context changed significantly
        return timeDiff > 300000 || this.contextChanged(lastEpisode.context, context);
    }

    contextChanged(oldContext, newContext) {
        // Simple context comparison
        return oldContext.topic !== newContext.topic ||
               oldContext.emotion !== newContext.emotion;
    }

    retrieve(query, type = 'all') {
        const results = [];
        
        if (type === 'all' || type === 'short') {
            results.push(...this.shortTermMemory.filter(m => 
                m.utterance.includes(query)
            ));
        }
        
        if (type === 'all' || type === 'long') {
            for (const [topic, memories] of this.longTermMemory.entries()) {
                if (topic.includes(query) || memories.some(m => m.utterance.includes(query))) {
                    results.push(...memories);
                }
            }
        }
        
        if (type === 'all' || type === 'episodic') {
            for (const episode of this.episodicMemory) {
                if (episode.utterances.some(u => u.includes(query))) {
                    results.push({
                        type: 'episode',
                        episode: episode
                    });
                }
            }
        }
        
        return results;
    }

    getRelevantContext(currentUtterance) {
        // Combine different memory types for context
        const context = {
            recent: this.shortTermMemory.slice(-3),
            related: [],
            episodic: null
        };

        // Find related long-term memories
        const topic = this.extractTopic(currentUtterance);
        if (this.longTermMemory.has(topic)) {
            context.related = this.longTermMemory.get(topic).slice(-2);
        }

        // Find relevant episode
        if (this.episodicMemory.length > 0) {
            context.episodic = this.episodicMemory[this.episodicMemory.length - 1];
        }

        return context;
    }
}

// Export the adaptive system
export { 
    RomanianAdaptiveTTS,
    ConversationalStateManager,
    AdaptivePronunciationCache,
    UserFeedbackLearner,
    ContextualMemory
};