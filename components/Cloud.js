const randomNumber = (min, max) => Math.random() * max + min;

export class Cloud {
  constructor(posx, posy) {
    this.posX = posx;
    this.posY = posy;
    this.speed = randomNumber(2, 4);
  }

  isDespawn() {
    if (this.posX <= -(985 / 3)) return true;
    return false;
  }

  update() {
    this.posX -= this.speed;
  }

  draw(ctx) {
    const image1 = new Image();
    image1.src = '/assets/image/cloud.png';
    ctx.drawImage(image1, this.posX, this.posY, 985 / 3, 307 / 3);
  }
}

export default Cloud;
