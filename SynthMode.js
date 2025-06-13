import { notes, shuffle } from "./music-variables.js";

class SynthMode {
    
    constructor(modeName, synthType, notePattern = notes) {
        this.modeName = modeName;
        
        this.notes = shuffle(notePattern);

        this.synthType = synthType;
        this.synthObj = new Tone.Synth({
            oscillator: { type: this.synthType },
            envelope: {
                attack: 0.1,
                decay: 0.2,
                sustain: 0.7,
                release: 0.3,
            },
        }).toDestination();
    }
}

export default SynthMode;