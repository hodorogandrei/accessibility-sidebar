class RomanianTTSEnhancer {
    constructor() {
        this.diacriticsMap = {
            'ă': 'ă', 'â': 'â', 'î': 'î', 'ș': 'ș', 'ț': 'ț',
            'Ă': 'Ă', 'Â': 'Â', 'Î': 'Î', 'Ș': 'Ș', 'Ț': 'Ț'
        };
        
        this.phoneticReplacements = {
            'ce': 'che', 'ci': 'chi', 'ge': 'ghe', 'gi': 'ghi',
            'che': 'ke', 'chi': 'ki',
            'x': 'cs', 'eu': 'e-u', 'ea': 'e-a', 'oa': 'o-a',
            'ii': 'i-i', 'âi': 'ăi', 'îi': 'ăi',
            'eau': 'e-au', 'iau': 'i-au', 'uau': 'u-au'
        };

        this.stressPatterns = {
            'este': 'ES-te', 'sunt': 'SUNT', 'pentru': 'PEN-tru',
            'despre': 'DES-pre', 'foarte': 'FOAR-te', 'aceasta': 'a-CEAS-ta',
            'acesta': 'a-CES-ta', 'această': 'a-CEAS-tă', 'acest': 'a-CEST',
            'toate': 'TOA-te', 'toată': 'TOA-tă', 'toate': 'TOA-te',
            'nimic': 'ni-MIC', 'ceva': 'CE-va', 'cineva': 'CI-ne-va'
        };

        this.commonPhrases = {
            'bună ziua': '<prosody rate="95%" pitch="+5%">bună ziua</prosody>',
            'la revedere': '<prosody rate="95%" pitch="-5%">la revedere</prosody>',
            'mulțumesc': '<prosody rate="90%">mul-țu-mesc</prosody>',
            'vă rog': '<prosody rate="95%">vă rog</prosody>',
            'cu plăcere': '<prosody rate="95%">cu plăcere</prosody>',
            'mă scuzați': '<prosody rate="90%">mă scuzați</prosody>',
            'poftim': '<prosody rate="95%" pitch="+10%">poftim</prosody>'
        };

        this.sentenceEndingsMap = {
            '.': '<break time="500ms"/>',
            '!': '<break time="400ms"/>',
            '?': '<break time="450ms"/>',
            ',': '<break time="200ms"/>',
            ';': '<break time="300ms"/>',
            ':': '<break time="350ms"/>'
        };

        this.numeralPronunciation = {
            '1': 'unu', '2': 'doi', '3': 'trei', '4': 'patru', '5': 'cinci',
            '6': 'șase', '7': 'șapte', '8': 'opt', '9': 'nouă', '10': 'zece',
            '11': 'unsprezece', '12': 'doisprezece', '20': 'douăzeci',
            '30': 'treizeci', '40': 'patruzeci', '50': 'cincizeci',
            '100': 'o sută', '1000': 'o mie'
        };
    }

    normalizeText(text) {
        text = text.replace(/[șş]/g, 'ș');
        text = text.replace(/[țţ]/g, 'ț');
        text = text.replace(/[ăâ]/g, match => this.diacriticsMap[match] || match);
        
        text = text.replace(/\s+/g, ' ').trim();
        
        text = text.replace(/([.!?])\s*([a-zăâîșț])/gi, (match, punct, letter) => {
            return punct + ' ' + letter.toUpperCase();
        });

        return text;
    }

    applyPhoneticEnhancements(text) {
        for (const [pattern, replacement] of Object.entries(this.phoneticReplacements)) {
            const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
            text = text.replace(regex, replacement);
        }
        
        text = text.replace(/([bcdfghjklmnpqrstvwxyz])r([bcdfghjklmnpqrstvwxyz])/gi, '$1-r$2');
        
        text = text.replace(/([aeiouăâî])([bcdfghjklmnpqrstvwxyz])\1/gi, '$1-$2$1');
        
        return text;
    }

    addStressAndIntonation(text) {
        for (const [word, stressed] of Object.entries(this.stressPatterns)) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            text = text.replace(regex, stressed);
        }
        
        text = text.replace(/\?([^.!?]*?)$/g, (match) => {
            return `<prosody pitch="+15%" contour="(0%,+0Hz)(50%,+10Hz)(100%,+30Hz)">${match}</prosody>`;
        });
        
        text = text.replace(/!([^.!?]*?)$/g, (match) => {
            return `<prosody pitch="+10%" rate="105%">${match}</prosody>`;
        });
        
        return text;
    }

    processCommonPhrases(text) {
        for (const [phrase, ssmlPhrase] of Object.entries(this.commonPhrases)) {
            const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
            text = text.replace(regex, ssmlPhrase);
        }
        return text;
    }

    addPausesAndBreaks(text) {
        for (const [punct, pause] of Object.entries(this.sentenceEndingsMap)) {
            text = text.replace(new RegExp(`\\${punct}`, 'g'), punct + pause);
        }
        
        text = text.replace(/(\w+)\s+-\s+(\w+)/g, '$1 <break time="100ms"/> - <break time="100ms"/> $2');
        
        text = text.replace(/([.!?])\s+/g, '$1 <break time="300ms"/> ');
        
        return text;
    }

    expandNumbers(text) {
        const numberRegex = /\b(\d+)\b/g;
        text = text.replace(numberRegex, (match, num) => {
            const number = parseInt(num);
            if (this.numeralPronunciation[num]) {
                return this.numeralPronunciation[num];
            }
            return this.expandComplexNumber(number);
        });
        return text;
    }

    expandComplexNumber(num) {
        if (num < 20) {
            return this.numeralPronunciation[num.toString()] || num.toString();
        }
        
        if (num < 100) {
            const tens = Math.floor(num / 10) * 10;
            const ones = num % 10;
            const tensWord = this.numeralPronunciation[tens.toString()] || `${tens}`;
            if (ones === 0) return tensWord;
            const onesWord = this.numeralPronunciation[ones.toString()] || ones.toString();
            return `${tensWord} și ${onesWord}`;
        }
        
        if (num < 1000) {
            const hundreds = Math.floor(num / 100);
            const remainder = num % 100;
            let result = hundreds === 1 ? 'o sută' : `${this.expandComplexNumber(hundreds)} sute`;
            if (remainder > 0) {
                result += ` ${this.expandComplexNumber(remainder)}`;
            }
            return result;
        }
        
        return num.toString();
    }

    optimizeForVoice(text, voiceName) {
        const voiceOptimizations = {
            'Microsoft': {
                rate: 0.95,
                pitch: 1.05,
                emphasizeConsonants: true
            },
            'Google': {
                rate: 0.9,
                pitch: 1.0,
                smoothTransitions: true
            },
            'eSpeak': {
                rate: 0.85,
                pitch: 0.95,
                addExtraPauses: true
            }
        };

        let optimization = null;
        for (const [vendor, settings] of Object.entries(voiceOptimizations)) {
            if (voiceName && voiceName.includes(vendor)) {
                optimization = settings;
                break;
            }
        }

        if (optimization) {
            if (optimization.emphasizeConsonants) {
                text = text.replace(/([bcdfghjklmnpqrstvwxyz])/gi, '<emphasis level="moderate">$1</emphasis>');
            }
            if (optimization.smoothTransitions) {
                text = text.replace(/([aeiouăâî])([bcdfghjklmnpqrstvwxyz])/gi, '$1<break time="10ms"/>$2');
            }
            if (optimization.addExtraPauses) {
                text = text.replace(/\s+/g, ' <break time="50ms"/> ');
            }
        }

        return text;
    }

    splitIntoChunks(text, maxChunkSize = 200) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const chunks = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length <= maxChunkSize) {
                currentChunk += sentence + ' ';
            } else {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                }
                
                if (sentence.length <= maxChunkSize) {
                    currentChunk = sentence + ' ';
                } else {
                    const words = sentence.split(' ');
                    let tempChunk = '';
                    for (const word of words) {
                        if ((tempChunk + word).length <= maxChunkSize) {
                            tempChunk += word + ' ';
                        } else {
                            chunks.push(tempChunk.trim());
                            tempChunk = word + ' ';
                        }
                    }
                    currentChunk = tempChunk;
                }
            }
        }

        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    wrapInSSML(text) {
        return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ro-RO">
            <prosody rate="95%" pitch="1.05">
                ${text}
            </prosody>
        </speak>`;
    }

    enhanceText(text, options = {}) {
        const {
            useSSML = false,
            voiceName = null,
            expandNumerals = true,
            addPauses = true,
            applyPhonetics = true,
            processKeyPhrases = true
        } = options;

        text = this.normalizeText(text);

        if (expandNumerals) {
            text = this.expandNumbers(text);
        }

        if (applyPhonetics) {
            text = this.applyPhoneticEnhancements(text);
        }

        if (processKeyPhrases) {
            text = this.processCommonPhrases(text);
        }

        text = this.addStressAndIntonation(text);

        if (addPauses) {
            text = this.addPausesAndBreaks(text);
        }

        if (voiceName) {
            text = this.optimizeForVoice(text, voiceName);
        }

        if (useSSML) {
            text = this.wrapInSSML(text);
        }

        return text;
    }

    createEnhancedUtterance(text, voiceObject = null) {
        const enhancedText = this.enhanceText(text, {
            useSSML: false,
            voiceName: voiceObject?.name,
            expandNumerals: true,
            addPauses: true,
            applyPhonetics: true,
            processKeyPhrases: true
        });

        const chunks = this.splitIntoChunks(enhancedText);
        
        return {
            chunks,
            totalChunks: chunks.length,
            estimatedDuration: chunks.join(' ').length * 50
        };
    }

    applyAdaptiveRate(text, baseRate = 0.9) {
        const wordCount = text.split(/\s+/).length;
        
        if (wordCount < 10) {
            return baseRate * 0.95;
        } else if (wordCount < 30) {
            return baseRate;
        } else if (wordCount < 50) {
            return baseRate * 1.05;
        } else {
            return baseRate * 1.1;
        }
    }

    detectAndFixCommonErrors(text) {
        const corrections = {
            'sînt': 'sunt',
            'cînd': 'când',
            'mîine': 'mâine',
            'pîine': 'pâine',
            'cîine': 'câine',
            'romîn': 'român',
            'romînă': 'română',
            'romînesc': 'românesc',
            'intilnire': 'întâlnire',
            'intilni': 'întâlni',
            'intrebare': 'întrebare',
            'intreba': 'întreba'
        };

        for (const [error, correction] of Object.entries(corrections)) {
            const regex = new RegExp(`\\b${error}\\b`, 'gi');
            text = text.replace(regex, correction);
        }

        return text;
    }

    addEmphasisToKeywords(text, keywords = []) {
        const defaultKeywords = ['important', 'urgent', 'atenție', 'notă', 'avertisment', 'pericol'];
        const allKeywords = [...defaultKeywords, ...keywords];
        
        for (const keyword of allKeywords) {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
            text = text.replace(regex, '<emphasis level="strong">$1</emphasis>');
        }
        
        return text;
    }
}

export default RomanianTTSEnhancer;