'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'white';

let state;

class Rect {
  w = 150;
  h = 30;
  constructor(x) {
    this.x = x;
  }
}
const rect = new Rect();

class RectRow1 extends Rect {
  y = 50;
}

class RectRow2 extends Rect {
  y = 90;
}

class RectRow3 extends Rect {
  y = 130;
}

const drawCircle = function () {
  ctx.beginPath();
  ctx.arc(state.circle.x, state.circle.y, state.circle.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};

const drawRectangles = function () {
  state.rectangles.forEach(rect => {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.fill();
    ctx.closePath();
  });
};

const drawPaddle = function () {
  ctx.beginPath();
  ctx.rect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h);
  ctx.fill();
  ctx.closePath();
};

const drawScore = function () {
  ctx.font = '24px sans-serif';
  ctx.fillText(`Score: ${state.score}`, 48, 24);
};

canvas.addEventListener('mousemove', function (e) {
  if (e.offsetX - 75 <= 0) state.paddle.x = 0;
  else if (e.offsetX + 75 >= canvas.width)
    state.paddle.x = canvas.width - state.paddle.w;
  else state.paddle.x = e.offsetX - 75;
});

const clearCanvas = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const init = function () {
  state = {
    circle: {
      x: 200,
      y: 200,
      size: 20,
      dx: 7,
      dy: 9,
    },

    rectangles: [],

    paddle: {
      x: 0,
      y: canvas.height - 20,
      w: 180,
      h: 20,
    },

    score: 0,
  };

  let i = 150;
  while (i + rect.w < canvas.width - 150) {
    state.rectangles.push(new RectRow1(i), new RectRow2(i), new RectRow3(i));
    i += rect.w + 15;
  }
  clearCanvas();
  drawCircle();
  drawRectangles();
  drawPaddle();
  drawScore();
};

init();

const update = function () {
  clearCanvas();
  drawCircle();
  drawRectangles();
  drawPaddle();
  drawScore();

  // Collision detection
  if (
    state.circle.x + state.circle.size > canvas.width ||
    state.circle.x - state.circle.size < 0
  )
    state.circle.dx *= -1;
  if (state.circle.y - state.circle.size < 0) state.circle.dy *= -1;

  state.rectangles.forEach(object => {
    if (
      state.circle.x > object.x &&
      state.circle.x < object.x + object.w &&
      state.circle.y > object.y &&
      state.circle.y < object.y + object.h
    ) {
      // Bounce off
      state.circle.dy *= -1;

      // Delete rectangle
      ctx.clearRect(object.x, object.y, object.w, object.h);
      const index = state.rectangles.findIndex(
        rect => rect.x === object.x && rect.y === object.y
      );
      state.rectangles.splice(index, 1);
      state.score++;
      if (state.rectangles.length === 0) {
        alert('YOU WON THE GAME!!!');
        init();
      }
    }
  });

  if (state.circle.y + state.circle.size > canvas.height) {
    if (
      state.circle.x > state.paddle.x &&
      state.circle.x < state.paddle.x + state.paddle.w
    ) {
      // Bounce off

      state.circle.dy *= -1;
    } else {
      alert('You lose!');
      init();
    }
  }

  state.circle.x += state.circle.dx;
  state.circle.y += state.circle.dy;

  requestAnimationFrame(() => {
    update(state.circle);
  });
};

update(state.circle);
