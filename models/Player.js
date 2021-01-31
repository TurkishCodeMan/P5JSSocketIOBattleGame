const { uuid } = require("uuidv4");
const Gun = require("./Gun");


class Player {
  id = uuid();
  x = Math.floor(Math.random() * 400 + 50);
  y = Math.floor(Math.random() * 400 + 50);
  width = 100;
  height = 100;
  speed = 2;
  maxSpeed = 5;
  angle = 0;//Açı duruş açısı
  acc = 0.5;
  dirX = 0;
  dirY = 0;
  type = Math.floor(Math.random() * 4);
  health = 50;
  changeHealth = 5;

  gun = new Gun(this.x, this.y, 'AK-47');

  pickedDrops = {
    guns: []
  };
  constructor(socketid, nickName, layers) {
    this.socketID = socketid;
    this.nickName = nickName;
    this.layers = layers;
  }

  speedUp() {
    this.dirX = 0;
    this.dirY = -7;
  }
  speedDown() {
    this.dirX = 0;
    this.dirY = 7;
  }
  steerLeft() {
    this.dirX = 7;
    this.dirY = 0;

  }
  steerRight() {
    this.dirX = -7;
    this.dirY = 0;
  }
  stop() {
    this.dirX = 0;
    this.dirY = 0;
  }


  fire(targetX, targetY) {
    //Her firede ekrana bir ellipse;,
    //targetX merminin gideceği koordinatlar
    let ammo = {

      x: this.x,
      y: this.y,
    }


    if (!this.gun.bullets.find(p => p.x != ammo.x)) {
      this.gun.bullets.push(ammo)
      return this.gun.fire(targetX, targetY);
    }



  }

  isDropPicked(dropX, dropY) {
    let subX = Math.abs(dropX) - Math.abs(this.x);
    let subY = Math.abs(dropY) - Math.abs(this.y);

    if ((subX >= 0 && subX <= 10) && (subY >= 0 && subY <= 10)) {
      return true;
    }
    return false;
  }


  isSolidTile(targetX, targetY) {

    const startTileY = Math.floor(targetX / 64);
    const startTileX = Math.floor(targetY / 64);
    if (this.layers[0][startTileX][startTileY] == 1) {
      return true;
    }
    return false;
  }


  update() {
    //Hedeflenen X ve Y
    let targetX = this.x + this.dirX;
    let targetY = this.y + this.dirY;

    this.gun.x = targetX;
    this.gun.y = targetY




    if (!this.isSolidTile(targetX, targetY)) {
      this.x = targetX
      this.y = targetY
      this.dirX = 0;
      this.dirY = 0;
    }


  }

}

module.exports = Player;