const Parachute = (posX, posY) => {
  const randomNumber = (min, max) => Math.random() * max + min;
  const x = posX;
  let y = posY;
  const speed = randomNumber(3, 5);
  let ending = false;

  const isDead = () => {
    if (ending) return true;
    if (x <= -(231 / 8)) return true;
    return false;
  };

  const update = (aircraft) => {
    if (ending) return;
    y += speed;

    if (!ending && isDead()) {
      ending = true;
    }

    if (!ending) {
      // console.log('x', x);
      // console.log('y', y);
      // console.log('Math.abs(aircraft.posX - x)', Math.abs(aircraft.posX - x));
      // console.log('Math.abs(aircraft.posY - y)', Math.abs(aircraft.posY - y));
      if (
        Math.abs(aircraft.posX - x) < 347 / 8 &&
        Math.abs(aircraft.posY - y) < 350 / 8
      ) {
        ending = true;
        aircraft.increaseFuel();
      }
    }
  };

  const draw = (ctx) => {
    const image1 = new Image();
    image1.src = '/assets/image/prct1.png';
    ctx.drawImage(image1, x, y, 347 / 8, 350 / 8);
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

export default Parachute;
