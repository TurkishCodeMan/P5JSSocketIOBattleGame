let b1;
let b2;
let canvasWidth = 900;
let canvasHeight = 640;
let tileWidth = 64;
let tileHeight = 64;
let player;
let players = [];
let dropsInGame = {
    guns: []
}
let sounds = {}
let images;
let layers = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    ]


]
let nickName;
let socket = io.connect("https://battle-game.netlify.app/", { transports: ['websocket'] });
const drawGame = () => {
    const cols = Math.floor(canvasWidth / tileWidth) //14
    const rows = Math.floor(canvasHeight / tileHeight); //10
    for (var i = 0; i < layers.length; i++) {
        const layer = layers[i];
        for (var j = 0; j < cols; j++) {

            for (let k = 0; k < rows; k++) {
                const imageType = layer[k][j];
                if (images.image[imageType] != undefined) {
                    image(images.image[imageType], j * tileWidth, k * tileHeight, tileWidth, tileHeight,
                        0, 0,
                        tileWidth, tileHeight)
                }

            }


        }
    }
}


async function preload() {
    //Load Assets İmages
    let image1 = await loadImage("assets/1.png");
    let image0 = await loadImage("assets/0.png");
    let model1 = await loadImage("assets/model1.png");
    let model2 = await loadImage("assets/model2.png");
    let model3 = await loadImage("assets/model3.png");
    let model4 = await loadImage("assets/model4.png");

    //Guns
    let pistol = await loadImage("assets/pistol.png");
    let ak = await loadImage("assets/ak.png");
    let sniper = await loadImage("assets/sniper.png");


    //Sounds
    soundFormats('mp3', 'ogg');
    let akSound = loadSound("sounds/ak.mp3");
    let awpSound = loadSound("sounds/awp.mp3");
    let pistolSound = loadSound("sounds/pistol.mp3");

    sounds.gunSounds = {
        "ak": akSound,
        "sniper": awpSound,
        "pistol": pistolSound
    }

    images = {
        image: {
            0: image0,
            1: image1
        },
        models: {
            0: model1,
            1: model2,
            2: model3,
            3: model4,
        },
        guns: {
            "pistol": pistol,
            "ak": ak,
            "sniper": sniper
        }
    }

    nickName = prompt("Please enter your name ? (Max Length=8)", `Player ${players.length}`);
    if (nickName.length > 8) {
        nickName = prompt("Please enter your name ? (Max Length=8)", `8 Karakteri geçmeyin`);
    }
    socket.emit("newUser", { nickName, layers });
    socket.on("loginUser", loginUser)
}


function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(255)

    socket.on("GAME_UPDATE", drawPlayers);

}

const loginUser = ((p) => {
    player = p;
});

//Ana verilerin geldiği yer
//Ortak Veriler
const drawPlayers = (g) => {
    players = g.players;


    //Update Current User
    players.forEach(p => {
        if (p.id == player.id) {
            player = p;
        }
    })

    if (g.dropsInGame.guns.length > 0) {
        dropsInGame.guns = g.dropsInGame.guns;
    }
}



function draw() {

    background(255)
    drawGame();
    drawDrop();
    players.forEach(p => {
        createPlayer(p);
    })

    update();
}

function createPlayer(playerr) {
    //Player Ortasından Merkez Nokta 
    translate(
        0,
        0
    );

    fill(50);
    text(playerr.nickName, playerr.x + 35, playerr.y + 18, 60, 40)
    image(images.models[playerr.type], playerr.x - 32, playerr.y - 32, playerr.width, playerr.height);

    //Create A Gun Draw
    fill(playerr.gun.type.color[0], playerr.gun.type.color[1], playerr.gun.type.color[2])
    rect(playerr.x + 25, playerr.y + 7, 15, 15);

    fill(255, 0, 0);
    rect(playerr.x, playerr.y + 35, playerr.health, 10)

    //let vector=createVector(playerr.x,playerr.y);
    //Mermi varsa hemen çizecekk
    if (playerr.gun.bullets.length > 0) {
      

        for (let i = 0; i < playerr.gun.bullets.length; i++) {
            fill(playerr.gun.type.color[0], playerr.gun.type.color[1], playerr.gun.type.color[2])

            //  line(vector.x,vector.y,playerr.gun.bullets[i].x, playerr.gun.bullets[i].y,8,8)
            ellipse(playerr.gun.bullets[i].x, playerr.gun.bullets[i].y, 8, 8)
        }
    }



}
function drawDrop() {
    if (dropsInGame.guns.length > 0) {
        for (let i = 0; i < dropsInGame.guns.length; i++) {
            let imageType = dropsInGame.guns[i].type.image;
            image(images.guns[imageType], dropsInGame.guns[i].x, dropsInGame.guns[i].y, 30, 30)
        }
    }
}
function update() {

    if (mouseIsPressed) {
        if(player.gun.bullets.length>0){
            sounds.gunSounds[player.gun.type.image].play();
        }
        socket.emit("fire", { player, mouseX, mouseY });
    }
    if (keyIsDown(87)) {
        socket.emit("speedUp", player)
    }
    if (keyIsDown(83)) {
        socket.emit("speedDown", player);

    }
    if (keyIsDown(68)) {
        socket.emit("steerLeft", player)
    }
    if (keyIsDown(65)) {
        socket.emit("steerRight", player)
    }
    if (keyIsDown(32)) {
        socket.emit("stopCar", player)
    }

}



