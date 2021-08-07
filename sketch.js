var PLAY = 1;
var END = 0;
var PAUSE = 2
var holdscore = 0
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var gameOver, restart;
function preload() {
  trex_still = loadAnimation("Images/trex1.png");
  trex_running = loadAnimation("Images/trex1.png", "Images/trex3.png", "Images/trex4.png");
  trex_collided = loadAnimation("Images/trex_collided.png");
  groundImage = loadImage("Images/ground2.png");
  cloudImage = loadImage("Images/cloud.png");
  obstacle1 = loadImage("Images/obstacle1.png");
  obstacle2 = loadImage("Images/obstacle2.png");
  obstacle3 = loadImage("Images/obstacle3.png");
  obstacle4 = loadImage("Images/obstacle4.png");
  obstacle5 = loadImage("Images/obstacle5.png");
  obstacle6 = loadImage("Images/obstacle6.png");
  gameOverImg = loadImage("Images/gameOver.jpg");
  restartImg = loadImage("Images/restart.png");
  pauseimg = loadImage("Images/pause.png")
  trex_paused = loadAnimation("images/trex1.png")
  playimg = loadImage("images/play.jpg")
}

function setup() {

  createCanvas(displayWidth-20, displayHeight-300);

  trex = createSprite(100, displayHeight/2+50, 20, 50);

  trex.setCollider("circle",0,0,27);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(displayWidth/2, displayHeight/2+50, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100);

  gameOver = createSprite(displayWidth/2, displayHeight/2-90);
  gameOver.addImage(gameOverImg);

  restart = createSprite(displayWidth/2, displayHeight/2-60);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;
  pause = createSprite(50,50)
  pause.scale = 0.05
  pause.addImage("pause",pauseimg)
  pause.addImage("play",playimg)
  gameOver.visible = false;
  restart.visible = false;
  
  

  invisibleGround = createSprite(200, displayHeight/2+50, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {

  console.log(displayHeight);
  //trex.debug = true;
  fill(1);
  background(188, 223, 224);
  
  
  textSize(18);
  text("Score: " + score, displayWidth-170, displayHeight/2-140);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);

    if (keyDown("space") && trex.y >= 410) {
      trex.velocityY = -10;
    }
        
    if(keyDown("UP_ARROW") && trex.y >= 410) {
      trex.velocityY = -10
    }

    trex.velocityY = trex.velocityY + 0.5

    if (ground.x < 1) {
      ground.x = ground.width / 2;
    }

    camera.position.x=displayWidth/2;
    if(mousePressedOver(pause)){
      gameState = PAUSE
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  if (gameState === PAUSE){
    trex.velocityY = 0
    ground.velocityX = 0
    cloudsGroup.setVelocityXEach (0)
    obstaclesGroup.setVelocityXEach(0)
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    score = 0 
    score = holdscore 
    pause.addImage("play",playimg)
    if (mousePressedOver === PAUSE){
      gameState = PLAY
      pause.addImage("pause",pause)
    }


  }


  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.x = Math.round(random(900,400))
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth, displayHeight/2+35, 10, 40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
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

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.45;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  score = 0

}
