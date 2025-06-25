import { notes, shuffle } from "./music-variables.js";

class FilterChain {
  constructor(ac) {
    this.ac = ac;
    this.in = ac.createGain();
    this.out = ac.createGain();

    this.wetMix = ac.createGain();
    this.dryMix = ac.createGain();

    this.convolver = ac.createConvolver();

    const genRandom = (...args) => {
      const buf = ac.createBuffer(...args);
      for (let i = 0; i < buf.numberOfChannels; i++) {
        const chan = buf.getChannelData(i);
        for (let i = 0; i < buf.length; i++) {
          chan[i] = Math.random() * Math.pow(Math.max(0, Math.min(1, 1-i/buf.length)), 6);
        }
      }
      return buf;
    };
    this.convolver.buffer = genRandom(2, ac.sampleRate * 2, ac.sampleRate);

    this.hp = ac.createBiquadFilter();
    this.hp.type = 'highpass';
    this.hp.frequency.value = 10;

    this.in.connect(this.dryMix);
    this.in.connect(this.convolver);
    this.convolver.connect(this.wetMix);

    this.compGain = ac.createGain();
    this.compGain.gain.value = 2.5;
    this.compressor = ac.createDynamicsCompressor();

    this.dryMix.connect(this.hp);
    this.wetMix.connect(this.hp);

    this.hp.connect(this.compGain);
    this.compGain.connect(this.compressor);

    this.compressor.connect(this.out);
  }

  update() {
  }
}

class Synth {
  constructor(ac) {
    this.ac = ac;
    this.node = new GainNode(ac);
  }
  playNote(freq) {
    const { ac } = this;

    const oscs = [];

    const filt = new BiquadFilterNode(ac, {
      frequency: freq * 8,
    });
    // filt.frequency.setTargetAtTime(freq * 8, ac.currentTime, 0.2);
    filt.Q.value = 1;

    const gain = new GainNode(ac, { gain: 0.125 });

    for (let i = 0 ; i < 1; i++) {
      const frequency = (freq * (1+3*i));
      const osc = new OscillatorNode(ac, {
        frequency,
        type: 'square',
      });
      // osc.frequency.setTargetAtTime(freq*(1+2*i), ac.currentTime, 0.01);

      const g = new GainNode(ac, {
        gain: 1/(i+1),
      });
      g.gain.setTargetAtTime(i>0?0:0.5, ac.currentTime, 0.5);

      osc.connect(g);
      g.connect(filt);
      osc.start();
      oscs.push(osc);
    }

    filt.frequency.setTargetAtTime(freq * 2, ac.currentTime, 0.05);
    gain.gain.setTargetAtTime(0.1, ac.currentTime + 0.25, 0.1);
    filt.connect(gain);
    gain.connect(this.node);

    return () => {
      gain.gain.setTargetAtTime(0, ac.currentTime + 0.25, 0.04);

      for (let i = 0 ; i < oscs.length; i++) {
        const osc = oscs[i];
        const frequency = (freq * (1+2*i)) * 2;
        osc.frequency.setTargetAtTime(frequency, ac.currentTime, 0.01);
      }
      filt.frequency.setTargetAtTime(freq * 8, ac.currentTime, 0.05);

      setTimeout(() => {
        for (const osc of oscs) {
          osc.stop();
          osc.disconnect();
        }
      }, 2000);
    };
  }
}

// const ac = new AudioContext();
// const filterChain = new FilterChain(ac);
// const synth = new Synth(ac);
// synth.node.connect(filterChain.in);
// filterChain.out.connect(ac.destination);

// // const stop = synth.playNote(440);
// // setTimeout(stop, 1000);

// const frequencyForNote = note =>
//   440 * Math.pow(2, note);

// const freqInScale = (i, scale, mode = 0) => {
//   let octave = 0;
//   while (i < 0) {
//     i += scale.length;
//     octave--;
//   }
//   const note = octave + Math.floor(i/scale.length) + scale[(i+mode)%scale.length]/12

//   // SASHA, change this "2" to change the scale it's in
//   return frequencyForNote(note + (-4/12));
// };

// const majorScale = [0, 2, 4, 5, 7, 9, 11];
// const ragaScale = [0, 2, 3, 5, 7, 9, 10];
// const pentaScale = [0, 2, 4, 7, 9];
// const minorScale = [0, 2, 3, 5, 7, 9, 10];

// const notes = {
//   a: 0,
//   s: 1,
//   d: 2,
//   f: 3,
//   g: 4,
//   h: 5,
//   j: 6,
//   k: 7,
//   l: 8,
// };

// const notesDown = {}

// window.addEventListener('keydown', e => {
//   if (e.key in notesDown)
//     return;
//   if (e.key in notes) {
//     e.preventDefault();
//     const cbs = [
//       synth.playNote(freqInScale(notes[e.key]-pentaScale.length, pentaScale)),
//       synth.playNote(freqInScale(notes[e.key]-pentaScale.length+3, pentaScale)),
//     ];
//     notesDown[e.key] = () => {
//       for (const note of cbs)
//         note();
//     };
//   }
// });

// window.addEventListener('keyup', e => {
//   const cb = notesDown[e.key];
//   if (cb) {
//     delete notesDown[e.key];
//     cb();
//   }
// });

class SidMode {
    
    constructor(modeName, synthType, notePattern = notes) {
        const ac = Tone.context.rawContext._nativeContext;
        // console.log(ac);
        this.modeName = modeName;
        
        this.notes = shuffle(notePattern);

        const filterChain = new FilterChain(ac);

        const synth = new Synth(ac);

        synth.node.connect(filterChain.in);
        filterChain.out.connect(ac.destination);

        let stop;

        this.synthType = synthType;
        this.synthObj = {
            triggerAttack(note){
                this.triggerRelease();
                stop = synth.playNote(Tone.Frequency(note));
            },

            triggerRelease(){
                if(stop){
                    stop();
                    stop = null;
                }
            }
        };
    }
}

export default SidMode;