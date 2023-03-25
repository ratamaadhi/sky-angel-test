const Parachute = (posX, posY) => {
  const audio = new Audio('/assets/audio/get-fuel.mp3');
  audio.currentTime = 1.5;
  const randomNumber = (min, max) => Math.random() * max + min;
  const x = posX;
  let y = posY;
  const speed = randomNumber(3, 5);
  let ending = false;

  const isDead = () => {
    if (ending) return true;
    if (x <= -(1190 / 12)) return true;
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
        Math.abs(aircraft.posX - x) < 986 / 12 &&
        Math.abs(aircraft.posY - y) < 1190 / 12
      ) {
        ending = true;
        audio.play();
        aircraft.increaseFuel();
      }
    }
  };

  const draw = (ctx) => {
    const image1 = new Image();
    image1.src = '/assets/image/prct2.png';
    ctx.drawImage(image1, x, y, 986 / 12, 1190 / 12);
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
