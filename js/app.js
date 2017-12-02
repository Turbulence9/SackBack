let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = 960;
canvas.height = 640;
let keys = [];
let friction = 0.8;
let fallingObjs = [];
let player = {
  x : 100,
  y : 608,
  velX : 0,
  maxSpd : 3,
  stack : []
};
let count = 0;

function update() {
if (keys[39]) {
  // right arrow
  if (player.velX < player.maxSpd) {
    player.velX++;
  }
}
if (keys[37]) {
  // left arrow
  if (player.velX > -player.maxSpd) {
    player.velX--;
  }
}
//physics movement
player.velX *= friction;
player.x += player.velX;

ctx.fillStyle = "gray";
ctx.clearRect(0, 0, 3200, 3200);
ctx.fillRect(player.x, player.y, 32, 32);
if (player.velX >= 0) {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x-32, player.y, 32, 32);
  ctx.fillStyle = "purple";
  for (let i = 0; i < player.stack.length; i++) {
    ctx.fillRect(player.x-28 - player.velX * Math.pow(i,2)/10, player.y-24 - i * 24, 24, 24);
  }
} else {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x+32, player.y, 32, 32);
  ctx.fillStyle = "purple";
  for (let i = 0; i < player.stack.length; i++) {
    ctx.fillRect(player.x+36 - player.velX * Math.pow(i,2)/10, player.y-24 - i * 24, 24, 24);
  }
}

count++;

if (count % 20 === 0) {
  fallingObjs.push({x:Math.floor(Math.random() * 940) + 20, y: 0})
}

fallingObjs.forEach(obj => {
  ctx.fillStyle = "purple";
  ctx.fillRect(obj.x, obj.y, 24, 24);
  obj.y++;
  if(obj.x < player.x + 32 &&
     obj.x + 24 > player.x &&
     obj.y < player.y + 32 &&
     obj.y + 24 > player.y) {
       fallingObjs.splice(fallingObjs.indexOf(obj),1);
       player.stack.push(0);
     }

  if(obj.y > 640) {
    fallingObjs.splice(fallingObjs.indexOf(obj),1);
  }
});

requestAnimationFrame(update);
}

document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

window.addEventListener("load", function() {
  update();
});
