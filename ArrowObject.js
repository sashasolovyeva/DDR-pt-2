import * as arrowVars from "./arrow-variables.js";

class ArrowObject {

    constructor(arrowOrder, mode) {
        this.arrowOrder = arrowOrder;
        this.arrowCode = arrowVars.keyMap[this.arrowOrder];

        this.mode = mode;

        this.x = arrowVars.xInitPos + (-1.5 + this.arrowOrder) * arrowVars.arrowsSpacing;
        this.y = arrowVars.yStartPos;
        this.size = arrowVars.arrowsSize;

        let angles = [180, 90, -90, 0];
        this.angle = angles[this.arrowOrder];

        let arrowCodes = [LEFT_ARROW, DOWN_ARROW, UP_ARROW, RIGHT_ARROW];
        this.arrowCode = arrowCodes[this.arrowOrder];

        this.originalStroke = [255, 255, 255];
        this.stroke = this.originalStroke;
        this.color = false;
    }

    show() {
        arrowVars.drawArrow(this.x, this.y, this.angle, this.size, this.stroke, this.color);
        // push();
        //     translate(this.x, this.y);
        //     rotate(this.angle);
        //     arrowVars.getArrowImage().resize(this.size, 0);
        //     image(this.image, 0, 0);
        // pop();
    }

    changeColor(note) {
        this.color = note.noteColor;
        this.stroke = note.noteColor;
    }

    resetColor() {
        this.color = false;
        this.stroke = this.originalStroke;
    }
}

export default ArrowObject;