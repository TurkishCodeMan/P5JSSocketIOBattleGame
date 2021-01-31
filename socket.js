const socket = require("socket.io");
const DropGun = require("./models/DropGun");
const Game = require("./models/Game");
const io = socket();
const socketApi = { io };

const Player = require("./models/Player");

let players = [];
let dropsInGame = {
    guns: [],
};
let game = new Game();
io.on("connection", (socket) => {
    console.log("Connection Socket");

    socket.on("newUser", (data) => {
        let player = new Player(socket.id, data.nickName, data.layers);
        game.players.push(player);
        socket.emit("loginUser", player);
    })

    game.dropAdd();
    //Ana update oyun döngüsü
    let interval = setInterval(() => {
        io.emit("GAME_UPDATE", game)
        game.updateGame(socket);
    

    }, 1000 / 30)


    ///Car Moving Drawing To Screen
    socket.on("speedUp", (player) => {
        let c = game.players.find(p => player.id === p.id);
        c.speedUp();
    })
    socket.on("speedDown", (player) => {

        let c = game.players.find(p => player.id === p.id);
        c.speedDown();

    })
    socket.on("steerLeft", (player) => {
        let c = game.players.find(p => player.id === p.id);
        c.steerLeft();
    })
    socket.on("steerRight", (player) => {
        let c = game.players.find(p => player.id == p.id);
        c.steerRight();


    });
    socket.on("stopCar", (player) => {
        let c = game.players.find(p => player.id == p.id);
        c.stop();
        c.update();

    });

    socket.on("fire", (data) => {
        let c = game.players.find(p => data.player.id == p.id);
        c.fire(data.mouseX, data.mouseY);
    });

    socket.on("disconnect", () => {
        clearInterval(interval);
        game.players = game.players.filter(u => u.socketID != socket.id);

    });

})

module.exports = socketApi;