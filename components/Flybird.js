const randomNumber = (min, max) => Math.random() * max + min;

const Flybird = (posX, posY) => {
  let x = posX;
  const y = posY;
  const speed = randomNumber(3, 5);
  let ending = false;

  const setImage = () => {
    const image1 = new Image();
    image1.src = '/assets/image/bird-pixel1.png';
    const image2 = new Image();
    image2.src = '/assets/image/bird-pixel2.png';
    const image = y < 768 / 2 ? image2 : image1;
    const width = y < 768 / 2 ? 350 / 8 : 351 / 8;
    const height = y < 768 / 2 ? 276 / 8 : 231 / 8;
    return {
      image,
      height,
      width,
    };
  };

  const isDead = () => {
    if (x <= -setImage().height) return true;
    return false;
  };

  const update = (aircraft) => {
    if (ending) return;
    x -= speed;

    if (!ending && isDead()) {
      ending = true;
    }

    if (!ending) {
      if (
        Math.abs(aircraft.posX - x) < setImage().width &&
        Math.abs(aircraft.posY - y) < setImage().height
      ) {
        ending = true;
        aircraft.gameOver(aircraft.star);
      }
    }
  };

  const draw = (ctx) => {
    const birdImg = setImage();
    ctx.drawImage(birdImg.image, x, y, birdImg.width, birdImg.height);
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
