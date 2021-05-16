import { generateWidth } from "./helpers.js";

class Platform {
  static height = 150;
  static y = canvas.height - Platform.height;
  static redzone = 10;
  static speed = 40;
  constructor(x, width) {
    this.width = width;
    this.destinationX = x;
    this.x = canvas.width;
    this.delta = Math.abs(this.x - this.destinationX) / Platform.speed;
    this.center = this.width / 2 - Platform.redzone * 0.5;
  }
  draw(i) {
    ctx.fillStyle = "#000";
    ctx.fillRect(offsetX + this.x, Platform.y, this.width, Platform.height);
    if (i === 1) {
      ctx.save();
      ctx.translate(i * (offsetX + this.x), 0);
      ctx.fillStyle = "red";
      ctx.fillRect(this.center, Platform.y, Platform.redzone, Platform.redzone);
      ctx.restore();
    }
  }
  update(i) {
    if (this.x > this.originX) {
      this.x -= this.delta;
    }
    this.draw(i);
  }
}

export default class Terrain {
  static MIN_GAP = 30;
  constructor() {
    //initial platform
    this.platforms = [new Platform(0, 50)];
    this.draftedPlatform = null;
    this.draft();
    this.insert();
  }
  draft() {
    const width = generateWidth();
    const x = canvas.width;
    this.draftedPlatform = new Platform(x, width);
  }
  insert() {
    const { x: prevX, width: prevWidth } = this.platforms[0];
    const x =
      Math.random() * (canvas.width - width - prevWidth - MIN_GAP) +
      prevWidth +
      MIN_GAP;
    this.draftedPlatform.x = x;
    this.platforms.push(this.draftedPlatform);
    if (this.platforms.length >= 4) {
      this.unshift();
    }
    this.draft();
    const min_distance = Math.abs(prevX + prevWidth - x);
    const max_distance = min_distance + width;
    return [min_distance, max_distance];
  }
  unshift() {
    this.platforms.shift();
  }
}
