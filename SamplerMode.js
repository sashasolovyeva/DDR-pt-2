import { notes, shuffle } from "./music-variables.js";

class SamplerMode {
    constructor(modeName, notePattern = notes) {

        this.notes = shuffle(notePattern);

        this.modeName = modeName;

        let urlMap = {};
        for (let note of this.notes) {
            urlMap[note] = `${note}.wav`;
        }

        this.synthObj = new Tone.Sampler({
            urls: urlMap,
            baseUrl: `samples/${modeName}-`,
            volume: +5,
            envelope: {
                attack: 0.05,
                release: 0.5,
            }
        }).toDestination();
    }
}

export default SamplerMode;