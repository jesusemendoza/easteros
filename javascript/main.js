'use strict';

function Score (name, score) {
  this.name = name;
  this.score = score;
}
var levelSelect = 0;

var user = {
  namePer: function(){
    var name = localStorage.name;
    var userName = document.getElementById('useName');
    userName.textContent = name ;
    user.name = name;
  },
  score: 0,
  name: '',
   addScoreToLeaderboard: function() {
     var arr = JSON.parse (localStorage.leaderboard);
     var newArr = [];
     var added = false;
     for (var i in arr){
       if (arr[i].score < user.score && !added){
         newArr.push(new Score (user.name, user.score));
         added = true;
       }
       newArr.push(arr[i]);
     }
     if (added) newArr.pop();
     localStorage.leaderboard = JSON.stringify (newArr);
   },
};

user.namePer();


var Environment = function (c, ctx, speed, id, x, y){
  this.c = c;
  this.ctx = ctx;
  this.bgPosX = x;
  this.bgPosY = y;
  this.bgSpeed = speed;
  this.bgWidth = 1024;
  this.bgImg = document.getElementById(id);
};

Environment.prototype.update = function() {
  this.bgPosX -= this.bgSpeed;
  if (this.bgPosX < - this.bgWidth)
    this.bgPosX = 0;
};
Environment.prototype.render = function() {
  for (let i = 0; i <= this.c.width / this.bgWidth + 1; i++)
    this.ctx.drawImage(this.bgImg, this.bgPosX + i * this.bgWidth, this.bgPosY);
};

// Level Map: 64 x 32 Array of Arrays
// 1 = Solid Block, 2 = Lava Block, 3 = Goal Block
var c = document.getElementById('canvas');
c.width = window.innerWidth;
c.height = 600;

var ctx = c.getContext('2d');

var level = maps[levelSelect];
var levelCols = level[0].length;                              // 64 Columns
var levelRows = level.length;                                 // 32 Rows
var tileSize = 16;                                            // 1 Tile = 16 pixels
var levelWidth = canvas.width = levelCols * tileSize;         // Pixel Width = 1024
var levelHeight = canvas.height = levelRows * tileSize;       // Pixel Height = 512

var Hero = function(x, y, ctx,id){
  this.x = x;
  this.y = y;
  this.ctx = ctx;
  this.velY = 0;
  this.velX = 0;
  this.width = 32;
  this.height = 32;
  this.win = false;
  this.playing = true;
  this.sprites = document.getElementById(id);
  this.onground = false;
  var self = this;
};
var hero = new Hero(150, 250, ctx,'hero1'); //bad practice,for debug. came from onload stuff

// Key Check
var keys = {};
document.onkeydown = function(e) {keys[e.which] = true;};
document.onkeyup = function(e) {keys[e.which] = false;};

// Returns true if a and b collide
function collisionTest(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
  a.y < b.y + b.h && a.y + a.h > b.y;
}

function move(p) {
  // x axis
  for (var i = 0; i < levelRows; i++) {
    for (var j = 0; j < levelCols; j++) {
      if (level[i][j] == 1) {
        var a = {x: p.x + p.velX, y: p.y, w: p.width, h: p.height};
        var b = {x: j * tileSize, y: i * tileSize, w: tileSize, h: tileSize};
        if (collisionTest(a, b)) {
          if (p.velX < 0) {
            p.velX = b.x + b.w - p.x;       // Left Collision
          } else if (p.velX > 0) {
            p.velX = b.x - p.x - p.width;   // Right Collision
          }
        }
      }
    }
  }
  p.x += p.velX;
  // y axis

  if (hero.y >= 650) hero.playing = false;
  for (let i = 0; i < levelRows; i++) {
    for (let j = 0; j < levelCols; j++) {
      if (level[i][j] === 1) {
        let a = {x: p.x, y: p.y + p.velY, w: p.width, h: p.height};
        let b = {x: j * tileSize, y: i * tileSize, w: tileSize, h: tileSize};
        if (collisionTest(a, b)) {
          if (p.velY < 0) {
            p.velY = b.y + b.h - p.y;       // Up Collision
          } else if (p.velY > 0) {
            p.velY = b.y - p.y - p.height;   // Down Collision
          }
        }
      } else if (level[i][j] === 2) {
        var a = {x: p.x, y: p.y + p.velY, w: p.width, h: p.height};
        var b = {x: j * tileSize, y: i * tileSize, w: tileSize, h: tileSize};
        if (collisionTest(a, b)) {
          level[i][j] = 0;         // 2 blocks reset hero.x and y to the starting position
          user.score += 100; //coinvalue		 +

          // 2 blocks reset hero.x and y to the starting position
          // hero.x = tileSize * 3;
          // hero.y = tileSize * 26;
        }
      } else if (level[i][j] === 3) {
        let a = {x: p.x, y: p.y + p.velY, w: p.width, h: p.height};
        let b = {x: j * tileSize, y: i * tileSize, w: tileSize, h: tileSize};
        if (collisionTest(a, b)) {
          // Goal block sets hero.win to true for win condition
          hero.win = true;
          hero.playing = false;
        }
      }
    }
  }
  p.y += p.velY;
}

Hero.prototype.update = function(){
  // Update hero
  this.velX = 6 * (!!keys[68] - !!keys[65]);           // 3 * Right - Left. Truthy key equals 1, falsy key equals 0.
  this.velY += 0.6;                                    // Gravity
  var expectedYPos = this.velY + this.y;
  move(hero);
  this.onGround = (expectedYPos > this.y);
  if (expectedYPos != this.y) {this.velY = 0;}    // hero.velY is 0 on the ground
  if (this.onGround && keys[87]) {this.velY = -10;}  // Jump
};

Hero.prototype.render = function(){
  var renderX = this.x;
  var renderY = this.y;
  this.ctx.drawImage(this.sprites, renderX, renderY);
};

var Images = function(x, y, ctx,id){
  this.x = x;
  this.y = y;
  this.ctx = ctx;
  this.velY = 0;
  this.velX = 0;
  this.width = 25;
  this.height = 25;
  this.sprites = document.getElementById(id);
};

Images.prototype.update = function(){
};

Images.prototype.render = function(){
  let renderX = this.x - this.width / 2;
  let renderY = this.y - this.height / 2;
  this.ctx.drawImage(this.sprites, renderX, renderY);
};

function renderScore() {
   ctx.font = '30px Comic Sans MS';
   ctx.fillStyle = 'red';
   ctx.textAlign = 'left';
   ctx.fillText('Score: ' + user.score, 50, 50);
 }

function renderLevel() {
  for (var i = 0; i < levelRows; i++) {
    for (var j = 0; j < levelCols; j++) {
      if (level[i][j] === 1) {
        // Solid Blocks
        ctx.fillStyle = "rgb(63,42,20)";
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (level[i][j] === 2) {
        // Coin Blocks
        ctx.fillStyle = "gold";
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (level[i][j] === 3) {
        // Goal Block
        ctx.fillStyle = "green";
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      }
    }
  }
}


var hero = new Hero(150, 250, ctx,'hero1');

window.onload = function(){
  var c = document.getElementById('canvas');
  c.width = 1040;
  c.height = 510;

  var ctx = c.getContext('2d');
  var clouds1 = new Environment(c, ctx, 0.3, 'bg', 0, -100);
  var clouds2 = new Environment(c, ctx, -0.1, 'bg', 700, -150);
  var clouds3 = new Environment(c, ctx, 0.1, 'bg', 300, -150);
  var clouds4 = new Environment(c, ctx, -0.05, 'bg', 200, 0);
  var ufo = new Environment(c, ctx, 0.5,'ufo', -500, 0);
  var background = new Images (0,0,ctx,'fg');
  // var log = new Images (0,0,ctx,'fg');
  gameLoop();

  function gameLoop(){
    ctx.clearRect(0,0,c.width,c.height);
    if (hero.playing){
      background.update();
      background.render();
      clouds4.update();
      clouds4.render();
      ufo.update();
      ufo.render();
      clouds3.update();
      clouds3.render();
      clouds2.update();
      clouds2.render();
      renderLevel();
      hero.update();
      hero.render();
      clouds1.update();
      clouds1.render();
      renderScore();
    } else {
      end.game();
    }
    window.requestAnimationFrame(gameLoop);
  }
};

var thing = document.getElementById('form1');
function onSubmit(event) {
  event.preventDefault();
  var text = event.target.userName.value;
  console.log(text);
  localStorage.name = text;

}


var end = {
  game: function (){
    end.render();

    if (keys[32]) end.setUp();//if spaceBar pushed


  },

  setUp: function (){
    //if user decides to play another game, this will set it up
    if (hero.win){
      user.addScoreToLeaderboard();
      user.score = 0;
      if (levelSelect < maps.length) levelSelect++;
      else levelSelect = 0;
      //TODO you win screen, stop game loop, reset
    }
    hero.x = 65;
    hero.y = 300;
    level = maps[levelSelect];
    hero.playing = true;
    hero.win = false;
    //TODO initiate game loop
  },
  render: function (){
    if (hero.win){
      ctx.fillStyle = '#000';
      ctx.fillRect(0,0, levelWidth, levelHeight);
      ctx.font = '30px Comic Sans MS';
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.fillText(user.name + ', YOU WON!', levelWidth / 2 , 150);
      ctx.fillText('Your score: ' + user.score, levelWidth / 2 , 300);
    }
    else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0,0, levelWidth, levelHeight);
      ctx.font = '30px Comic Sans MS';
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.fillText('YOU LOSE! GAME OVER!', levelWidth / 2 , 150);
      ctx.fillText('Your score: ' + user.score, levelWidth / 2 , 300);
    }
    ctx.fillText('Press Spacebar to play again!', levelWidth / 2 , 450);
  }
};

thing.addEventListener('submit',onSubmit);
