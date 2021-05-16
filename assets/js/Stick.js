import { STICK_STATES } from "./variables.js";

class Stick {
  constructor() {
    this.height = 0;
    this.width = 3;
    this.growthRate = 4;
    this.falling = false;
    this.angle = 0;
    this.fillRate = Math.PI / 2 / 100;
    this.state = STICK_STATES.ERECT;
  }
  updateHeight() {
    this.height += this.growthRate;
  }
  reset() {
    this.height = 0;
  }
  update(ctx) {
    ctx.fillStyle = "#000";
    if (this.state === STICK_STATES.FALLING) {
      ctx.save();
      ctx.translate(
        platforms[0].width - this.width / 2,
        PLATFORM_OFFSET_Y - this.width / 2
      );
      ctx.scale(1, -1);
      ctx.rotate(-this.angle);
      if (this.angle < Math.PI / 2) {
        this.angle += 5 * this.fillRate;
      } else {
        // this.state = STICK_STATES.FALLEN;
        if (!walking) {
          const success =
            this.height > min_distance && this.height < max_distance;
          if (success) {
            result = RESULTS.SUCCESS;
            player.walkdistance = max_distance - player.width * 2;
          } else {
            result = RESULTS.FAIL;
            player.walkDistance = this.height + player.width * 2;
          }
          walking = true;
        }
      }
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    } else if (this.state === STICK_STATES.ERECT) {
      ctx.fillRect(
        platforms[0].width - this.width / 2,
        PLATFORM_OFFSET_Y - this.height,
        this.width,
        this.height
      );
    }
    if (clicking) {
      this.updateHeight();
    }
  }
  draw(x, y, ctx) {
    ctx.fillRect(x, y, this.width, this.height);
  }
}

export default Stick;
