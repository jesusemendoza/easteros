var Hero = function(x, y, ctx){
  this.x = x;
  this.y = y;
  this.ctx = ctx;
  this.velY = 0;
  this.width = 128;
  this.height = 128;
  this.sprites = document.getElementById('hero1');
  var self = this;
  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 38){
      self.velY = -20;
    }
  });
};

Hero.prototype.update = function(){
  this.y += this.velY;
  this.velY += 1;
};

Hero.prototype.render = function(){
  let renderX = this.x - this.width / 2;
  let renderY = this.y - this.height / 2;
  this.ctx.drawImage(this.sprites, renderX, renderY);
};
