let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = 960;
canvas.height = 640;
let city = new Image(960, 640);
city.src = 'assets/city.png';
let numbers = new Image(440, 86);
numbers.src = 'assets/numbers.png';
let walkingLeft = new Image(64, 384);
walkingLeft.src = 'assets/walkingLeft.png';
let walkingRight = new Image(64, 384);
walkingRight.src = 'assets/walkingRight.png';
let dead = new Image(64, 64);
dead.src = 'assets/dead.png';
let eatLeft = new Image(64, 384);
eatLeft.src = 'assets/eatLeft.png';
let eatRight = new Image(64, 384);
eatRight.src = 'assets/eatRight.png';
let apple = new Image(32, 32);
apple.src = 'assets/apple.png';
let banana = new Image(32, 32);
banana.src = 'assets/banana.png';
let orange = new Image(32, 32);
orange.src = 'assets/orange.png';
let peach = new Image(32, 32);
peach.src = 'assets/peach.png';
let pear = new Image(32, 32);
pear.src = 'assets/pear.png';
let pineapple = new Image(32, 32);
pineapple.src = 'assets/pineapple.png';
let sound = document.getElementById("sound");
sound.loop = true;
sound.play();
let food = [apple, banana, orange, peach, pear, pineapple];
let keys = [];
let diff = 5;
let dieCount = 0;
let friction = 0.8;
let fallingObjs = [];
let itemEating = null;
let forward = false;
let min = 0;
let player = {
  x: 100,
  y: 588,
  velX: 0,
  maxSpd: 3,
  stack: []
};
let count = 0;
let eatPercent = 0
let playing = true;
let eating = false;

function update() {
  ctx.clearRect(0, 0, 3200, 3200);
  ctx.drawImage(city, 0, 0, 960, 640);
  ctx.fillStyle = '#ff3399';
  ctx.fillRect(0, 112, 960, 6);
  eating = false;
  if(playing) {
    score = Math.floor(count / 10);
  }
  let scoreArr = (score + "").split('');
  for (let i = 0; i < scoreArr.length; i++) {
    ctx.drawImage(numbers, 0 + 44 * parseInt(scoreArr[i]), 0, 44, 86, 5 + 44 * i, 5, 44, 86);
  }

  if (player.stack.length >= 26) {
    playing = false;
    let sprite = dead;
    ctx.drawImage(sprite,player.x, player.y, 64, 64);
  } else {


    if (keys[32] && (player.stack.length !== 0 || itemEating) && playing) {
      eating = true;
      if (!itemEating) {
        itemEating = player.stack.shift();
      }
      if (player.velX >= 0) {
        ctx.drawImage(itemEating, player.x + 34, player.y, 32, 32)
      } else {
        ctx.drawImage(itemEating, player.x - 4, player.y, 32, 32)
      }
      eatPercent += 0.015;
      if (eatPercent >= 1) {
        itemEating = null;
        eatPercent = 0;
      }
      ctx.fillStyle = "black";
      ctx.fillRect(98, 518, 764, 54);
      ctx.fillStyle = "darkgray";
      ctx.fillRect(100, 520, 760, 50);
      ctx.fillStyle = "gray";
      ctx.fillRect(120, 530, 720 * eatPercent, 30);
    } else {
      eatPercent = 0;
      if (itemEating) {
        player.stack.unshift(itemEating)
        itemEating = null;
      }
    }

    if (keys[39] && !keys[32] && playing) {
      // right arrow
      if (player.velX < player.maxSpd && player.x < 896) {
        player.velX++;
      }
    }
    if (keys[37] && !keys[32] && playing) {
      // left arrow
      if (player.velX > -player.maxSpd  && player.x > 0) {
        player.velX--;
      }
    }

    //physics movement
    player.velX *= friction;
    player.x += player.velX;
    let sprite = player.velX >= 0 ? walkingRight : walkingLeft;
    if (keys[32] && (player.stack.length !== 0 || itemEating)) {
      sprite = player.velX >= 0 ? eatRight : eatLeft;
    }
    if (Math.abs(player.velX) <= 0.5 && !eating) {
      ctx.drawImage(sprite, 0, 0, 64, 64, player.x, player.y, 64, 64);
    } else {
      ctx.drawImage(sprite, Math.floor(count / 4) % 6 * 64, 0, 64, 64, player.x, player.y, 64, 64);
    }
  }
  let itemOffset = player.velX >= 0 ? 5 : 27;
  let shake = 3 - count % 7;
  let stackMulti = player.stack.length > 18 ? 18 : player.stack.length;
  for (let i = 0; i < player.stack.length; i++) {
    ctx.drawImage(player.stack[i], player.x + itemOffset + (Math.sin(shake + i) * player.velX * stackMulti * 0.08), (player.y - i * 20) + 2, 32, 32);
  }
  count++;

  if(count > 500) {
    diff = 4;
  }
  if(count > 2000) {
    diff = 3;
  }
  if(count > 5000) {
    diff = 2;
  }
  if(count > 10000) {
    diff = 1;
  }
  if (count % diff === 0) {
    fallingObjs.push({
      x: Math.floor(Math.random() * 980) - 10,
      y: 0,
      item: food[Math.floor(Math.random() * 6)]
    })
  }

  fallingObjs.forEach(obj => {
    ctx.drawImage(obj.item, obj.x, obj.y, 32, 32);
    obj.y += 5;
    if (obj.x < player.x + 36 &&
      obj.x + 4 > player.x &&
      obj.y < player.y + 32 &&
      obj.y + 24 > player.y - player.stack.length * 20) {
      fallingObjs.splice(fallingObjs.indexOf(obj), 1);
      //player.stack.splice(Math.floor((obj.y-player.y)/20),0,obj.item);
      player.stack.push(obj.item);
    }

    if (obj.y > 640) {
      fallingObjs.splice(fallingObjs.indexOf(obj), 1);
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
