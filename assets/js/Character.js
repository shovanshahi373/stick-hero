import { RESULTS } from "./variables.js";

class Character {
  static HIGH_SCORE = 0;
  static FALL_RATE = 20;
  constructor(x, y, name = "player", color = "green") {
    this.name = name;
    this.height = 30;
    this.width = 20;
    this.y = y - this.height;
    this.color = color;
    this.x = x;
    this.baseX = this.x;
    this.walkdistance = 0;
    this.speed = 3;
    this.score = 0;
    this.walking = false;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update(checkers = {}) {
    if (checkers.walking) {
      if (this.x < this.baseX + checkers.max_distance) {
        this.x += this.speed;
      } else {
        checkers.walking = false;
      }
    }
    if (!checkers.walking && checkers.result === RESULTS.SUCCESS) {
      //slide the game view
      //update platforms
    } else if (!checkers.walking && checkers.result === RESULTS.FAIL) {
      //fall player
      this.y += Character.FALL_RATE;
      if (this.y > checkers.canvas.height) {
        //display game over!
      }
    }
  }
}

export default Character;
