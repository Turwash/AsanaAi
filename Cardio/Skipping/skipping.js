let video;
let poseNet;
let pose;
let counter=0;
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
  poseNet=ml5.poseNet(video,modelLoaded);
  poseNet.on('pose',gotPoses);
}
function gotPoses(poses){
  console.log('got poses');
  if(poses.length>0){
    pose=poses[0].pose;
  }
}
function modelLoaded(){
  console.log('posenet ready');
}
function draw() {
  
  push();
  translate(video.width,0);
  scale(-1,1);
  image(video,0,0,video.width,video.height);
  if (pose){
    let p1=pose.nose;
    let p2=pose.rightKnee;
    let d= dist(p1.x,p1.y,p2.x,p2.y);
    fill(255);
    ellipse(pose.nose.x,pose.nose.y,10);
    //ellipse(pose.rightKnee.x,pose.rightKnee.y,10);
    
    if(pose.rightKnee.y<480){
 if(pose.nose.y>100 && pose.rightKnee.y>100+d){
     stat=1;
      if(stat==stat2){
        counter=counter+1;
        const utterance = new SpeechSynthesisUtterance(parseInt(counter/2))
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 3
        speechSynthesis.speak(utterance)
      }
       stat2=0;
    
    }
    else if(pose.nose.y<100 && pose.rightKnee.y<100+d){
      
      stat=0;
      if(stat==stat2){
        counter=counter+1;
      }
       stat2=1;
    } }
    pop();
fill(255);
    line(100,100,500,100);    
    //line(100,100+d,500,100+d);
//noStroke();
textSize(100);
textAlign(CENTER);
    text(parseInt(counter/2),width/2,height/6);
}}
