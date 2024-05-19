const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let countnum = 0;
let pos = 1; //down = 0, up = 1
let color_code = "#FFFFFF";

function onResults(results) {
  if (!results.poseLandmarks) {
    return;
  }

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: color_code,
    lineWidth: point_width,
  });
  drawLandmarks(ctx, results.poseLandmarks, {
    color: "#FF0000",
    lineWidth: point_width / 2,
  });
  ctx.restore();
  countSquats(results, countnum);
}

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});
pose.setOptions({
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

function countSquats(results) {
  /* if (
    results.poseLandmarks[24][1] < results.poseLandmarks[26][1] ||
    results.poseLandmarks[23][1] < results.poseLandmarks[25][1]
  ) {
    count++;
  } */

  hip1_y = results.poseLandmarks[24].y;
  knee1_y = results.poseLandmarks[26].y;

  hip2_y = results.poseLandmarks[23].y;
  knee2_y = results.poseLandmarks[25].y;

  /* console.log(hip1_x);
  console.log(knee1_x);
  console.log(hip2_x);
  console.log(knee2_x); */

  //going down
  if (pos == 1 && (hip1_y > knee1_y || hip2_y > knee2_y)) {
    countnum++;
    //console.log(countnum, pos);
    //window.print(countnum);
    //results.poseLandmarks.color = "#00FF00";
    color_code = "#00FF00";
    document.getElementById("counter").innerHTML = countnum;
    pos = 0;
    return;
  }
  if (hip1_y < knee1_y && hip2_y < knee2_y) {
    //coming up
    color_code = "#FFFFFF";
    //results.poseLandmarks.color = "#FFFFFF";
    pos = 1;
    return;
  }
}
