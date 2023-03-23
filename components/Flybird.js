const Flybird = (posX, posY) => {
  let x = posX;
  const y = posY;
  const speed = 5;
  let ending = false;

  const isDead = () => {
    if (x <= -(231 / 8)) return true;
    return false;
  };

  const update = (aircraft) => {
    if (ending) return;
    x -= speed;

    if (!ending && isDead()) {
      ending = true;
    }

    if (!ending) {
      // console.log('x', x);
      // console.log('y', y);
      // console.log('Math.abs(aircraft.posX - x)', Math.abs(aircraft.posX - x));
      // console.log('Math.abs(aircraft.posY - y)', Math.abs(aircraft.posY - y));
      if (
        Math.abs(aircraft.posX - x) < 351 / 8 &&
        Math.abs(aircraft.posY - y) < 231 / 8
      ) {
        ending = true;
        aircraft.gameOver(aircraft.star);
      }
    }
  };

  const draw = (ctx) => {
    const image1 = new Image();
    image1.src = '/assets/image/bird-pixel1.png';
    ctx.drawImage(image1, x, y, 351 / 8, 231 / 8);
  };
  return {
    ending,
    speed,
    posX: x,
    posY: y,
    update,
    draw,
    isDead,
  };
};

export default Flybird;
