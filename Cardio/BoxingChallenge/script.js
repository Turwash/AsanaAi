const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const controlsElement = document.getElementsByClassName("control-panel")[0];
const controls = window;

let countnum = 0;
let pos = 1; //left_of_box = 0, right_of_box = 1
let color_code = "#FFFFFF";

let box_pos_x = 60;
let box_pos_y = 75;

let hand_left_x;
let hand_left_y;
let hand_right_x;
let hand_right_y;

let hand_left_x_last_pos = 0;
let hand_left_y_last_pos = 0;
let hand_right_y_last_pos = 0;
let hand_right_x_last_pos = 0;

let position_array_left = [];
let position_array_right = [];

let speed_l_x = 0;
let speed_r_x = 0;

let Hcount = 0;
let speed = 0;

let dist_hand_left_x = 0;
let dist_hand_right_x = 0;

let colorb = "red";
let cur_fps = 1;

const fpsControl = new window.FPS();

function onResults(results) {
  if (!results.poseLandmarks) {
    return;
  }

  fpsControl.tick();
  cur_fps = document.getElementsByClassName("fps-text")[0].innerHTML;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS.slice(10), {
    color: color_code,
    lineWidth: point_width,
  });
  drawLandmarks(ctx, results.poseLandmarks.slice(11), {
    color: "#FF0000",
    lineWidth: point_width / 2,
  });

  for (let i = 0; i < 10; i++) {
    results.poseLandmarks[i].visibility = 0.0;
  }

  hand_left_x = results.poseLandmarks[18].x;
  hand_left_y = results.poseLandmarks[18].y;
  hand_left_x_2 = results.poseLandmarks[20].x;
  hand_left_y_2 = results.poseLandmarks[20].y;
  hand_left_x_3 = results.poseLandmarks[22].x;
  hand_left_y_3 = results.poseLandmarks[22].y;

  hand_right_x = results.poseLandmarks[17].x;
  hand_right_y = results.poseLandmarks[17].y;
  hand_right_x_2 = results.poseLandmarks[19].x;
  hand_right_y_2 = results.poseLandmarks[19].y;
  hand_right_x_3 = results.poseLandmarks[21].x;
  hand_right_y_3 = results.poseLandmarks[21].y;

  hitCount();
  ctx.restore();
}

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});
pose.setOptions({
  selfieMode: true,
  modelComplexity: 1,
  enableSegmentation: false,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
pose.onResults(onResults);

const camera = new Camera(video, {
  onFrame: async () => {
    await pose.send({ image: video });
    document.querySelector("h1").style.display = "none";
  },
  width: width,
  height: height,
});
camera.start();

var myGamePiece;

function startGame() {
  myGamePiece = new component(57, 57, colorb, 60, 60);
  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  stop: function () {
    clearInterval(this.interval);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 3;
  this.gravity = 1;
  this.gravitySpeed = 1;
  this.bounce = 1;
  this.update = function () {
    ctx2 = myGameArea.context;
    ctx2.fillStyle = colorb;
    ctx2.fillRect(this.x, this.y, this.width, this.height);
  };
  this.newPos = function () {
    this.gravitySpeed += this.gravity;

    cur_fps = document
      .getElementsByClassName("fps-text")[0]
      .innerHTML.replace(/[^\d.]/g, "");
    console.log("CURRENT FPS :", cur_fps);

    this.speedY = cur_fps * 0.3;
    console.log("CURRENT SPEED: ", this.speedY);

    this.x += this.speedX;
    this.y += this.speedY;

    box_pos_x = this.x;
    box_pos_y = this.y;

    this.hitBottom();
  };
  this.hitBottom = function () {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = y;
      this.gravitySpeed = -this.gravitySpeed;
      //cur_fps = -cur_fps;
      //this.speedY = -cur_fps * 0.5;
    }

    if (this.y < y) {
      this.speedY = -this.speedY;
    }
  };
}

function updateGameArea() {
  myGameArea.clear();
  myGamePiece.newPos();
  myGamePiece.update();
}

function hitCount() {
  /* document.getElementById("box_x").innerHTML = (box_pos_x / 480).toFixed(2);
  document.getElementById("box_y").innerHTML = (box_pos_y / 446).toFixed(1); */
  /* document.getElementById("hand_ly").innerHTML = hand_left_y.toFixed(1);
  document.getElementById("hand_lx").innerHTML = hand_left_x.toFixed(1);
  document.getElementById("hand_ry").innerHTML = hand_right_y.toFixed(1);
  document.getElementById("hand_rx").innerHTML = hand_right_x.toFixed(1); */
  /* document.getElementById("speed_l").innerHTML = speed_l_x.toFixed(1);
  document.getElementById("speed_r").innerHTML = speed_r_x.toFixed(1); */

  //SPEED CALCULATION
  /* dist_hand_left_x = hand_left_x_last_pos - hand_left_x;
  dist_hand_right_x = hand_right_x_last_pos - hand_right_x; */
  position_array_left.push(hand_left_x_last_pos);
  position_array_right.push(hand_right_x_last_pos);

  cur_fps = document
    .getElementsByClassName("fps-text")[0]
    .innerHTML.replace(/[^\d.]/g, "");
  speed_l_x =
    (position_array_left[position_array_left.length - 5] -
      position_array_left[position_array_left.length - 1]) *
    (1 / cur_fps) *
    20;
  speed_r_x =
    (position_array_right[position_array_right.length - 5] -
      position_array_right[position_array_right.length - 1]) *
    (1 / cur_fps) *
    20;

  /* document.getElementById("right_hand_speed").innerHTML = speed_l_x.toFixed(1);
  document.getElementById("left_hand_speed").innerHTML = speed_r_x.toFixed(1); */

  //MESSAGE DISPLAY
  /* if (speed_l_x < 0.1 && speed_r_x < 0.1) {
    document.getElementById("message").innerHTML = "Punch Harder";
  } else if (speed_l_x > 0.1 || speed_r_x > 0.1) {
    document.getElementById("message").innerHTML = "Punch Speed is good";
  } */

  //LAST HAND POSITION
  hand_left_x_last_pos = hand_left_x.toFixed(1);
  hand_left_y_last_pos = hand_left_y.toFixed(1);
  hand_right_x_last_pos = hand_right_x.toFixed(1);
  hand_right_y_last_pos = hand_right_y.toFixed(1);

  //HITBOX CONDITION
  hit_box_range_check();
}

function hit_box_range_check() {
  let bos_pos_a = 0.1;
  let bos_pos_b = 0.2;
  let bos_pos_c = (box_pos_y / 445).toFixed(1);
  let bos_pos_d = (box_pos_y / 445 + 0.1).toFixed(1);

  /* document.getElementById("box_pos_a").innerHTML = bos_pos_a;
  document.getElementById("box_pos_b").innerHTML = bos_pos_b;
  document.getElementById("box_pos_c").innerHTML = bos_pos_c;
  document.getElementById("box_pos_d").innerHTML = bos_pos_d; */

  document.getElementById("hand_speed_l").innerHTML = speed_l_x.toFixed(1);
  document.getElementById("hand_speed_r").innerHTML = speed_r_x.toFixed(1);

  if (hand_right_x >= 0.3 && hand_left_x >= 0.3) {
    pos = 1;
  }

  if (
    ((hand_left_x < bos_pos_b &&
      hand_left_x > bos_pos_a &&
      hand_left_y > bos_pos_c &&
      hand_left_y < bos_pos_d &&
      speed_l_x > 0.1) ||
      (hand_right_x < bos_pos_b &&
        hand_right_x > bos_pos_a &&
        hand_right_y > bos_pos_c &&
        hand_right_y < bos_pos_d &&
        speed_r_x > 0.1) ||
      (hand_left_x_2 < bos_pos_b &&
        hand_left_x_2 > bos_pos_a &&
        hand_left_y_2 > bos_pos_c &&
        hand_left_y_2 < bos_pos_d &&
        speed_l_x > 0.1) ||
      (hand_right_x_2 < bos_pos_b &&
        hand_right_x_2 > bos_pos_a &&
        hand_right_y_2 > bos_pos_c &&
        hand_right_y_2 < bos_pos_d &&
        speed_r_x > 0.1) ||
      (hand_left_x_3 < bos_pos_b &&
        hand_left_x_3 > bos_pos_a &&
        hand_left_y_3 > bos_pos_c &&
        hand_left_y_3 < bos_pos_d &&
        speed_l_x > 0.1) ||
      (hand_right_x_3 < bos_pos_b &&
        hand_right_x_3 > bos_pos_a &&
        hand_right_y_3 > bos_pos_c &&
        hand_right_y_3 < bos_pos_d &&
        speed_r_x > 0.1)) &&
    pos == 1
  ) {
    Hcount++;
    document.getElementById("counter").innerHTML = Hcount;
    pos = 0;

    //HITBOX COLOR CHANGE
    if (Hcount % 2 == 0) {
      colorb = "red";
    } else {
      colorb = "green";
    }
    speed = speed + 0.1;
  }
}

new window.ControlPanel(controlsElement, {
  selfieMode: true,
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  effect: "background",
}).add([fpsControl]);
