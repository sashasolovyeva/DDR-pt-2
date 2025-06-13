const xInitPos = window.innerWidth/2;
const yStartPos = window.innerHeight * .8;

const arrowsSize = 175;
const arrowsSpacing = arrowsSize + 75;

const keyMap = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'];

let arrowFile = null;

function drawArrow(x, y, angle, size, strokeCol, fillCol) {
  push();
  blendMode(BLEND);
  translate(x, y);
  rotate(angle);

  const strokeColor = strokeCol;

  const shaftWidth = size / 2.5;
  const headLength = size * 0.45;
  const headWidth = size * 0.875;
  const shaftLength = size - headLength;

  const halfShaftW = shaftWidth / 2;
  const halfHeadW = headWidth / 2;
  const halfTotalLength = size / 2;

  const shaftStart = -halfTotalLength;
  const shaftEnd = shaftStart + shaftLength;
  const tip = shaftStart + size;

  noFill();
  stroke(strokeColor[0], strokeColor[1], strokeColor[2]);
  strokeWeight(5);

  // Shaft outline
  line(shaftStart, -halfShaftW, shaftEnd, -halfShaftW);
  line(shaftStart,  halfShaftW, shaftEnd,  halfShaftW);

  // Connect shaft to triangle
  line(shaftEnd, -halfShaftW, shaftEnd, -halfHeadW);
  line(shaftEnd,  halfShaftW, shaftEnd,  halfHeadW);

  // Front triangle head (open base)
  line(shaftEnd, -halfHeadW, tip, 0);
  line(tip, 0, shaftEnd, halfHeadW);

  // Shaft end cap
  line(shaftStart, -halfShaftW, shaftStart, halfShaftW);

  if(fillCol) {
    noStroke();
    colorMode(RGB);
    fill(fillCol[0], fillCol[1], fillCol[2], 100);

    // Shaft filled
    rect(shaftStart, -halfShaftW, shaftLength, shaftWidth);

    // Triangle head filled
    beginShape();
      vertex(shaftEnd, -halfHeadW);
      vertex(tip, 0);
      vertex(shaftEnd, halfHeadW);
    endShape(CLOSE);
  }

  pop();
}

export { xInitPos, yStartPos, arrowsSize, arrowsSpacing, keyMap, drawArrow };