import { BACKGROUNDS } from "./variables.js";

const getBackground = () =>
  BACKGROUNDS[(Math.random() * BACKGROUNDS.length) | 0];

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.background = getBackground();
    this.platforms = [];
  }
  rotate(ctx, x) {
    const delta = x / 10;
    const amt = 0;
    if (amt > x) {
      amt += delta;
      ctx.save();
      ctx.translate(-amt, 0);
      //drawothershits
    }
  }
}
