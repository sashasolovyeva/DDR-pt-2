// disco.js
const discoSketch = (p) => {
  let angle = 0;
  let coloredLights = [];

  p.setup = function () {
    let canvas = p.createCanvas(window.innerWidth, window.innerHeight * 2, p.WEBGL);
    canvas.id("disco-canvas");
    p.noStroke();
    // p.colorMode(p.HSL);
    p.frameRate(30);
  };

  p.draw = function () {
    // p.background(5);
    p.rotateY(angle);
    p.rotateX(p.HALF_PI);
    angle += 0.01;

    p.ambientLight(50);
    p.directionalLight(255, 255, 255, -1, -1, -1);

    for (let light of coloredLights) {
      let t = p.frameCount * 0.02 + light.offset;
      let x = p.sin(t * 1.1) * 650;
      let y = p.cos(t * 0.9) * 650;
      let z = p.cos(t * 1.3) * 550;
      p.pointLight(light.r, light.g, light.b, x, y, z);
    }

    if(coloredLights.length >= 5) {
        coloredLights.splice(0, 1);
    }

    const radius = 300;

    p.ambientMaterial(0);
    // p.sphere(radius - 1, 24, 24);

    p.specularMaterial(255);
    p.shininess(300);

    const bands = 48;
    const maxFacets = 96;

    for (let j = 0; j <= bands; j++) {
      let normalizedBand = (j / bands) * p.PI - p.HALF_PI;
      let interpolatedValue = p.sin(normalizedBand + p.HALF_PI);
      let facets = p.floor(interpolatedValue * maxFacets);

      for (let i = 0; i < facets; i++) {
        let lon = (i / facets) * p.TWO_PI;
        let lat = (j / bands) * p.PI - p.HALF_PI;
        let x = radius * p.cos(lat) * p.cos(lon);
        let y = radius * p.cos(lat) * p.sin(lon);
        let z = radius * p.sin(lat);
        p.push();
        p.translate(x, y, z);
        p.rotateZ(lon);
        p.rotateY(p.HALF_PI - lat);
        p.plane(radius / 16, radius / 16);
        p.pop();
      }
    }
  };

  // Expose light trigger so DDR can talk to disco
  window.triggerDiscoLight = function (color) {
    let r = color[0];
    let g = color[1];
    let b = color[2];
    let offset = -p.frameCount * 0.02;
    coloredLights.push({ r, g, b, offset });
  };

};

new p5(discoSketch);