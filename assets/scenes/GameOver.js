export default class GameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");
  }

  init() {}

  preload() {
    this.load.image("sky", "./assets/images/Cielo.png");
  }

  create() {

    this.add.image (400, 300, "sky").setScale(0.555);

     // add text
     this.scoreText = this.add.text(300, 300, "Game Over", {
      fontFamily: "Times New Roman",
      fontSize: "50px",
      fill: "#EA0D0D",
    });
  }

  update() {}
}
