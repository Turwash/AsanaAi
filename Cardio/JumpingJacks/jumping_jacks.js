let video;
let poseNet;
let pose;
let skeleton;
let brain;
let poseLabel="..";
let counter=0;
let poseLabel2="y";
let stat=1;
let stat2=0;
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
  model:'model5/model.json',
  metadata:'model5/model_meta.json',
  weights:'model5/model.weights.bin',
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
  
 if (results[0].confidence > 0.8) {
   if(pose.rightKnee.y<480){
   if((pose.leftKnee.x-pose.rightKnee.x)<30){
      if(pose.rightWrist.y>pose.rightHip.y-40 && pose.leftWrist.y>pose.leftHip.y-40){
      poseLabel="down";
      if(poseLabel==poseLabel2){
        counter=counter+1;
        const utterance = new SpeechSynthesisUtterance(parseInt(counter/4))
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 1
        speechSynthesis.speak(utterance)
      }
      poseLabel2="up";
   }}  
    else if((pose.leftKnee.x-pose.rightKnee.x)>30){
      if(pose.rightWrist.y<pose.rightShoulder.y && pose.leftWrist.y<pose.leftShoulder.y){
        poseLabel="up";
      if(poseLabel==poseLabel2){
        counter=counter+1;
            counter=counter+1;
        const utterance = new SpeechSynthesisUtterance(parseInt(counter/4))
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 1
        speechSynthesis.speak(utterance)
      }
      poseLabel2="down";
    } }
  else{poseLabel="..";}
 }
else{poseLabel="..";} }
  
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
  translate(video.width,0);
  scale(-1,1);
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
   let p1=pose.nose;
    let p2=pose.rightKnee;
    let d= dist(p1.x,p1.y,p2.x,p2.y);
    fill(255);
    ellipse(pose.nose.x,pose.nose.y,10);
    //ellipse(pose.rightKnee.x,pose.rightKnee.y,10);
    
    if(pose.rightKnee.y<480){
 if(pose.nose.y>50 && pose.rightKnee.y>50+d){
     stat=1;
      if(stat==stat2){
        counter=counter+1;
      }
       stat2=0;
    }
    else if(pose.nose.y<50 && pose.rightKnee.y<50+d){
      stat=0;
      if(stat==stat2){
        counter=counter+1;
      }
       stat2=1;
    } 
}}
  pop();
fill(255);
line(100,50,400,50);
  //line(100,180,400,180);
   //line(100,300,400,300);
textSize(100);
textAlign(CENTER,CENTER);
text(poseLabel,width/2,height/2);
text(parseInt(counter/4),width/2,height/6);
}
