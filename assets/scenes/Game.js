// import ENUMS from "../utils.js";
import {
  PLAYER_MOVEMENTS,
  SHAPE_DELAY,
  SHAPES,
  TRIANGULO,
  ROMBO,
  CUADRADO,
  BOMB,
} from "../../utils.js";

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  init() {
    this.shapesRecolected = {
      ["Triangulo"]: { count: 0, score: 0 },
      ["Cuadrado"]: { count: 0, score: 0 },
      ["Rombo"]: { count: 0, score: 0 },
      ["Bomb"]: { score: 0 },	
    };

    this.isWinner = false;
    this.isGameOver = false;

    this.timer = 30;

    this.score = 0;
  }

  preload() {
    // cargar fondo, plataformas, formas, jugador
    this.load.image("sky", "./assets/images/Cielo.png");
    this.load.image("platform", "./assets/images/platform.png");
    this.load.image("player", "./assets/images/Ninja.png");
    this.load.image(TRIANGULO, "./assets/images/Triangulo.png");
    this.load.image(ROMBO, "./assets/images/Rombo.png");
    this.load.image(CUADRADO, "./assets/images/Cuadrado.png");
    this.load.image(BOMB, "./assets/images/bomb.png");
  }

  create() {
    // create game objects
    // add sky background
    this.add.image(400, 300, "sky").setScale(0.555);

    // add text
    this.scoreText = this.add.text(16, 16, "C: 0 / T: 0 / R: 0", {
      fontSize: "20px",
      fill: "#FDFDFD",
    });

    //add score text for this.score
    this.scoreTexts = this.add.text(16, 50, "Score: 0", {
      fontSize: "20px",
      fill: "#FDFDFD",
    });

    this.timeText = this.add.text(770, 16, this.timer, {
      fontSize: "20px",
      fill: "#FDFDFD",
    })
    // agregado con fisicas
    // add sprite player
   

    // add platforms static group
    this.platformsGroup = this.physics.add.staticGroup();
    this.platformsGroup.create(400, 568, "platform").setScale(2).refreshBody();
    this.platformsGroup.create(800, 375, "platform").setScale(2).refreshBody();
    this.platformsGroup.create(0, 175, "platform").setScale(2).refreshBody(); 

    this.player = this.physics.add.sprite(400, 500, "player");
    this.player.setCollideWorldBounds(true);

    // add collider between player and platforms
    this.physics.add.collider(this.player, this.platformsGroup);
    
    


    // add shapes group

    this.shapesGroup = this.physics.add.group();
    
    
    
    

    

    // add collider between platforms and shapes
    // add overlap between player and shapes
    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectShape, // funcion que llama cuando player choca con shape
      null, //dejar fijo por ahora
      this //dejar fijo por ahora
    );

    // create cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // create event to add shapes
    this.time.addEvent({
      delay: SHAPE_DELAY,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.addTime,
      callbackScope: this,
      loop: true,
    });

    this.shapesGroup.children.iterate((shape) => {
      shape.body.setBounce(1);
      shape.score = 3; // Puntos iniciales para las formas
    });
  
    // add collider between shapes and platforms
    this.physics.add.collider(this.shapesGroup, this.platformsGroup, (shape) => {
      shape.score -= 1;
      console.log(shape.score); // Descontar 1 punto al rebotar con el piso
  
      if (shape.score <= 0) {
        shape.disableBody(true, true); // Desaparecer si llega a 0 puntos
      }
    });
    
  }

  update() {
    // update game objects
    // check if not game over or win
    if (this.isWinner) {
      this.scene.start("victory");
    }

    if (this.isGameOver) {
      this.scene.start ("gameOver");
    }

    // update player left right movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_MOVEMENTS.x);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_MOVEMENTS.x);
    } else {
      this.player.setVelocityX(0);
    }

    // update player jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-PLAYER_MOVEMENTS.y);

     
    }

    
  }

  collectShape(jugador, figuraChocada) {
    // remove shape from screen
    const shapeName = figuraChocada.texture.key;
    
    console.log("figura recolectada");
    figuraChocada.disableBody(true, true);


    this.shapesRecolected[shapeName].count++;
    

    //increment score for TRIANGULO 10
    if (shapeName === TRIANGULO) {
      this.shapesRecolected[TRIANGULO].score += 10;
    }

    //increment score for ROMBO 15
    if (shapeName === ROMBO) {
      this.shapesRecolected[ROMBO].score += 15;
    }

    //increment score for CUADRADO 20
    if (shapeName === CUADRADO) {
      this.shapesRecolected[CUADRADO].score += 20;
    }

    if (shapeName === BOMB && this.score > 0) {
      this.shapesRecolected[BOMB].score -= 10;
    }

    if (shapeName === TRIANGULO || shapeName === CUADRADO || shapeName === ROMBO) {
      this.shapesRecolected[shapeName].score -= 1;
    }

    
    
  
    


    // update score text

    this.scoreText.setText(
      `C: ${this.shapesRecolected[CUADRADO].count} / T: ${this.shapesRecolected[TRIANGULO].count} / R: ${this.shapesRecolected[ROMBO].count} `
    );
    //check if winner
    //collect two of each shape


    this.score = this.shapesRecolected[ROMBO].score + this.shapesRecolected[TRIANGULO]. score + this.shapesRecolected[CUADRADO]. score + this.shapesRecolected[BOMB]. score;
    


      //update scoretexts
      this.scoreTexts.setText(
        `Score: ${this.score}  `
      );

    
  
      console.log(this.shapesRecolected);
  
    if (
      this.shapesRecolected[CUADRADO].count >= 2 &&
      this.shapesRecolected [TRIANGULO]. count >= 2 &&
      this.shapesRecolected[ROMBO]. count >= 2 &&
      this.score >= 100
     ) {
      this.isWinner = true
    }

    console.log(this.score);
  }

  addTime(){
    this.timer -= 1;
    this.timeText.setText(`${this.timer}`);
    if (this.timer === 0) {
      this.isGameOver = true;
    }
   
  }

  addShape() {
    // get random shape
    const randomShape = Phaser.Math.RND.pick(SHAPES);
  
    // get random position x
    const randomX = Phaser.Math.RND.between(0, 800);
  
    // add shape to screen
    const shape = this.shapesGroup.create(randomX, 0, randomShape);
  
    console.log("shape is added", randomX, randomShape);
    shape.body.setBounce(0.5);
  }


}
