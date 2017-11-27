window.onload = function(){
  var c = document.getElementById('canvas');
  c.width = window.innerWidth;
  c.height = 600;

  var ctx = c.getContext('2d');

  var environment = new Environment(c, ctx);
  gameLoop();

  function gameLoop(){
    ctx.clearRect(0,0,c.width,c.height);
    environment.update();
    environment.render();
    window.requestAnimationFrame(gameLoop);
  }

  ctx.drawImage(document.getElementById('hero1'), 200, 20);
  ctx.drawImage(document.getElementById('hero2'), 400, 100);
  ctx.drawImage(document.getElementById('hero3'), 600, 200);
};

var Environment = function (c, ctx){
  this.c = c;
  this.ctx = ctx;
  this.bgPos = 0;
  this.fgPos = 0;
  this.bgSpeed = 2;
  this.bgWidth = 1024;
  this.bgImg = document.getElementById('bg');
};

Environment.prototype.update = function() {
  this.bgPos -= this.bgSpeed;
  if (this.bgPos < - this.bgWidth)
    this.bgPos = 0;
};
Environment.prototype.render = function() {
  for (let i = 0; i <= this.c.width / this.bgWidth + 1; i++)
    this.ctx.drawImage(this.bgImg, this.bgPos + i * this.bgWidth, 0);
};
