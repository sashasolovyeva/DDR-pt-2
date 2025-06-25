import SynthMode from "./SynthMode.js";
import SamplerMode from "./SamplerMode.js";
import SidMode from "./SidMode.js";
import { altPattern1, altPattern2, altPattern3 } from "./music-variables.js";

const modes = [new SynthMode("synth", "sine"), 
    // new SynthMode("music2", "square"), 
    new SidMode("s4y"),
    new SamplerMode("hopecore"),
    new SamplerMode("sax", altPattern1),
    new SamplerMode("alice", altPattern2),
    new SamplerMode("scary", altPattern3),
];

export { modes };