export class Aircraft {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.fuel = 10;
    this.speed = 25;
    this.time = 0;
    this.star = 0;
    this.ending = false;
  }

  decreaseFuel() {
    this.fuel -= 1;
  }

  increaseFuel() {
    this.fuel += 10;
  }

  increaseStar() {
    this.star += 1;
  }

  gameOver(_star) {
    // eslint-disable-next-line
    this;
    document.body.innerHTML = `
    <center>
    <br/>
    <h2>Game Over!</h2>
    <p>Your Score: ${_star}</p>
    <button class="bg-red-400 rounded-md px-3 py-2 mt-2 text-white" onClick="location.reload()">Again</button>
    </center>
    `;
  }

  update() {
    document.onkeydown = (e) => {
      if (e.keyCode === 39) {
        if (this.posX + this.speed < 953) {
          this.posX += this.speed;
        }
      }
      if (e.keyCode === 37) {
        if (this.posX - this.speed >= 0) {
          this.posX -= this.speed;
        }
      }

      if (e.keyCode === 38) {
        if (this.posY - this.speed > 0) {
          this.posY -= this.speed;
        }
      }
      if (e.keyCode === 40) {
        if (this.posY + this.speed < 734) {
          this.posY += this.speed;
        }
      }
    };

    if (this.fuel <= 0) {
      this.ending = true;
      this.gameOver(this.star);
    }
  }

  draw(ctx) {
    const image = new Image();
    image.src = '/assets/image/image-airplane.png';
    ctx.drawImage(image, this.posX, this.posY, 340 / 4, 200 / 4);

    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Fuel: ${this.fuel}`, 15, 75);

    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Star: ${this.star}`, 15, 95);
  }
}

export default Aircraft;
