'use strict';
var user = {
  namePer: function(){
    var name = localStorage.name;
    var userName = document.getElementById('useName');
    userName.textContent = name ;
  },
  score: 0,
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

var level = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,1,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
  [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,2,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0]
];
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
  this.width = 18;
  this.height = 26;
  this.sprites = document.getElementById(id);
  var self = this;
  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 38){
      self.velY = -1;
    } else if (e.keyCode === 39) {
      self.velX = 2;
    } else if (e.keyCode === 37) {
      self.velX = -2;
    }
  });
};

Hero.prototype.update = function(){
  this.y += this.velY;
  this.velY += 0;
  var xSpeedStep = 0.05;
  if (this.velX < - xSpeedStep){
    this.x += this.velX;
    this.velX += xSpeedStep;
  } else if (this.velX > xSpeedStep) {
    this.x += this.velX;
    this.velX += -xSpeedStep;
  } else {this.velX = 0;}
  for (var i = 0; i < levelRows; i++) {
    for (var j = 0; j < levelCols; j++) {
      if (level[i][j] === 1) {
        var block = {
          x: j * tileSize,
          y: i * tileSize,};
        if (collision.cTest (this, block)){
          var dir = collision.cDir(this, block);
          switch (dir) {
          case 0:{
            this.velY = 0;
            break;
          }
          case 1:{
            this.velX = 0;
            break;
          }
          case 2:{
            this.velY = 0;
            break;
          }
          case 3:{
            this.velX = 0;
            break;
          }
          default:{
            console.log('poop!');
            break;
          }
          }
          if (level[i][j] === 2){
            level[i][j] = 0;
            user.score += 100; //coinvalue
          } else if (level[i][j] === 3){
            //TODO: win
          }
        }
      }
    }
  }
};

Hero.prototype.render = function(){
  let renderX = this.x - this.width / 2;
  let renderY = this.y - this.height / 2;
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


function renderLevel() {
  for (var i = 0; i < levelRows; i++) {
    for (var j = 0; j < levelCols; j++) {
      if (level[i][j] === 1) {
        // Solid Blocks
        ctx.fillStyle = "rgb(63,42,20)";
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if (level[i][j] === 2) {
        // Lava Blocks
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




window.onload = function(){
  var c = document.getElementById('canvas');
  c.width = 1040;
  c.height = 510;

  var ctx = c.getContext('2d');
  var clouds1 = new Environment(c, ctx, 0.3, 'bg', 0, -100);
  var clouds2 = new Environment(c, ctx, -0.1, 'bg', 700, -150);
  var clouds3 = new Environment(c, ctx, 0.1, 'bg', 300, -150);
  var clouds4 = new Environment(c, ctx, -0.05, 'bg', 200, 0);
  var ufo = new Environment(c, ctx, .5, 'ufo', -500, 0);
  var hero = new Hero(150, 250, ctx,'hero1');
  var background = new Images (0,0,ctx,'fg');
  // var log = new Images (0,0,ctx,'fg');
  gameLoop();

  function gameLoop(){
    ctx.clearRect(0,0,c.width,c.height);
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
    window.requestAnimationFrame(gameLoop);
  }

  ctx.drawImage(document.getElementById('hero1'), 200, 20);
  ctx.drawImage(document.getElementById('hero2'), 400, 100);
  ctx.drawImage(document.getElementById('hero3'), 600, 200);
};

var thing = document.getElementById('form1');
function onSubmit(event) {
  event.preventDefault();
  var text = event.target.userName.value;
  console.log(text);
  localStorage.name = text;

}

var collision = {
  t: tileSize,
  cTest: function (a,b){
    //call hero, target: val, xcol * t, y col *t
    //target:
    var c = a.x > b.x && a.x - a.width < b.x + tileSize && a.y > b.y && a.y - a.height < b.y + tileSize;
    if (c) console.log ('collision!!');
    return c;
  },

  cDir: function (a,b){
    //returns direction of collision - up 0, right 1, down 2, left 3
    //hero will be a
    var distanceX = (a.width + tileSize) / 2;
    var dir = undefined;
    if (distanceX => Math.abs((a.x + a.velX + a.width / 2) - b.x)){
      dir = 3;
    } else if (distanceX => Math.abs((a.x + a.velX - a.width / 2) - b.x - tileSize)){
      dir = 1;
    } else if (distanceX => Math.abs((a.y + a.velY + a.height / 2) - b.y)){
      dir = 0;
    } else if (distanceX => Math.abs((a.y + a.velY - a.height / 2) - b.y - tileSize)){
      dir = 2;
    }
    return dir;
  },
};

thing.addEventListener('submit',onSubmit);
