/*******************************************************/
// Game Constants
/*******************************************************/
const GAMEWIDTH = window.innerWidth;
const GAMEHEIGHT = window.innerHeight;

const PLAYERSIZE = 50;
const PLAYERMOVEMENT = 5;
let player;
let score = 0;

const COINSIZE = 15;
const MIN_COIN_INTERVAL = 1000; // Minimum 1 second
const MAX_COIN_INTERVAL = 3000; // Maximum 3 seconds
const COIN_TIMEOUT = 7000; // Coin disappears after 7 seconds
const FLASH_TIME = 1000; // Flashing effect before disappearing
let coins;

let gameState = 'play';
let sounds = {};

/*******************************************************/
// Setup Function
/*******************************************************/
function setup() {
    createCanvas(GAMEWIDTH, GAMEHEIGHT);

    // Create Player
    player = new Sprite(GAMEWIDTH / 2, GAMEHEIGHT / 2, PLAYERSIZE, PLAYERSIZE);
    player.color = 'green';
    player.collider = 'dynamic';

    // Initialize groups
    coins = new Group();

    // Create Walls
    createWalls();

    scheduleNextCoinSpawn();
}

/*******************************************************/
// Draw Function
/*******************************************************/
function draw() {
    background('#ADD8E6');
    if (gameState === 'play') {
        runGame();
    } else if (gameState === 'lose') {
        loseScreen();
    }
}

/*******************************************************/
// Main Game Logic
/*******************************************************/
function runGame() {
    movePlayer();
    player.overlap(coins, getPoint);

    for (let i = coins.length - 1; i >= 0; i--) {
        let coin = coins[i];
        let timeLeft = COIN_TIMEOUT - (millis() - coin.spawnTime);

        if (timeLeft < FLASH_TIME) {
            coin.color = (floor(millis() / 200) % 2 === 0) ? 'red' : 'gold';
        }

        if (checkCoinTime(coin)) {
            coin.remove();
            gameState = 'lose';
            if (sounds.lose) sounds.lose.play();
        }
    }
    displayScore();
}

/*******************************************************/
// Coin Spawning
/*******************************************************/
function scheduleNextCoinSpawn() {
    let interval = random(MIN_COIN_INTERVAL, MAX_COIN_INTERVAL);
    setTimeout(() => {
        if (gameState === 'play') {
            let coin = createCoin();
            coins.add(coin);
            scheduleNextCoinSpawn();
        }
    }, interval);
}

/*******************************************************/
// Lose Screen
/*******************************************************/
function loseScreen() {
    background('#FF6347');
    player.remove();
    coins.removeAll();

    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('You missed a coin!', GAMEWIDTH / 2, GAMEHEIGHT / 2 - 30);
    text('Score: ' + score, GAMEWIDTH / 2, GAMEHEIGHT / 2 + 30);

    fill('white');
    rect(GAMEWIDTH / 2 - 50, GAMEHEIGHT / 2 + 80, 100, 40);
    fill(0);
    textSize(20);
    text('Restart', GAMEWIDTH / 2, GAMEHEIGHT / 2 + 100);
}

function mousePressed() {
    if (gameState === 'lose' && mouseX > GAMEWIDTH / 2 - 50 && mouseX < GAMEWIDTH / 2 + 50 && mouseY > GAMEHEIGHT / 2 + 80 && mouseY < GAMEHEIGHT / 2 + 120) {
        location.reload();
    }
}

/*******************************************************/
// Coin Functions
/*******************************************************/
function checkCoinTime(coin) {
    return millis() - coin.spawnTime > COIN_TIMEOUT;
}

function createCoin() {
    let x = random(20, GAMEWIDTH - 20);
    let y = random(20, GAMEHEIGHT - 20);

    let coin = new Sprite(x, y, COINSIZE, COINSIZE);
    coin.shape = "circle";
    coin.color = 'gold';
    coin.spawnTime = millis();

    return coin;
}

function getPoint(player, coin) {
    coin.remove();
    score++;
    if (sounds.coin) sounds.coin.play();
}

/*******************************************************/
// Display Score
/*******************************************************/
function displayScore() {
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text('Score: ' + score, 20, 20);
}

/*******************************************************/
// Move Player
/*******************************************************/
function movePlayer() {
    if (kb.pressing('a')) player.vel.x = -PLAYERMOVEMENT;
    else if (kb.pressing('d')) player.vel.x = PLAYERMOVEMENT;
    else player.vel.x = 0;

    if (kb.pressing('w')) player.vel.y = -PLAYERMOVEMENT;
    else if (kb.pressing('s')) player.vel.y = PLAYERMOVEMENT;
    else player.vel.y = 0;
}

/*******************************************************/
// Create Walls
/*******************************************************/
function createWalls() {
    let wallThickness = 10;

    let topWall = new Sprite(GAMEWIDTH / 2, wallThickness / 2, GAMEWIDTH, wallThickness);
    let bottomWall = new Sprite(GAMEWIDTH / 2, GAMEHEIGHT - wallThickness / 2, GAMEWIDTH, wallThickness);
    let leftWall = new Sprite(wallThickness / 2, GAMEHEIGHT / 2, wallThickness, GAMEHEIGHT);
    let rightWall = new Sprite(GAMEWIDTH - wallThickness / 2, GAMEHEIGHT / 2, wallThickness, GAMEHEIGHT);

    topWall.color = bottomWall.color = leftWall.color = rightWall.color = 'black';
    topWall.collider = bottomWall.collider = leftWall.collider = rightWall.collider = 'static';
}
