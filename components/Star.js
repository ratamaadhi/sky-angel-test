const Star = (posX, posY) => {
  const randomNumber = (min, max) => Math.random() * max + min;
  const x = posX;
  let y = posY;
  const speed = randomNumber(3, 5);
  let ending = false;

  const isDead = () => {
    if (ending) return true;
    if (x <= -(369 / 6)) return true;
    return false;
  };

  const update = (aircraft) => {
    if (ending) return;
    y += speed;

    if (!ending && isDead()) {
      ending = true;
    }

    if (!ending) {
      if (
        Math.abs(aircraft.posX - x) < 335 / 6 &&
        Math.abs(aircraft.posY - y) < 369 / 6
      ) {
        ending = true;
        aircraft.increaseStar();
      }
    }
  };

  const draw = (ctx) => {
    const image1 = new Image();
    image1.src = '/assets/image/star.png';
    ctx.drawImage(image1, x, y, 335 / 6, 369 / 6);
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

export default Star;
