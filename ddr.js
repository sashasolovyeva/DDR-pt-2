import ArrowObject from "./ArrowObject.js";
import NoteObject from "./NoteObject.js";
import { yStartPos } from "./arrow-variables.js";
import { modes } from "./music-exports.js";

let arrowsArray = [];

let keyCodes = [37, 40, 38, 39];

let keyMap = {};
let currentNote = "";
let currentMode = "";

let hydra;
let hc;
let osc = [];

window.setup = function () {
    let p5Canvas = createCanvas(windowWidth + 1, windowHeight + 1, P2D);
    p5Canvas.id("ddr-canvas");
    imageMode(CENTER);
    ellipseMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(16);
    textFont('Courier New');
    angleMode(DEGREES);
    // frameRate(60);

    // hydra setup
    let hydraCanvas = document.getElementById("hydraCanvas");
    hydraCanvas.width = windowWidth;
    hydraCanvas.height = windowHeight;
    hc = select("#hydraCanvas");
    hc.hide();
    hydra = new Hydra({ canvas: hydraCanvas, detectAudio: false });
    hydra.synth.s0.init({src: p5Canvas.canvas});
    hydra.synth.osc(10, .1, () => 3 * mouseX / windowWidth).diff(s0).rotate(.1, .1).scale(() => 1 + 0.1 * (mouseY / windowHeight)).kaleid().out();

    for(let i = 0; i < keyCodes.length; i++) {

        let pickMode = random(modes);

        let arrow = new ArrowObject(i, pickMode.modeName);

        let notesArray = [];

        let prevNotePos = yStartPos;

        for(let j = 0; j < pickMode.notes.length; j++) {

            notesArray.push(new NoteObject(i, pickMode.modeName, pickMode.synthObj, pickMode.notes[j], prevNotePos));
            prevNotePos = notesArray[j].y;
        }

        keyMap[keyCodes[i]] = { arrow, notesArray };
    }
}

window.draw = function () {

    // image(hc, width / 2, height / 2);

    noStroke();
    fill(5, 30);
    rect(0, 0, width, height);

    blendMode(ADD);   
    
    console.log(frameRate())

    for (let i = 0; i < keyCodes.length; i++) {
        let currentArray = keyMap[keyCodes[i]].notesArray;

        for (let j = 0; j < currentArray.length; j++) {
            currentArray[j].show();

            if (currentArray[j].move(currentArray[currentArray.length - 1])) {
                const recycled = currentArray.splice(j, 1)[0];
                currentArray.push(recycled);
                j--;
            }
        }

        keyMap[keyCodes[i]].arrow.show();
    }

    fill(255);
    text("Note Played: " + currentNote, width-150, 100);
    text("Mode Played: " + currentMode, width-150, 150);

    blendMode(BLEND);
}

window.keyPressed = function() {
    if (keyMap[keyCode]) {
        let arrow = keyMap[keyCode].arrow;
        let notes = keyMap[keyCode].notesArray;

        for (let note of notes) {
            note.moving = false;
            currentNote = note.note.charAt(0);
            currentMode = note.mode;
        }

        for (let note of notes) {
            if (note.playSound(arrow)) {
                arrow.changeColor(note);

                if (typeof window.triggerDiscoLight === "function") {
                    window.triggerDiscoLight(note.noteColor);
                }

                break;
            }
        }
    }
}

window.keyReleased = function() {
    if (keyMap[keyCode]) {
        let arrow = keyMap[keyCode].arrow;
        let notes = keyMap[keyCode].notesArray;

        arrow.resetColor();

        for (let note of notes) {
            note.moving = true;
            note.stopSound();
        }
    }
}

function chooseNewModes () {

    if(arrowsArray && arrowsArray.length != 0) {
        for(let i = 0; i < 4; i++) {
            arrowsArray[i].mode = random(modes);
        }
    }
}