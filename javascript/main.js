'use strict';

if (!localStorage.leaderboard) localStorage.leaderboard = JSON.stringify([new Score ('Jesus', 9000), new Score ('Cody', 9000),
new Score ('Liza', 7000), new Score ('Scott Was Here', 4200), new Score ('Brent', 2000),
new Score ('Charity case', 1000), new Score ('no', 300)]);
function Score (name, score) {
  this.name = name;
  this.score = score;
}
var levelSelect = 0;
var charSelect = [];

var user = {
  win: false,
  namePer: function(){
    var name = localStorage.name;
    if (!name) name = 'anonymous';
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
  lives: 3,
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
var levelCols = level[0].length;
var levelRows = level.length;
var tileSize = 16;
var levelWidth = canvas.width = levelCols * tileSize;
var levelHeight = canvas.height = levelRows * tileSize;

var Hero = function(x, y, ctx,id){
  this.x = x;
  this.y = y;
  this.ctx = ctx;
  this.velY = 0;
  this.velX = 0;
  this.width = 40;
  this.height = 40;
  this.playing = false;
  this.sprites = document.getElementById(id);
  this.onground = false;
};
var hero = new Hero(65, 315, ctx,'hero1');
var hero2 = new Hero(65, 315, ctx,'hero2');
charSelect.push(hero,hero2,hero2);

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
  //p is the hero
  // x axis
  var a = {x: p.x + p.velX, y: p.y, w: p.width, h: p.height};
  for (var i = 0; i < levelRows; i++) {
    for (var j = 0; j < levelCols; j++) {
      if (level[i][j] === 1) {
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
  if (p.y >= 650) p.playing = false;
  for (let i = 0; i < levelRows; i++) {
    for (let j = 0; j < levelCols; j++) {
      if (level[i][j] === 1) {
        a = {x: p.x, y: p.y + p.velY, w: p.width, h: p.height};
        b = {x: j * tileSize, y: i * tileSize, w: tileSize, h: tileSize};
        if (collisionTest(a, b)) {
          if (p.velY < 0) {
            p.velY = b.y + b.h - p.y;       // Up Collision
          } else if (p.velY > 0) {
            p.velY = b.y - p.y - p.height;   // Down Collision
          }
        }
      } else if (level[i][j] === 2) {
        a = {x: p.x, y: p.y + p.velY, w: p.width, h: p.height};
        b = {x: j * tileSize, y: i * tileSize, w: tileSize, h: tileSize};
        if (collisionTest(a, b)) {
          level[i][j] = 0;
          user.score += 100 * (1 + 0.5 * levelSelect * levelSelect); //coinvalue		 +
        }
      } else if (level[i][j] === 3) {
        let a = {x: p.x, y: p.y + p.velY, w: p.width, h: p.height};
        let b = {x: j * tileSize, y: i * tileSize, w: tileSize, h: tileSize};
        if (collisionTest(a, b)) {
          user.win = true;
          p.playing = false;
          if (levelSelect === 0) earthgravity = earthgravity - 0.5;
          jumpstrength = jumpstrength + 5;
          levelSelect++;
        }
      }
    }
  }
  p.y += p.velY;
}

var earthgravity = 0.6;
var jumpstrength = -10;

Hero.prototype.update = function(){
  // Update hero
  this.velX = 6 * (!!keys[68] - !!keys[65]);           // 3 * Right - Left. Truthy key equals 1, falsy key equals 0.
  this.velY += earthgravity;
  var expectedYPos = this.velY + this.y;
  move(charSelect[levelSelect]);
  this.onGround = (expectedYPos > this.y);
  if (expectedYPos !== this.y) this.velY = 0;    // hero.velY is 0 on the ground and only on ground
  if (this.onGround && keys[87]) this.velY = jumpstrength;
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
  ctx.font = '40px VT323';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + user.score, 50, 50);
}

function renderUserName() {
  ctx.font = '40px VT323';
  ctx.fillStyle = 'red';
  ctx.fillText(user.name, 900, 500);
  ctx.fillText('Lives: ' + user.lives, 870, 50);
}

function renderLevel() {
  for (var i = 0; i < levelRows; i++) {
    for (var j = 0; j < levelCols; j++) {
      if (level[i][j] === 1) {
        // Solid Blocks
        ctx.fillStyle = 'rgb(63,42,20)';
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (level[i][j] === 2) {
        // Coin Blocks
        ctx.fillStyle = 'gold';
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (level[i][j] === 3) {
        // Goal Block
        ctx.fillStyle = 'green';
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      }
    }
  }
}

window.onload = function(){
  var c = document.getElementById('canvas');
  c.width = 1040;
  c.height = 510;
  var ctx = c.getContext('2d');
  var clouds1 = new Environment(c, ctx, 0.3, 'bg', 0, -100);
  var clouds2 = new Environment(c, ctx, -0.1, 'bg', 700, -150);
  var clouds3 = new Environment(c, ctx, 0.1, 'bg', 300, -150);
  var clouds4 = new Environment(c, ctx, -0.05, 'bg', 200, 0);
  var clouds5 = new Environment(c, ctx, 0.1, 'bg', 200, 285);
  var clouds6 = new Environment(c, ctx, -0.06, 'bg', 400, 270);
  var clouds7 = new Environment(c, ctx, 0.08, 'bg', 640, 300);
  var clouds8 = new Environment(c, ctx, -0.03, 'bg', -200, 310);
  var deathstar = new Environment(c, ctx, 0.035, 'deathstar', 900, -100);
  var debris = new Environment(c, ctx, 0.04, 'debris', 900, -100);
  var ufo = new Environment(c, ctx, 0.5,'ufo', -500, 0);
  var ufo1 = new Environment(c, ctx, 3,'ufo', -500, 0);
  var ufo2 = new Environment(c, ctx, 4,'ufo', -35, 10);
  var ufo3 = new Environment(c, ctx, 3,'ufo', -200, 20);
  var ufo4 = new Environment(c, ctx, 4,'ufo', -100, 5);
  var ufo5 = new Environment(c, ctx, 3,'ufo', 100, 20);
  var ufo6 = new Environment(c, ctx, 4,'ufo', 400, 5);
  var ufo7 = new Environment(c, ctx, 3,'ufo', 680, 20);
  var ufo8 = new Environment(c, ctx, 4,'ufo', 760, 5);
  var ufo9 = new Environment(c, ctx, -0.5,'ufo', 0, 50);
  var cruiser = new Environment(c, ctx, 1.5,'cruiser', 60, 0);
  var cruiser1 = new Environment(c, ctx, 2.2,'cruiser', 260, 30);
  var cruiser2 = new Environment(c, ctx, 1.3,'cruiser', 460, 55);
  var cruiser3 = new Environment(c, ctx, 0.8,'cruiser', 760, 70);
  var background = new Images (0,0,ctx,'fg');
  var spacebackground = new Images (0,0,ctx,'space');
  var galaxy = new Environment(c, ctx, -0.008, 'galaxy', -200, 310);
  var galaxy2 = new Environment(c, ctx, -0.001, 'galaxy', 500, -150);
  var planet = new Environment(c, ctx, -0.01, 'planet', 850, 350);
  var sun = new Environment(c, ctx, -0.005, 'sun', 900, 290);
  var earth = new Environment(c, ctx, -0.005, 'earth', 530, 200);
  var moon = new Environment(c, ctx, -0.024, 'moon', 50, 0);
  var mothership = new Environment(c, ctx, -0.08, 'mothership', -60, 180);
  var asteroids0 = new Environment(c, ctx, 0.1, 'asteroids', 350, 300);
  var asteroids1 = new Environment(c, ctx, 0.1, 'asteroids', 750, 350);
  var asteroids2 = new Environment(c, ctx, 0.1, 'asteroids', 50, 400);


  gameLoop();
  function gameLoop(){
    ctx.clearRect(0,0,c.width,c.height);
    if (charSelect[levelSelect].playing){
      if (levelSelect == 0) {
        spacebackground.update();
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
        charSelect[levelSelect].update();
        charSelect[levelSelect].render();
        clouds1.update();
        clouds1.render();
        clouds5.update();
        clouds5.render();
        clouds6.update();
        clouds6.render();
        clouds7.update();
        clouds7.render();
        clouds8.update();
        clouds8.render();
      } else {
        spacebackground.update();
        spacebackground.render();
        galaxy.update();
        galaxy.render();
        galaxy2.update();
        galaxy2.render();
        planet.update();
        planet.render();
        sun.update();
        sun.render();
        earth.update();
        earth.render();
        moon.update();
        moon.render();
        deathstar.update();
        deathstar.render();
        mothership.update();
        mothership.render();
        ufo1.update();
        ufo1.render();
        cruiser.update();
        cruiser.render();
        ufo2.update();
        ufo2.render();
        cruiser1.update();
        cruiser1.render();
        ufo3.update();
        ufo3.render();
        cruiser2.update();
        cruiser2.render();
        ufo4.update();
        ufo4.render();
        ufo6.update();
        ufo6.render();
        ufo7.update();
        ufo7.render();
        cruiser3.update();
        cruiser3.render();
        ufo8.update();
        ufo8.render();
        ufo9.update();
        ufo9.render();
        ufo5.update();
        ufo5.render();
        asteroids0.update();
        asteroids0.render();
        asteroids1.update();
        asteroids1.render();
        asteroids2.update();
        asteroids2.render();
        deathstar.update();
        deathstar.render();
        renderLevel();
        charSelect[levelSelect].update();
        charSelect[levelSelect].render();
        debris.render();
        debris.update();

      }
      renderScore();
      renderUserName();
    } else {
      end.game();
    }
    if (keys[13]) window.location.reload();
    window.requestAnimationFrame(gameLoop);
  }
};

var thing = document.getElementById('form1');
function onSubmit(event) {
  var text = event.target.userName.value;
  localStorage.name = text;
}

var end = {
  s: 0,
  game: function (){
    end.render();
    if (keys[32] && user.lives > 0) end.setUp();
  },

  setUp: function (){

    if (!user.win) user.lives--;

    charSelect[levelSelect].x = 65;
    charSelect[levelSelect].y = 300;
    level = maps[levelSelect];
    charSelect[levelSelect].playing = true;
    user.win = false;
  },
  render: function (){
    if (levelSelect > 0){
      if (user.win) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0, levelWidth, levelHeight);
        ctx.font = '30px Comic Sans MS';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText(user.name + ', YOU WON!', levelWidth / 2 , 150);
        ctx.fillText('Your score: ' + user.score, levelWidth / 2 , 300);
        ctx.font = '20px Comic Sans MS';
        ctx.fillText('Press spacebar to continue (' + user.lives + ' lives left), return to play again!', levelWidth / 2 , 450);
      } else {
        if (user.score !== 0 && end.s !== user.score) end.s = user.score;
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0, levelWidth, levelHeight);
        ctx.font = '30px Comic Sans MS';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText('YOU LOSE!', levelWidth / 2 , 150);
        ctx.fillText('Your score: ' + end.s, levelWidth / 2 , 300);
        ctx.fillText('Press spacebar to continue (' + user.lives + ' lives left), return to play again!', levelWidth / 2 , 450);
        user.addScoreToLeaderboard();
        user.score = 0;
      }
    }

    if (levelSelect === 0){
      if (user.lives === 3){
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0, levelWidth, levelHeight);
        ctx.font = '40px VT323';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Hi ' + user.name + '!', levelWidth / 2 , 100);
        ctx.fillText('Welcome to Easteros', levelWidth / 2 , 150);
        ctx.fillText('Press spacebar to continue', levelWidth / 2 , 400);
        ctx.font = '30px VT323';
        ctx.fillText('A = Left', levelWidth / 2 , 230);
        ctx.fillText('D = Right', levelWidth / 2 , 290);
        ctx.fillText('W = Jump', levelWidth / 2 , 350);
        ctx.fillText('Lives: ' + (user.lives - 1), levelWidth / 2 , 450);
      }
      else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0, levelWidth, levelHeight);
        ctx.font = '30px Comic Sans MS';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText('YOU LOSE!', levelWidth / 2 , 150);
        ctx.fillText('Your score: ' + end.s, levelWidth / 2 , 300);
        ctx.fillText('Press spacebar to continue (' + user.lives + ' lives left), return to play again!', levelWidth / 2 , 450);
        user.addScoreToLeaderboard();
        user.score = 0;
      }
    }
  }
};

thing.addEventListener('submit',onSubmit);
