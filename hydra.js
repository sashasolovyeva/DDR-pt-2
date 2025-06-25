// hydra.js
const hydraSketch = (p) => {
    let hydra;
    let hc;
    let ddrCanvas;

  p.setup = function () {
    // let canvas = p.createCanvas(window.innerWidth, window.innerHeight * 2, p.WEBGL);
    // canvas.id("hydra-canvas");
    // p.noStroke();
    console.log("hydra sketch!")
    
    // hydra setup
    let hydraCanvas = document.getElementById("hydraCanvas");
    hydraCanvas.width = windowWidth;
    hydraCanvas.height = windowHeight;
    hc = p.select("#hydraCanvas");
    ddrCanvas = document.getElementById("ddr-canvas");
    // hc.hide();
    // hydra = new Hydra({ canvas: hydraCanvas, detectAudio: false });
    // hydra.synth.s0.init({src: ddrCanvas });
    // hydra.synth.osc(40, .1, () => 3 * mouseX / windowWidth).rotate(.1, .1)
    // .blend(o0, .5)
    // // .blend()
    // .scale(() => 1 + 0.1 * (mouseY / windowHeight))
    // // .layer(hydra.synth.src(s0).luma().rotate(.1,.1).scrollX(.1,.1))
    // .kaleid()
    // .out();

    hydra = new Hydra({ canvas: hydraCanvas, detectAudio: false });
    hydra.synth.s0.init({src: ddrCanvas});
    hydra.synth.osc(20, .1, 1.5).diff(s0).rotate(.1, .1).scale(() => 1 + 0.1 * (mouseY / windowHeight)).kaleid().out();
  };

  p.draw = function () {
    // p.image(ddrCanvas, width/2, height/2)
    p.image(hc, width / 2, height / 2);
  }
}

new p5(hydraSketch);