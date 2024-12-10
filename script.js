const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const timerText = document.querySelector("#timerText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const monkeyImage = new Image();
monkeyImage.src = "https://em-content.zobj.net/thumbs/240/twitter/348/monkey-face_1f435.png"; // Path to your monkey image
const bananaImage = new Image();
bananaImage.src = "https://static.vecteezy.com/system/resources/previews/019/614/283/original/banana-graphic-clipart-design-free-png.png"; // Path to your banana image
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let bananaX;
let bananaY;
let score = 0;
let timeRemaining = 10;
let timerInterval;
let monkey = { x: unitSize * 4, y: 0 }; 

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    score = 0;
    timeRemaining = 10;
    scoreText.textContent = `Score: ${score}`;
    timerText.textContent = `Time: ${timeRemaining}s`;
    createBanana();
    drawBanana();
    startTimer();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawBanana();
            moveMonkey();
            drawMonkey();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
    }
}
function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createBanana() {
    function randomPosition(min, max) {
        const randNum =
            Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    bananaX = randomPosition(0, gameWidth - unitSize);
    bananaY = randomPosition(0, gameHeight - unitSize);
}

function drawBanana() {
    ctx.drawImage(bananaImage, bananaX, bananaY, unitSize, unitSize);
}

function moveMonkey() {
    monkey.x += xVelocity;
    monkey.y += yVelocity;

    if (monkey.x === bananaX && monkey.y === bananaY) {
        score += 10;
        timeRemaining = 10;
        scoreText.textContent = `Score: ${score}`;
        timerText.textContent = `Time: ${timeRemaining}s`;
        createBanana();
    }
}

function drawMonkey() {
    ctx.drawImage(monkeyImage, monkey.x, monkey.y, unitSize, unitSize);
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    switch (true) {
        case keyPressed === LEFT && !goingRight:
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case keyPressed === UP && !goingDown:
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case keyPressed === RIGHT && !goingLeft:
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case keyPressed === DOWN && !goingUp:
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    if (
        monkey.x < 0 ||
        monkey.x >= gameWidth ||
        monkey.y < 0 ||
        monkey.y >= gameHeight
    ) {
        running = false;
    }
}

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
    clearInterval(timerInterval);
    gameOverSound.play(); 
    
}



function resetGame() {
    clearInterval(timerInterval);
    xVelocity = unitSize;
    yVelocity = 0;
    monkey = { x: unitSize * 4, y: 0 };
    gameStart();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerText.textContent = `Time: ${timeRemaining}s`;
        } else {
            running = false;
            clearInterval(timerInterval);
            displayGameOver();
        }
    }, 1000);
}