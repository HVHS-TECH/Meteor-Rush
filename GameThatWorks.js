/*******************************************************/
// Game Constants
/*******************************************************/
const GAMEWIDTH = window.innerWidth;
const GAMEHEIGHT = window.innerHeight;

const PLAYERSIZE = 20;
const PLAYERMOVEMENT = 5;
let player;
let score = 0;

const COINSIZE = 10;
const COIN_TIMEOUT = 2000;
const FLASH_TIME = 600; // Flash in last 600ms
let coin;
let coinSpawnTime = 0;
let gameState = 'start';

/*******************************************************/
// Setup Function
/*******************************************************/
function setup() {
    createCanvas(GAMEWIDTH, GAMEHEIGHT);
    showStartScreen();
}

/*******************************************************/
// Draw Function
/*******************************************************/
function draw() {
    background('cyan');

    if (gameState === 'start') {
        showStartScreen();
    } else if (gameState === 'play') {
        runGame();
    } else if (gameState === 'lose') {
        loseScreen();
    }
}

/*******************************************************/
// Start Screen
/*******************************************************/
function showStartScreen() {
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text('Coin Collector Game', GAMEWIDTH / 2, GAMEHEIGHT / 2 - 100);

    fill('#32CD32');
    rect(GAMEWIDTH / 2 - 70, GAMEHEIGHT / 2, 140, 50, 10);
    
    fill(0);
    textSize(22);
    text('Start', GAMEWIDTH / 2, GAMEHEIGHT / 2 + 25);
}

/*******************************************************/
// Start Game
/*******************************************************/
function startGame() {
    gameState = 'play';
    score = 0;

    player = new Sprite(GAMEWIDTH / 2, GAMEHEIGHT / 2, PLAYERSIZE, PLAYERSIZE);
    player.color = 'green';

    createCoin();
}

/*******************************************************/
// Run Game Logic
/*******************************************************/
function runGame() {
    movePlayer();
    checkCoinTime();
    displayScore();
}

/*******************************************************/
// Check Coin Expiry & Flashing
/*******************************************************/
function checkCoinTime() {
    let timeLeft = millis() - coinSpawnTime;
    if (timeLeft > COIN_TIMEOUT - FLASH_TIME && timeLeft < COIN_TIMEOUT) {
        coin.color = (frameCount % 10 < 5) ? 'red' : 'yellow';
    }
    if (timeLeft > COIN_TIMEOUT) {
        coin.remove();
        gameOver();
    }
}

/*******************************************************/
// Create Coin
/*******************************************************/
function createCoin() {
    let x = random(20, GAMEWIDTH - 20);
    let y = random(20, GAMEHEIGHT - 20);

    coin = new Sprite(x, y, COINSIZE, COINSIZE);
    coin.color = 'circle';
    coin.color = 'yellow';

    coinSpawnTime = millis();
    player.collides(coin, getPoint);
}

/*******************************************************/
// Move Player
/*******************************************************/
function movePlayer() {
    player.vel.x = 0;
    player.vel.y = 0;

    if (keyIsDown(65)) player.vel.x = -PLAYERMOVEMENT;
    if (keyIsDown(68)) player.vel.x = PLAYERMOVEMENT;
    if (keyIsDown(87)) player.vel.y = -PLAYERMOVEMENT;
    if (keyIsDown(83)) player.vel.y = PLAYERMOVEMENT;
}

/*******************************************************/
// Coin Collection
/*******************************************************/
function getPoint(collider1, collider2) {
    collider2.remove();
    score++;
    createCoin();
}

/*******************************************************/
// Display Score
/*******************************************************/
function displayScore() {
    fill(0);
    textSize(20);
    text("Score: " + score, 10, 20);
}

/*******************************************************/
// Game Over Logic
/*******************************************************/
function gameOver() {
    gameState = 'lose';
}

/*******************************************************/
// Lose Screen
/*******************************************************/
function loseScreen() {
    background('#8B0000');
    player.remove();

    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('Game Over!', GAMEWIDTH / 2, GAMEHEIGHT / 2 - 50);
    text('Score: ' + score, GAMEWIDTH / 2, GAMEHEIGHT / 2);

    fill('#FFFF00');
    rect(GAMEWIDTH / 2 - 70, GAMEHEIGHT / 2 + 60, 140, 50, 10);
    
    fill(0);
    textSize(22);
    text('Restart', GAMEWIDTH / 2, GAMEHEIGHT / 2 + 85);
}

/*******************************************************/
// Mouse Click Detection
/*******************************************************/
function mousePressed() {
    if (gameState === 'start' && mouseX > GAMEWIDTH / 2 - 70 && mouseX < GAMEWIDTH / 2 + 70 &&
        mouseY > GAMEHEIGHT / 2 && mouseY < GAMEHEIGHT / 2 + 50) {
        startGame();
    }
    if (gameState === 'lose' && mouseX > GAMEWIDTH / 2 - 70 && mouseX < GAMEWIDTH / 2 + 70 &&
        mouseY > GAMEHEIGHT / 2 + 60 && mouseY < GAMEHEIGHT / 2 + 110) {
        location.reload();
    }
}
