const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");
const mpPose = window;

// Rep counter variables
let squatCount = 0;
let squatStarted = false; // Flag to track if squatting has started

// Adjust these constants based on your pose estimation results
const squatLandmark = 0; // Adjust this to the landmark index representing the squat position

function countSquatsAndOutputText(landmarks) {
  // Logic to count squats
  if (landmarks[squatLandmark].y < landmarks[squatLandmark + 1].y && !squatStarted) {
    // If squatting position detected and not already squatting
    squatStarted = true;
    squatCount++; // Increment squat count
    console.log("Squats:", squatCount);
    console.log("Ek baar baith ke uthenge toh count", squatCount);
  } else if (landmarks[squatLandmark].y >= landmarks[squatLandmark + 1].y && squatStarted) {
    // If standing up after squatting
    squatStarted = false; // Reset flag
    console.log("Then");
  }
}

function onResults(results) {
  if (!results.poseLandmarks) {
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.segmentationMask,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.globalCompositeOperation = "source-in";
  canvasCtx.fillStyle = "rgba(0,0,0,0)";
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = "destination-atop";
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.globalCompositeOperation = "source-over";

  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#5079A5",
    lineWidth: 4,
  });

  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: "#304153",
    lineWidth: 0,
  });

  canvasCtx.restore();

  try {
    const landmarks = results.poseLandmarks;

    countSquatsAndOutputText(landmarks);
  } catch (error) {
    console.log(error);
  }
}

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});

camera.start();
