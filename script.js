const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// import Terrain from "./assets/js/Platform.js";

const platforms = [];
const sticks = [];
let clicking = false;
let walking = false;
let min_distance;
let max_distance;
let result;
let offsetX = 0;
let distanceX;
let delta;
let transitioning = false;
// let amount = 0;

const setDimension = () => {
  if (innerWidth > innerHeight) {
    canvas.width = 0.5 * innerWidth;
    canvas.height = 0.9 * innerHeight;
  } else {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
};

setDimension();

const PLATFORM_HEIGHT = 150;
const PLATFORM_OFFSET_Y = canvas.height - PLATFORM_HEIGHT;

const generateWidth = () => (Math.random() * 50 + 30) | 0;

class Character {
  static HIGH_SCORE = 0;
  static FALL_RATE = 20;
  constructor(name = "player", color = "green") {
    this.name = name;
    this.height = 30;
    this.width = 20;
    this.y = PLATFORM_OFFSET_Y - this.height;
    this.color = color;
    this.x = this.initialPosition();
    this.baseX = this.x;
    this.walkdistance = 0;
    this.speed = 3;
    this.cherry = 0;
    this.score = 0;
    this.walking = false;
  }
  initialPosition() {
    this.x = platforms[0].width - this.width * 2;
    this.baseX = this.x;
  }
  update() {}
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(offsetX + this.x, this.y, this.width, this.height);
    if (walking) {
      // if (this.x < this.baseX + max_distance) {
      if (this.x < this.baseX + this.walkdistance) {
        console.log("dafuq");
        this.x += this.speed;
      } else {
        walking = false;
        transitioning = true;
        setTimeout(() => {
          createNewPlatform();
        }, 4000);
      }
    }
    if (!walking && result === RESULTS.SUCCESS) {
      this.x -= delta;
      // if (this.x <= 0) {
      //   this.x = platforms.slice(-1).pop().width - this.width;
      // }
    } else if (!walking && result === RESULTS.FAIL) {
      //
      this.y += Character.FALL_RATE;

      if (this.y > canvas.height) {
        //display game over!
      }
    }
  }
}

const createNewPlatform = () => {
  const width = generateWidth();
  // const { width: prevWidth, x: prevX } = platforms[0];
  const { width: prevWidth, x: prevX } = platforms.slice(-1).pop();
  const x =
    Math.random() * (canvas.width - width - prevWidth - MIN_GAP) +
    prevWidth +
    MIN_GAP;
  min_distance = Math.abs(prevX + prevWidth - x);
  max_distance = min_distance + width;
  platforms.push(new Platform(x, width));
};

class Platform {
  static y = PLATFORM_OFFSET_Y;
  static height = PLATFORM_HEIGHT;
  static redzone = 10;
  static speed = 40;
  constructor(destinationX, width, initialX = canvas.width) {
    this.width = width;
    this.destinationX = destinationX;
    this.x = initialX;
    this.knockoff = false;
    this.delta = (this.x - this.destinationX) / Platform.speed;
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
  update() {
    if (!walking && result === RESULTS.SUCCESS && !this.knockoff) {
      // distanceX = platforms.slice(-1).pop().x;
      // delta = distanceX / 10;
      if (this.x + this.width >= 0) {
        this.x -= delta;
      } else {
        // platforms.shift();
        // if (platforms.length === 1 && !this.knockoff) {
        //   createNewPlatform();
        // }
        this.knockoff = true;
        // createNewPlatform();
        // result = RESULTS.PENDING;
      }
    }
    if (this.x > this.destinationX) {
      this.x -= this.delta;
    }
  }
}

const STICK_STATES = {
  ERECT: "erect",
  FALLING: "falling",
  FALLEN: "fallen",
};

const RESULTS = {
  SUCCESS: "success",
  FAIL: "fail",
  PENDING: "pending",
};

Object.freeze(STICK_STATES);
Object.freeze(RESULTS);

class Stick {
  constructor(x, y, width = 3, height = 0) {
    this.height = height;
    this.width = width;
    this.growthRate = 4;
    // this.falling = false;
    this.angle = 0;
    this.fillRate = Math.PI / 2 / 100;
    this.state = STICK_STATES.ERECT;
  }
  updateHeight() {
    this.height += this.growthRate;
  }
  reset() {
    this.height = 0;
    this.angle = 0;
    this.state = STICK_STATES.ERECT;
  }
  // update() {}
  draw() {
    ctx.fillStyle = "#000";
    if (this.state === STICK_STATES.FALLING) {
      ctx.save();
      ctx.translate(
        offsetX + platforms[0].width - this.width / 2,
        PLATFORM_OFFSET_Y - this.width / 2
      );
      ctx.scale(1, -1);
      ctx.rotate(-this.angle);
      if (this.angle < Math.PI / 2) {
        this.angle += 5 * this.fillRate;
      } else {
        //stick completes fall then...
        const i = sticks.length;
        const baseX = platforms[0].width;
        // const baseX = platforms.slice(-1).pop().width;
        sticks.push({
          height: this.width,
          width: this.height,
          x: baseX - this.width / 2,
          y: PLATFORM_OFFSET_Y - this.width / 2,
        });
        const success =
          this.height > min_distance && this.height < max_distance;
        if (success) {
          result = RESULTS.SUCCESS;
          // player.walkdistance = this.height + player.width;
          const { x, width } = platforms.slice(-1).pop();
          player.walkdistance = x + width - player.x - player.width;
        } else {
          result = RESULTS.FAIL;
          player.walkdistance = this.height + player.width * 2;
        }
        walking = true;
        this.reset();
      }
      ctx.fillRect(offsetX + 0, 0, this.width, this.height);
      ctx.restore();
    } else if (this.state === STICK_STATES.ERECT) {
      ctx.fillRect(
        // offsetX + platforms[0].width - this.width / 2,
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
}

const stick = new Stick();

platforms.push(new Platform(0, 50, 0));
const MIN_GAP = 30;

createNewPlatform();

const success = () => {};
const failed = () => {};

const player = new Character();
player.initialPosition();

window.addEventListener("resize", setDimension);

document.addEventListener("mousedown", () => {
  console.log("mouse clicking");
  clicking = true;
});
document.addEventListener("mouseup", () => {
  console.log("mouse released");
  clicking = false;
  stick.state = STICK_STATES.FALLING;
  player.walking = true;
  // if (platforms.length) {
  //   createNewPlatform();
  // }
});

const walk = () => {};
let amount = 0;

const update = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  distanceX = platforms.slice(-1).pop().x;
  // distanceX = 20;
  delta = distanceX / 10;
  // delta = distanceX / 100;
  // delta = 1;
  platforms.forEach((platform, i) => {
    platform.draw(i);
    platform.update();
  });
  player.draw();
  !!sticks.length &&
    sticks.forEach((stick) => {
      ctx.fillStyle = "#000";
      if (!walking && result === RESULTS.SUCCESS) {
        if (stick.x + stick.width >= 0) {
          stick.x -= delta;
        }
      }
      // ctx.fillRect(offsetX + stick.x, stick.y, stick.width, stick.height);
      ctx.fillRect(stick.x, stick.y, stick.width, stick.height);
    });
  stick.draw();
  requestAnimationFrame(update);
};

update();
