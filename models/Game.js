const DropGun = require("./DropGun");

class Game {
    players = [];
    dropsInGame = {
        guns: []
    }

    //Ana Oyun Döngüsü
    updateGame(socket) {
        this.players.forEach((player) => {
            this.shotControl(player, socket);
            this.dropPickedControl(player);
            player.update();
        });
    }
    dropAdd() {
        let dropGun;
        setInterval(() => {
            if (this.dropsInGame.guns.length < 1) {
                let types=["AWP","AK-47","Tabanca"]
                dropGun = new DropGun(types[Math.floor(Math.random()*3)]);
                this.dropsInGame.guns.push(dropGun);
                setTimeout(() => {
                    if (this.dropsInGame.guns.length > 0) {
                        this.dropsInGame.guns.splice(this.dropsInGame.guns.findIndex(p => p.x == dropGun.x), 1);
                        dropGun = {};
                    }
                }, 8000)
            }
        }, 5000)

    }

    dropPickedControl(player) {
        if (this.dropsInGame.guns.length > 0) {
            this.dropsInGame.guns.forEach(p => {
                //  console.log(p.x,player.x)
                if (player.isDropPicked(p.x, p.y)) {
                    player.gun.type=p.type;
                }
            })
        }
    }

    shotControl(player, socket) {
        //Ateş Edildiğinde Vurma Kontrol
        if (player.gun.bullets.length > 0) {

            //Bizim Dışımızdaki Oyuncular
            let playerrs = this.players.filter(p => p.socketID != player.socketID);

            for (let i = 0; i < playerrs.length; i++) {

                let subX = player.gun.bullets[0].x - playerrs[i].x;
                let subY = player.gun.bullets[0].y - playerrs[i].y;

                if ((Math.abs(subX) >= 0 && subX <= 5) && (subY >= 0 && subY <= 20)) {

                    //Vurulma Anı sadece bir kez çalışmalı
                    if (playerrs[i].health >= 0) {
                        console.log(playerrs[i].nickName)
                        let index = this.players.findIndex(p => p.id == playerrs[i].id);



                        //Hangi Silahla Vuruldugunun Kontrolü
                        if (player.gun.type.name == 'Tabanca') {
                            return this.players[index].health = this.players[index].health - player.gun.type.damage;
                        }
                        if (player.gun.type.name == 'AK-47') {
                            return this.players[index].health = this.players[index].health - player.gun.type.damage;
                        }
                        if (player.gun.type.name == 'AWP') {
                            return this.players[index].health = this.players[index].health - player.gun.type.damage;
                        }


                    }
                    if (playerrs[i].health <= 0) {
                        if (socket.id == playerrs[i].socketID) {
                            socket.disconnect();
                            //this.players.splice(this.players.findIndex(p => p.socketID == socket.id), 1);
                        }
                    }

                }
            }
        }
    }
}

module.exports = Game;