let video;
let poseNet;
let pose;
let skeleton;
let brain;
let poseLabel="Y";
let counter=0;
let poseLabel2="y";
let w1=window.innerWidth;
let w2=window.innerHeight;
let l1=100;
c1=680;
c2=480;
if(w1<w2) 
{l1=5;
c1=w1-10;
c2=w2-100;}
 function setup() {
 

  var canvas = createCanvas(c1,c2 );
  canvas.position(l1, 100);
  video=createCapture(VIDEO);
  video.hide();
  poseNet= ml5.poseNet(video,modelLoaded);
  poseNet.on('pose',gotPoses);

  let options={
    inputs:34,
    outputs:4,
    task:'classification',
    debug: true
  }
  brain=ml5.neuralNetwork(options);
const modelInfo={
  model:'model/model.json',
  metadata:'model/model_meta.json',
  weights:'model/model.weights.bin',
};
  brain.load(modelInfo,brainLoaded);
//  brain.loadData('pushup_xy.json',dataReady);
}

function brainLoaded(){
  console.log('pose classification ready');
 classifyPose();
}

function classifyPose(){
    if(pose){
      let inputs= [];
   for(let i=0;i<pose.keypoints.length;i++){
     let x=pose.keypoints[i].position.x;
     let y=pose.keypoints[i].position.y;
     inputs.push(x);
     inputs.push(y);
   
   }
  brain.classify(inputs, gotResult);
}
 else{
   setTimeout(classifyPose,100);
 }}

function gotResult(error, results){
   
 if (results[0].confidence > 0.95) {
       
    if(results[0].label=='y'){
      poseLabel="down";
      if(poseLabel==poseLabel2){
       if(parseInt(counter)<1){
        const utterance = new SpeechSynthesisUtterance("Ready to go........Do the Exercise.......Pushups,6")
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 1
        speechSynthesis.speak(utterance)
       }
        counter=counter+1;
      }
      poseLabel2="up";
    }
    else if(results[0].label=='x'){
      
      poseLabel="up";
     
      if(poseLabel==poseLabel2){
       
        counter=counter+1;
       const utterance = new SpeechSynthesisUtterance(parseInt(counter/2))
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 1
        speechSynthesis.speak(utterance)
       if(counter/2==4){
        const utterance = new SpeechSynthesisUtterance("two more to go")
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 1
        speechSynthesis.speak(utterance)
       }
        if(counter/2==5){
        const utterance = new SpeechSynthesisUtterance("one more to go")
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 1
        speechSynthesis.speak(utterance)
       }
        if(counter/2==6){
        const utterance = new SpeechSynthesisUtterance("Well Done")
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 1
        speechSynthesis.speak(utterance)
       }
      }
      poseLabel2="down";
    } 
  }
  classifyPose();
}

function gotPoses(poses){
  console.log(poses);
  if (poses.length>0){
    pose=poses[0].pose;
    skeleton=poses[0].skeleton;
   
}}

function modelLoaded(){
  console.log('posenet ready');
  
}

function draw() {
  push();
  
 // if(w1>w2){
    translate((video.width),0);
    scale(-1,1);
  //}
  //else{translate((video.width)*2,0);
 //  scale(-2,2);}
image(video,0,0,video.width,video.height);
   
 if(pose){
   
   
   for(let i=0;i<pose.keypoints.length;i++){
     let x=pose.keypoints[i].position.x;
     let y=pose.keypoints[i].position.y;
     fill(255);
     stroke(255);
     ellipse(x,y,16,16);
   }
   
   for(let i=0;i<skeleton.length;i++){
     let a=skeleton[i][0];
     let b=skeleton[i][1];
     strokeWeight(2);
     stroke(255);
     line(a.position.x,a.position.y,b.position.x,b.position.y);
   }
}
  pop();
fill(255);
noStroke();
textSize(100);
textAlign(CENTER,CENTER);
text(poseLabel,width/2,height/2);
text(parseInt(counter/2),width/2,height/6);
}
