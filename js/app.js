/*-----------------------------Enemy------------------------------------------*/

// Enemies our player must avoid
var Enemy = function (n, m, speed) {

    // The following variables are used to determine the x and y axis and speed of the enemy
    this.n = n;
    this.m = m;
    this.speed = speed;

    // The image of the enemy of cockroach that is added to the playing field
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {

    // Multiplies the speed by the dt parameter on the x axis
    this.n = this.n + this.speed * dt;

    // Once enemies are off the canvas, they reappear randomly with different speeds
    if (this.n >= 505) {
        this.n = -100;
        this.randomSpeed();
    }
     this.checkCollision();

    // Checks for collisions between the player and the enemies
    if (player.n < this.n + 90 &&
        player.n + 90 > this.n &&
        player.m < this.m + 70 &&
        70 + player.m > this.m) {
        player.n = 200;
        player.m = 400;
    }
};

var speedMultiplier = 40;
Enemy.prototype.randomSpeed = function (){

    // Speed is a random number from 1-10 times speedMultiplier
    this.speed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
};

// Renders the enemy into the game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.n, this.m);


};
Enemy.prototype.checkCollision = function() {

    // Set hitboxes for collision detection
    var playerBox = {n: player.n, m: player.m, width: 50, height: 40};
    var enemyBox = {n: this.n, m: this.m, width: 60, height: 70};
    // Check for collisions, if playerBox intersects enemyBox, we have one
    if (playerBox.n < enemyBox.n + enemyBox.width &&
        playerBox.n + playerBox.width > enemyBox.n &&
        playerBox.m < enemyBox.m + enemyBox.height &&
        playerBox.height + playerBox.m > enemyBox.m) {
        // Collision detected, call collisionDetected function
        this.collisionDetected();
    }
};

// Collision detected, decrement playerLives and reset the player
Enemy.prototype.collisionDetected = function() {
    "use strict";
    player.playerLives -= 1;
    player.characterReset();
};


/*--------------------------------Gem-----------------------------------------*/
// Gems the player should try to pick up
var Gem = function(n,m) {

    this.n = n;
    this.m = m;
    this.sprite = 'images/key.png';
};

Gem.prototype.update = function() {

    this.checkCollision();
};
// Draw the gem to the screen
Gem.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.n, this.m);
};

Gem.prototype.checkCollision = function() {
    "use strict";
    // Set hitboxes for collision detection
    var playerBox = {n: player.n, m: player.m, width: 50, height: 40};
    var gemBox = {n: this.n, m: this.m, width: 60, height: 70};
    // Check for collisions, if playerBox intersects gemBox, we have one
    if (playerBox.n < gemBox.n + gemBox.width &&
        playerBox.n + playerBox.width > gemBox.x &&
        playerBox.m < gemBox.m + gemBox.height &&
        playerBox.height + playerBox.m > gemBox.m) {
        // Collision detected, call collisionDetected function
        this.collisionDetected();
    }
};

// Gem collision detected, hide the gem off canvas,
// Increase player score, wait 5 seconds, then reset the gem
Gem.prototype.collisionDetected = function() {
    "use strict";
    this.n = 900;
    this.m = 900;
    player.playerScore += 30;
    this.wait();
};


Gem.prototype.gemReset = function() {

    // Gems appear at one of the following x positions: 0, 101, 202, 303, 404
    this.n = (101 * Math.floor(Math.random() * 4) + 0);
    // Gems appear at one of the following Y positions: 60, 145, 230
    this.m = (60 + (85 * Math.floor(Math.random() * 3) + 0));
};


/*------------------------------Player----------------------------------------*/
// Player class focusing on x and y axis
var Player = function () {

    // Variables for the player to move along x and y axis
    this.n = 200;
    this.m = 400;
    this.player = 'images/char-cat-girl.png';

};

Player.prototype.update = function() {

    if (this.playerLives === 0) {

    reset();
    }
};

Player.prototype.characterReset = function() {

    this.n = 200;
    this.m = 400;

};
// Increase score and increase difficulty when player reaches top of water
Player.prototype.success = function() {

    this.playerScore += 20;
    speedMultiplier += 5;
    this.characterReset();
};

// Renders the image of the user into the game
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.player), this.n, this.m);
};

// Move the player according to keys pressed
Player.prototype.handleInput = function (key) {

    // Enables user on left arrow key to move left on the x axis by 102
    // Also enables user not to go off the game tiles on the left side
    if (key == 'left' && this.n > 0) {
        this.n -= 102;
    }

    // Enables user on right arrow key to move right on the x axis by 102
    // Also enables user not to go off the game tiles on the right side
    if (key== 'right' && this.n < 405) {
        this.n += 102;
    }

    // Enables user on up arrow key to move upwards on the y axis by 83
    if (key == 'up' && this.m > 0) {
        this.m -= 83;
    }

    // Enables user on down arrow key to move downwards on the y axis by 83
    // Also enables user not to go off the game tiles on the bottom side
    if (key == 'down' && this.m < 405) {
        this.m += 83;
    }

    // Once the user reaches the top of the page; the water, the user is
    // Instantly reset to the starting position
    if (this.m < 0) {
        setTimeout(() => {
            this.n = 202;
            this.m = 405;
        }, 800);
    }
};
/*-------------------------Instantiate Objects--------------------------------*/

var player = new Player();
// All enemies are placed in an array
var allEnemies = [];

// Location of the 3 enemies on the y axis located on the stone road



for (var i = 0; i < 3; i++) {
    //startSpeed is a random number from 1-10 times speedMultiplier
    var startSpeed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
    //enemys start off canvas (x = -100) at the following Y positions: 60, 145, 230
    allEnemies.push(new Enemy(-100, 60 + (85 * i), startSpeed));
}

var gem = new Gem (101 * Math.floor(Math.random() * 4) + 0, 60 +
    (85 * Math.floor(Math.random() * 3) + 0));


// This listens for key presses and sends the keys to your
// Player.handleInput() method.
var input = function(e) {

var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};
player.handleInput(allowedKeys[e.keyCode]);
};
document.addEventListener('keyup', input);
