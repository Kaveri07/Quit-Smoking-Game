var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trexImage;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score, restartImage, gameOverImage, restart, gameOver, jumpSound, checkPointSound, dieSound;

function preload(){

  trexImage = loadImage("heart.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  
  checkPointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,100,20,50);
  trex.addImage(trexImage);
  trex.scale = 0.15;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(150,185,400,10);
  invisibleGround.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  restart = createSprite(300,100,10,10);
  restart.addImage("restart",restartImage)
  restart.scale = 0.75;
  
  gameOver = createSprite(300,55,10,10);
  gameOver.scale = 0.5;
  gameOver.addImage("gameOver",gameOverImage);
  
  score = 0;
}

function draw() {
  background(180);
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
    
    //move the ground
    ground.velocityX = -4;
    
    //score
    score=Math.round(score+0.5);
    
    //space pressed & gravity
    if(keyDown("space")&& trex.y >= 100) {
    trex.velocityY = -10;
    jumpSound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8
    
    //looping ground
    if (ground.x < 0){
    ground.x = ground.width/2;
    }
    
    //spawn the clouds
    spawnClouds();
    
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(trex.isTouching(obstaclesGroup)) {
      trex.scale = trex.scale - 0.0017;
    }

    //switching game state
    if(trex.scale <= 0.05) {
      trex.scale = 0;
      dieSound.play();
      gameState = END;
    }
    
    restart.visible = false;
    gameOver.visible = false;
    
    if(score%100===0 && score>0) {
      checkPointSound.play();
    }
    
  }
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    
    //stopping trex
    
    //obstacle stopping
    obstaclesGroup.setVelocityXEach(0);
    
    //clouds stopping
    cloudsGroup.setVelocityXEach(0);
    
    //making clouds and ob. stay
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    trex.velocityY = 0;
    
    restart.visible = true;
    gameOver.visible = true;
    
    if(mousePressedOver(restart)) {
      gameState="end";
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
      score = 0;
    }
  }

    trex.collide(invisibleGround);
    drawSprites();

    if(gameState === "end") {
      background("black");
      gameOver.remove();
      restart.remove();
      trex.remove();
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
      textSize(25);
      textFont("georgia");
      strokeWeight(5);
      stroke(random(0,255),random(0,50),random(0,255));
      fill(255);
      push();
      textAlign(CENTER);
      text("ERROR. There is no reset button.",300,50);
      text("In life, one chance is all you get.",300,100);
      text("You can't reverse the effects of smoking.",300,150);
      pop();
    }
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(score/100+6);
   
    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.15;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.25;
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 0.15;
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale = 0.12;
              break;
      case 5: obstacle.addImage(obstacle6);
              obstacle.scale = 0.1;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = random(0.2,0.7);
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
}