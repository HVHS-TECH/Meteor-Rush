/*******************************************************/
// 🎮 Game Constants & Variables
/*******************************************************/
const PLAYERSIZE = 30;
const PLAYERMOVEMENT = 5;
let player;
let score = 0;
let fadeAlpha = 0; 

const COINSIZE = 10;
const COIN_TIMEOUT = 5000;
const FLASH_TIME = 1000;
let coin;
let coinSpawnTime = 0;
let gameState = 'start';

/*******************************************************/
// 🎭 Setup Function
/*******************************************************/
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    showStartScreen();
}

/*******************************************************/
// 🎨 Draw Function
/*******************************************************/
function draw() {
    if (gameState === 'start') {
        showStartScreen();
    } else if (gameState === 'play') {
        runGame();
    } else if (gameState === 'lose') {
        loseScreen();
    }
}

/*******************************************************/
// 🚀 Start Screen
/*******************************************************/
function showStartScreen() {
    background('#2E2E2E');
    fill(255, fadeAlpha);
    textSize(50);
    textAlign(CENTER, CENTER);
    text('💰 Coin Collector', width / 2, height / 2 - 100);
    fadeAlpha = min(fadeAlpha + 5, 255);
    fill('#FFD700');
    rect(width / 2 - 70, height / 2, 140, 50, 10);
    fill(0);
    textSize(22);
    text('Start', width / 2, height / 2 + 25);
}

/*******************************************************/
// 🏁 Start Game
/*******************************************************/
function startGame() {
    gameState = 'play';
    score = 0;
    fadeAlpha = 0;
    player = new Sprite(width / 2, height / 2, PLAYERSIZE, PLAYERSIZE);
    player.color = 'limegreen';
    player.bounciness = 0;
    createCoin();
}

/*******************************************************/
// 🎮 Game Logic
/*******************************************************/
function runGame() {
    background('#1E1E1E');
    movePlayer();
    checkCoinTime();
    displayScore();
}

/*******************************************************/
// ⏳ Coin Expiry & Flashing
/*******************************************************/
function checkCoinTime() {
    if (!coin) return;
    let timeLeft = millis() - coinSpawnTime;
    if (timeLeft > COIN_TIMEOUT - FLASH_TIME && timeLeft < COIN_TIMEOUT) {
        coin.color = (frameCount % 10 < 5) ? '#FF4500' : 'yellow';
    }
    if (timeLeft > COIN_TIMEOUT) {
        gameOver();
    }
}

/*******************************************************/
// 💰 Create Coin
/*******************************************************/
function createCoin() {
    let x = random(20, width - 20);
    let y = random(20, height - 20);
    coin = new Sprite(x, y, COINSIZE, COINSIZE);
    coin.shape = 'circle';
    coin.color = 'gold';
    coinSpawnTime = millis();
    player.collides(coin, getPoint);
}

/*******************************************************/
// 🏃 Player Movement
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
// ⭐ Coin Collection
/*******************************************************/
function getPoint(player, coin) {
    coin.remove();
    score++;
    createCoin();
}

/*******************************************************/
// 📊 Display Score
/*******************************************************/
function displayScore() {
    fill('#FFD700');
    textSize(20);
    textAlign(LEFT, CENTER);
    text("Score: " + score, 20, 30);
}

/*******************************************************/
// ❌ Game Over
/*******************************************************/
function gameOver() {
    gameState = 'lose';
}

/*******************************************************/
// 💀 Lose Screen
/*******************************************************/
function loseScreen() {
    background('#1E1E1E');
    player.remove();
    fill(255, fadeAlpha);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('❌ You lost the fortune!', width / 2, height / 2 - 50);
    text('Score: ' + score, width / 2, height / 2);
    fadeAlpha = min(fadeAlpha + 5, 255);
    fill('#32CD32');
    rect(width / 2 - 70, height / 2 + 60, 140, 50, 10);
    fill(0);
    textSize(22);
    text('Restart', width / 2, height / 2 + 85);
}

/*******************************************************/
// 🖱 Mouse Click Detection
/*******************************************************/
function mousePressed() {
    if (gameState === 'start' && mouseX > width / 2 - 70 && mouseX < width / 2 + 70 &&
        mouseY > height / 2 && mouseY < height / 2 + 50) {
        startGame();
    }
    if (gameState === 'lose' && mouseX > width / 2 - 70 && mouseX < width / 2 + 70 &&
        mouseY > height / 2 + 60 && mouseY < height / 2 + 110) {
        startGame();
    }
}
