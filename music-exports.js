import SynthMode from "./SynthMode.js";
import SamplerMode from "./SamplerMode.js";
import { altPattern1, altPattern2 } from "./music-variables.js";

const modes = [new SynthMode("music1", "sine"), new SynthMode("music2", "square"), 
    new SamplerMode("hopecore"),
    new SamplerMode("sax", altPattern1),
    new SamplerMode("alice", altPattern2)
];

export { modes };