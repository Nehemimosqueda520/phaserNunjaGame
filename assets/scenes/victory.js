export default class Victory extends Phaser.Scene {

    constructor() {
        super("victory");
    }

     init() {}

  preload() {
    this.load.image("sky", "./assets/images/Cielo.png");
  }

  create() {
    this.add.image (400, 300, "sky").setScale(0.555);

    // add text
    this.scoreText = this.add.text(300, 300, "You Won", {
     fontFamily: "Times New Roman",
     fontSize: "50px",
     fill: "#31B905",

  });
 }

  update() {}
}