/*******************************************************/
// Game Constants
/*******************************************************/
const GAMEWIDTH = 500;
const GAMEHEIGHT = 500;

const PLAYERSIZE = 20;
const PLAYERMOVEMENT = 5;
let player;
let score = 0;

const COINSIZE = 10;
const COIN_TIMEOUT = 2000;
let coin;
let coinSpawnTime = 0;

/*******************************************************/
// Setup Function
/*******************************************************/
function setup() {
    console.log("setup: ");

    createCanvas(GAMEWIDTH, GAMEHEIGHT);

    // Create Player
    player = new Sprite(100, 100, PLAYERSIZE, PLAYERSIZE);
    player.color = 'green';

    // Create Walls
    createWalls();

    // Create First Coin
    createCoin();
}

/*******************************************************/
// Draw Function
/*******************************************************/
function draw() {
    background('cyan');

    movePlayer();
    checkCoinTime();
    displayScore();
}

/*******************************************************/
// Check Coin Expiry
/*******************************************************/
function checkCoinTime() {
    // If the coin has been around too long, remove and respawn it
    if (millis() - coinSpawnTime > COIN_TIMEOUT) {
        coin.remove();
        createCoin();
    }
}

/*******************************************************/
// Create Coin
/*******************************************************/
function createCoin() {
    let x = random(20, GAMEWIDTH - 20);
    let y = random(20, GAMEHEIGHT - 20);

    coin = new Sprite(x, y, COINSIZE, COINSIZE);
    coin.color = 'yellow';

    // Store coin spawn time
    coinSpawnTime = millis();

    // Enable collision detection with the player
    player.collides(coin, getPoint);
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
// Move Player
/*******************************************************/
function movePlayer() {
    if (kb.pressing('a')) {
        player.vel.x = -PLAYERMOVEMENT;
    } else if (kb.pressing('d')) {
        player.vel.x = PLAYERMOVEMENT;
    } else {
        player.vel.x = 0;
    }

    if (kb.pressing('w')) {
        player.vel.y = -PLAYERMOVEMENT;
    } else if (kb.pressing('s')) {
        player.vel.y = PLAYERMOVEMENT;
    } else {
        player.vel.y = 0;
    }

    // Keep player inside game boundaries
    player.x = constrain(player.x, PLAYERSIZE / 2, GAMEWIDTH - PLAYERSIZE / 2);
    player.y = constrain(player.y, PLAYERSIZE / 2, GAMEHEIGHT - PLAYERSIZE / 2);
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
// Create Walls
/*******************************************************/
function createWalls() {
    let wallThickness = 10;

    let topWall = new Sprite(GAMEWIDTH / 2, wallThickness / 2, GAMEWIDTH, wallThickness);
    let bottomWall = new Sprite(GAMEWIDTH / 2, GAMEHEIGHT - wallThickness / 2, GAMEWIDTH, wallThickness);
    let leftWall = new Sprite(wallThickness / 2, GAMEHEIGHT / 2, wallThickness, GAMEHEIGHT);
    let rightWall = new Sprite(GAMEWIDTH - wallThickness / 2, GAMEHEIGHT / 2, wallThickness, GAMEHEIGHT);

    topWall.color = bottomWall.color = leftWall.color = rightWall.color = 'black';
    topWall.collider = 'static';
    bottomWall.collider = 'static';
    leftWall.collider = 'static';
    rightWall.collider = 'static';
}

