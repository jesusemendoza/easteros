window.onload = function(){
  var c = document.getElementById('canvas');
  c.width = window.innerWidth;
  c.height = 600;

  var ctx = c.getContext('2d');

  ctx.fillRect(100, 200, 400, 150);

// var hero1 = new Image();
// hero1.src = 'img/mario.png';
// hero1.onload = function(){
//   ctx.drawImage(hero1, 500, 200);
// };

};
