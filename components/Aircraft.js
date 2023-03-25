export class Aircraft {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.fuel = 10;
    this.speed = 25;
    this.time = 0;
    this.star = 0;
    this.ending = false;
    this.isStart = true;
    this.audioS = '';
    this.audioE = '';
  }

  audioStart() {
    this.audioS = new Audio('/assets/audio/start.mp3');
    this.audioS.loop = true;
    this.audioS.play();
    return this.audioS;
  }

  audioEnd() {
    this.audioE = new Audio('/assets/audio/game-over.mp3');
    return this.audioE;
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

  increaseTime() {
    this.time += 1;
  }

  gameOver(_star) {
    this.ending = true;
    this.audioS.pause();
    this.audioE.play();
  }

  startPauseGame() {
    this.isStart = !this.isStart;
    if (this.isStart) {
      this.audioS.play();
    } else {
      this.audioS.pause();
    }
  }

  newGames() {
    this.ending = false;
    this.time = 0;
    this.star = 0;
    this.fuel = 10;
    this.audioStart();
    this.audioEnd();
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
      if (e.keyCode === 32 && !this.ending) {
        this.startPauseGame();
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
    ctx.fillText(`Time: ${this.time}`, 15, 55);

    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Fuel: ${this.fuel}`, 15, 75);

    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Star: ${this.star}`, 15, 95);
  }
}

export default Aircraft;
