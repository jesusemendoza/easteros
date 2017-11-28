var Hero = function(x, y, ctx){
  this.x = x;
  this.y = y;
  this.ctx = ctx;
  this.velY = 0;
  this.velX = 0;
  this.width = 128;
  this.height = 128;
  this.sprites = document.getElementById('hero1');
  var self = this;
  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 38){
      self.velY = -10;
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
  if (this.velX < xSpeedStep){
    this.x += this.velX;
    this.velX += xSpeedStep;
  } else if (this.velX > xSpeedStep) {
    this.x += this.velX;
    this.velX += -xSpeedStep;
  } else {this.velX = 0;}
};

Hero.prototype.render = function(){
  let renderX = this.x - this.width / 2;
  let renderY = this.y - this.height / 2;
  this.ctx.drawImage(this.sprites, renderX, renderY);
};
