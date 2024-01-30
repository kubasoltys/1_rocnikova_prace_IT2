//canvas board

let blockSize = 25;
let rows = 20;
let cols = 20;
let board = document.getElementById("board");
let drawing;


//snake - hlava

let snakeX = blockSize * 5;
let snakeY = blockSize * 5; //snake bude zacinat na souradnicich 5, 5


//snake - rychlost

let speedX = 0;
let speedY = 0;


//snake - telo

let snakeBody = [];


//jidlo

let foodX;
let foodY;


//konec hry

let gameOver = false;


//body

let score = 0;
let highScore = 0;
let scoreText = document.getElementById("scoreText");
let highScoreText = document.getElementById("highScoreText"); 


//zvuky

let eatingSound = new Audio("sounds/eating.mp3"); //promena ktera obsahuje audio ze souboru
let gameOverSound = new Audio("sounds/game_over.mp3");



window.onload = function() { //po nacteni cele stranky   
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    drawing = board.getContext("2d"); //odkazuje na 2D kontext, pouziva se pro kresleni na canvasu "board"
    document.getElementById('playButton').style.display = 'none'; //skryje tlacitko
    document.getElementById('sign').style.display = 'none';

    randomFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000/6.8) //funkce update je volana kazdych 147 milisekund
}


function update() {
    if (gameOver) {
        return 0;
    }

    drawing.fillStyle = "black"; //nastaveni barvy
    drawing.fillRect(0, 0, board.height, board.width); //vyplni cerne kostky 25 * 25 a zacina na souradnici 0, 0

    drawing.fillStyle = "red";
    drawing.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]); //prida do pole souradnice na kterych se ma vykreslit telo hada
        randomFood();

        //prehrani zvuku
        eatingSound.play();

        //pocitani bodu
        score++;
        scoreText.innerHTML = "<b>Your score: </b>" + score;

        //high score
        if (score > highScore) {
            highScore = score;
        }
        highScoreText.innerHTML = "<b>Your high score: </b>" + highScore;
    }
    
    for (let i = snakeBody.length-1; i > 0; i--) { //smycka ktera se od konce hada posouva az k hlave
        snakeBody[i] = snakeBody[i-1]; //kazdy zeleny block se posune na pozici predchoziho, tudiz to vypada ze se had hybe cely
    }

    if (snakeBody.length) { //nastavuje novou pozici hlavy na aktualni souradnice
        snakeBody[0] = [snakeX, snakeY];
    }

    drawing.fillStyle = "lime";
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize; //zmeni souradnice podle toho kam se pohybujeme, * blockSize znamena ze se nebudem pohybovat o jeden pixel ale o celou kostku
    drawing.fillRect(snakeX, snakeY, blockSize, blockSize); //vyplni zelene souradnice 5, 5 a aby vyplnil jen celou kostku musime napsat "blockSize"
    
    for (let i = 0; i < snakeBody.length; i++) { //vykresluje block zelene podle souradnic ktere jsme do pole snakeBody poslali drive v kodu
        drawing.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }


    //konce hry

    if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) { //pokud jsem na osach X a Y v zapornych cislech nebo presahnu velikost pixelu canvasu
        gameOver = true;
        gameOverSound.play(); //prehraje zvuk
        document.getElementById('playButton').style.display = ''; //zobrazi tlacitko
        document.getElementById('sign').style.display = '';
    }

    //?
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            gameOverSound.play(); //prehraje zvuk
            document.getElementById('playButton').style.display = ''; //zobrazi tlacitko
            document.getElementById('sign').style.display = '';
        }
    }
    //?

}


//generovani nahodne lokace jidla

function randomFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}


//pohyb

function changeDirection(e) {
    if (e.code == "ArrowUp" && speedY != 1) { //pohyb nahoru, pouze pokud nejedu dolu
        speedX = 0; //na ose X se nic nemeni
        speedY = -1; //na ose Y se posuneme o 1 kostku nahoru
    }
    else if (e.code == "ArrowDown" && speedY != -1) { //pohyb dolu, pouze pokud nejedu nahoru
        speedX = 0;
        speedY = 1;
    }
    else if (e.code == "ArrowLeft" && speedX != 1) { //pohyb doleva, pouze pokud nejedu doprava
        speedX = -1; //na ose X se posuneme o 1 kostku doleva
        speedY = 0; //na ose Y se nic nemeni
    }
    else if (e.code == "ArrowRight" && speedX != -1) { //pohyb doprava, pouze pokud nejedu doleva
        speedX = 1;
        speedY = 0;
    }
}


//reset hry

document.getElementById('playButton').addEventListener('click', restartGame); //tlacitko

function restartGame() {
    //resetovani promennych
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    speedX = 0;
    speedY = 0;
    snakeBody = [];
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
    gameOver = false;
    score = 0;
    scoreText.innerHTML = "<b>Your score: </b>" + score;

    document.getElementById('playButton').style.display = 'none'; //skryje tlacitko
    document.getElementById('sign').style.display = 'none';
    
    update();
}
