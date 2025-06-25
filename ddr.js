import ArrowObject from "./ArrowObject.js";
import NoteObject from "./NoteObject.js";
import { yStartPos } from "./arrow-variables.js";
import { modes } from "./music-exports.js";

let keyCodes = [37, 40, 38, 39];

let keyMap = {};
let currentNote = "";
let currentMode = "";
let systemMessage = "";

window.setup = function () {
    // Add a click handler to start the audio
    document.body.addEventListener('click', () => {
        Tone.start();
        console.log('audio is ready');
    });

    const player = new Tone.Player("samples/ddrr-beat.wav").toDestination();
    player.autostart = true;
    player.loop = true;
    player.fadeIn = 2;
    player.fadeOut = 2;
    player.volume.value = -2;

    let p5Canvas = createCanvas(windowWidth + 1, windowHeight + 1, P2D);
    p5Canvas.id("ddr-canvas");
    imageMode(CENTER);
    ellipseMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont('Courier New');
    angleMode(DEGREES);
    // frameRate(60);

    const availableModes = shuffle([...modes]);

    for(let i = 0; i < keyCodes.length; i++) {

        let pickMode = availableModes[i];

        let arrow = new ArrowObject(i, pickMode.modeName);

        let notesArray = [];

        let prevNotePos = yStartPos;

        for(let j = 0; j < pickMode.notes.length; j++) {

            notesArray.push(new NoteObject(i, pickMode.modeName, pickMode.synthObj, pickMode.notes[j], prevNotePos));
            prevNotePos = notesArray[j].y;
        }

        keyMap[keyCodes[i]] = { arrow, notesArray };
    }

    setInterval(chooseNewModes, 45000);
}

window.draw = function () {
    console.log(millis());
    // if(frameCount % 15 == 0) {
    //     clear();
    // }
    fill(5, 30);
    rect(0, 0, width, height);

    blendMode(ADD);   
    
    // console.log(frameRate());

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

    if (systemMessage) {
        textSize(32);
        text(systemMessage, width / 2, height / 2 + 100);
        textSize(20);
    }

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
    systemMessage = "Choosing new modes...";

    setTimeout(() => {
        const shuffledModes = shuffle([...modes]);
        for(let i = 0; i < keyCodes.length; i++) {
            const keyCode = keyCodes[i];
            const { arrow, notesArray } = keyMap[keyCode];
            const newMode = shuffledModes[i];

            arrow.mode = newMode.modeName;
            
            notesArray.length = 0; // Clear existing notes
            let prevNotePos = yStartPos;

            for(let j = 0; j < newMode.notes.length; j++) {
                notesArray.push(new NoteObject(i, newMode.modeName, newMode.synthObj, newMode.notes[j], prevNotePos));
                prevNotePos = notesArray[j].y;
            }
        }
        systemMessage = "";
    }, 2000);
}