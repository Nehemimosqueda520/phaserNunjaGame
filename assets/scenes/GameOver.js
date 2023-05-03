export default class GameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");
  }

  init() {}

  preload() {
    this.load.image("sky", "./assets/images/Cielo.png");
    //load platform specific
    this.load.image("platform", "./assets/images/platform.png");
    
  }

  create() {

    this.add.image (400, 300, "sky").setScale(0.555);

    this.platformsGroup = this.physics.add.staticGroup();
    this.platformsGroup.create(400, 568, "platform").setScale(2).refreshBody();



     // add text
     this.scoreText = this.add.text(300, 300, "Game Over", {
      fontFamily: "Times New Roman",
      fontSize: "50px",
      fill: "#EA0D0D",
    });
  }

  update() {}
}
