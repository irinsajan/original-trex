var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImg;
var cloudImg;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5, obstacle6;
var score = 0;

var obstaclesGroup, cloudsGroup;

var gameOver, restart, gameOverImg, restartImg;

var jumpSound, dieSound, checkPointSound;


//loading all media files 
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImg = loadImage("ground2.png");
  
  cloudImg = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("dead.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(600,200);
  
  //creating trex
  trex = createSprite(50,180,40,60);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  /*
  //setting collider for trex
  trex.setCollider("circle",0,0,40);
  trex.debug = true;
  */
  
  //creating ground
  ground = createSprite(300,190,600,5);
  ground.addImage("ground",groundImg);
  ground.x = ground.width/2;
  
  //creating invisible ground
  invisibleGround = createSprite(300,198,600,5);
  invisibleGround.visible = false;  
  
  //creating groups of obstacles and clouds
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //creating game over and restart animations
  gameOver = createSprite(300,100);
  gameOver.addImage("end",gameOverImg);
  gameOver.scale = 0.5;
  restart = createSprite(300,140);
  restart.addImage("restart",restartImg);
  restart.scale = 0.5;
}

function draw(){
  background(180);
  
  text("Score: "+score,500,50);
  
  //adding game states PLAY and END
  if (gameState === PLAY){
    
    //keep the game over and restart animations invisible in PLAY
    gameOver.visible = false;
    restart.visible = false;
    
    //score using frame count
    score = score + Math.round(getFrameRate()/60);
    
    //adding sound at check point scores 100, 200, 300,...
    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }

    //making trex jump and add gravity
    //make it jump only if it's on ground
    if (keyDown("space") && trex.y>=172){
      trex.velocityY = -12;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 0.8;



    //moving and resetting ground
    //adjusting velocity with score to make the game challenging
    ground.velocityX = -(4 + 3*score/100);
    if (ground.x<0){
      ground.x = ground.width/2;
    } 

    //spawning clouds
    spawnClouds();

    //spawning obstacles
    spawnObstacles();
    
    //game ends when trex touches obstacle
    if (obstaclesGroup.isTouching(trex)) {
      dieSound.play();
      gameState = END;  
    }

  }
  
  else if (gameState === END) {
    //stopping all movement at END state
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //to make clouds and obstacles to stay on screen at END
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //make the game over animations visible
    gameOver.visible = true;
    restart.visible = true;
    
    //reset the game when restart icon is clicked
    if (mousePressedOver(restart)){
      reset();
    }
  }

    
  //place trex on ground
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}

function spawnClouds(){
  //making cloud only once in 60 frames
  if (frameCount % 60 === 0){
    //making cloud outside canvas and giving velocity
    var cloud = createSprite(600,100,40,20);
    cloud.addImage("cloud",cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -6;
    //spawning clouds at random heights
    cloud.y = Math.round(random(150,80));
    //adjusting depth to put trex infront of cloud on display
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //give lifetime to avoid memory leak
    cloud.lifetime = 100;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  //making obstacle only once in 100 frames
  if (frameCount % 100 === 0){
    //making obstacle outside canvas and giving velocity
    var obstacle = createSprite(600,175,30,50);
    //adding animations randomly using switch statement
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }
    obstacle.scale = 0.5;
    //adjusting velocity with score to make the game challenging
    obstacle.velocityX = -(6 + score/100);    
    //give lifetime to avoid memory leak
    obstacle.lifetime = 100;
    obstaclesGroup.add(obstacle);
  }
}
