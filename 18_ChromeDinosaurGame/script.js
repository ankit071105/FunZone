
let board;
let boardWidth = 1000;
let boardHeight = 400;
let context;

let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX =  boardWidth;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let velocityX = -5; 
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); 
    dinoImg = new Image();
    dinoImg.src = "./assets/dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./assets/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./assets/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./assets/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); 
    document.addEventListener("keydown", moveDino);


}
function playScoreSound() {
    const scoreAudio = document.getElementById("scoreAudio");
    scoreAudio.currentTime = 0;
      scoreAudio.play();
}

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        if(e.code == "KeyR"){
            resetGame();
        }
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    context.strokeStyle = "#ccc";
    context.lineWidth = 5;
    context.strokeRect(0, 0, board.width, board.height);
 velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); 
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./assets/dino-dead.png";
            context.fillStyle = "#27374D";
            context.font = "40px 'Play'";
            context.fillText("Press 'R' to Restart", 340, 210);
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    context.fillStyle = "#27374D";
    context.font = "25px 'Play'";
    score++;
    context.fillText("Score:", 450, 40);
    context.fillText(score, 525, 40);
if (score % 1000 === 0 && score !== 0) {
        playScoreSound();
    }

}
function playCollisionSound() {
    const collisionAudio = document.getElementById("collisionAudio");
    collisionAudio.currentTime = 0; 
    collisionAudio.play();
}



function moveDino(e) {
    if(gameOver){
        if(e.code == "KeyR"){
            resetGame();
        }
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
   
        velocityY = -12;
        playKeyPressSound();
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
    
    }

}

function placeCactus() {
    if(gameOver){
        if(e.code == "KeyR"){
            resetGame();
        }
        return;
    }
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); 

    if (placeCactusChance > .90) { 
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { 
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { 
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function playKeyPressSound() {
    const keypressAudio = document.getElementById("keypressAudio");
    keypressAudio.currentTime = 0;
    keypressAudio.play();
}


function detectCollision(a, b) {
    const isCollision =
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

    if (isCollision) {
        gameOver = true;
        dinoImg.src = "./assets/dino-dead.png";
        context.fillStyle = "#27374D";
        context.font = "40px 'Play'";
        context.fillText("Press 'R' to Restart", 340, 210);
        dinoImg.onload = function () {
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        }
        playCollisionSound();
    }

    return isCollision;
}


function resetGame() {
    gameOver = false

    dinoImg.src = "./assets/dino.png";
    dino = {
        x: dinoX,
        y: dinoY,
        width: dinoWidth,
        height: dinoHeight
    }

    cactusArray = [];
    cactus1Width = 34;
    cactus2Width = 69;
    cactus3Width = 102;
    cactusHeight = 70;
    cactusX = 700;
    cactusY = boardHeight - cactusHeight;
    cactus1Img;
    cactus2Img;
    cactus3Img;

    velocityX = -8;
    velocityY = 0;
    gravity = .4;

    score = 0;
}