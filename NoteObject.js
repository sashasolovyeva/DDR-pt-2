import * as arrowVars from "./arrow-variables.js";
import { noteToColorMap } from "./music-variables.js";
import ArrowObject from "./ArrowObject.js";

class NoteObject extends ArrowObject {
    constructor(arrowOrder, mode, synth, note, prevPos) {
        super(arrowOrder, mode);

        this.y = prevPos + arrowVars.arrowsSize + 100;
        this.speed = -7;

        this.note = note;
        this.synth = synth;

        const colorValues = noteToColorMap[this.note];
        this.noteColor = colorValues;

        this.moving = true;
    }

    show() {
        push();
            translate(this.x, this.y);
            noStroke();

            for (let r = this.size * 0.7; r > 0; r -= 12) {
                let alpha = map(r, this.size * 0.7, 0, 0, 25); 
                // let alpha = 255;
                fill(this.noteColor[0], this.noteColor[1], this.noteColor[2], alpha);  
                ellipse(0, 0, r, r * 1.3);     
            }

            // fill(255, 0, 0);
            // textSize(64);
            // text(this.note.charAt(0), 0, -100);

        pop();
    }



    move(lastArrayElem) {
        if(this.moving) {
            this.y += this.speed;

            if(this.y <= -110) {
                this.y = lastArrayElem.y + this.size + 100;
                return true;
            }

            return false;
        }
    }

    playSound(arrowObj) {
        if(this.x == arrowObj.x) {
            if(this.y >= arrowObj.y - arrowObj.size * .8 && this.y <= arrowObj.y + arrowObj.size * .8) {
                console.log(this.note);
                this.synth.triggerAttack(this.note);
                this.handleNoteChange();
                return true;
            }
        }

        return false;
    }

    handleNoteChange() {
        // this.size += 100;
    }

    stopSound() {
        this.synth.triggerRelease();
    }
}

export default NoteObject;