window.onload = function(){
  var c = document.getElementById('canvas');
  c.width = window.innerWidth;
  c.height = 600;

  var ctx = c.getContext('2d');
  var environment = new Environment(c, ctx);
  var hero = new Hero(150, 250, ctx);
  gameLoop();

  function gameLoop(){
    ctx.clearRect(0,0,c.width,c.height);
    environment.update();
    environment.render();
    renderLevel();
    hero.update();
    hero.render();
    window.requestAnimationFrame(gameLoop);
  }

  ctx.drawImage(document.getElementById('hero1'), 200, 20);
  ctx.drawImage(document.getElementById('hero2'), 400, 100);
  ctx.drawImage(document.getElementById('hero3'), 600, 200);
};
