let boardSize = 10,
    bombCount = 15,
    safeTiles = 0,
    flagCount = bombCount,
    gameStarted = false,
    tiles = [],
    time = 1,
    gameOver = false,
    gameWon = false,
    timerUpd = null,
    board = document.querySelector('.game-board'),
    gameResults = document.querySelector('.game-results'),
    playBtn = document.querySelector('.new-gameBtn');



let bombCountUpd = document.querySelector('.bomb-count')
    bombCountUpd.innerHTML = (`☀️ ${bombCount}`);

let redFlagUpd = document.querySelector('.red-flag-count')
    redFlagUpd.innerHTML = (`🌧️ ${flagCount}`);

let timer = document.querySelector('.timer')

function varUpd() {
    boardSize = 10,
    bombCount = 15,
    safeTiles = 0,
    flagCount = bombCount,
    gameStarted = false,
    tiles = [],
    time = 1,
    gameOver = false,
    gameWon = false,
    timerUpd = null;
}

function tileDelete() {
    for(let {tile} of tiles) {
        tile.remove();
    }
}

function newGame() {
    tileDelete();
    clearTimeout(timerUpd);
    timer.innerHTML = (`⌛ 000`);
    varUpd();
    creatBoard();
}

playBtn.addEventListener('click', function()  {
    newGame();
})


function timerStart() {
    timerUpd = setInterval(function() {
        switch (time.toString().length) {
            case 1:
              timer.innerHTML = (`⌛ 00${time}`);
              break;
            case 2:
              timer.innerHTML = (`⌛ 0${time}`);
              break;
            default:
               timer.innerHTML = (`⌛ ${time}`);
        }
        time++;
    }, 1000);
}

function setMines(id) {
    for (let i = 0; i < bombCount; i++) {
        let rnd = Math.floor(Math.random() * boardSize ** 2);
        if (tiles[rnd].bomb || rnd == id) i--;
        else tiles[rnd].bomb = true;
    }
}


function creatBoard() {
    let tile;
    for (let id = 0 ; id < boardSize ** 2; id++) {
        tile = document.createElement('div')
        tile.setAttribute('id', id)
        board.appendChild(tile)
        tiles.push({tile,clicked : false, bomb : false, redFlag : false})
    }
}


function nearbyTiles(id) {

    if (id < 0 || id > 99) return;

    safeTiles++;


    id = Number(id);

    tiles[id].clicked = true;  
    tiles[id].tile.setAttribute('class', 'clicked');

    let rightBorder = id.toString().slice(-1) == '9',
        leftBorder = id.toString().slice(-1) == '0';
        
    let bombCountAround = 0;
    let nearbyTilesArr = [];



    if (!rightBorder) for (let i = id - 9; i <= id + 11; i+=10) {
        if (i < 0 || i > 99) continue;
        if (tiles[i].bomb) bombCountAround++;
        else if (!tiles[i].clicked) nearbyTilesArr.push(i)
    }

    if (!leftBorder) for (let i = id - 11; i <= id + 9; i+=10) {
        if (i < 0 || i > 99) continue;
        if (tiles[i].bomb) bombCountAround++;
        else if (!tiles[i].clicked) nearbyTilesArr.push(i)
    }

    if (id - 10 >= 0) {
        if (tiles[id - 10].bomb) bombCountAround++;
        else if (!tiles[id - 10].clicked) nearbyTilesArr.push(id - 10)
    }

    if (id + 10 <= 99) {
        if (tiles[id + 10].bomb) bombCountAround++;
        else if (!tiles[id + 10].clicked) nearbyTilesArr.push(id + 10)
    }

        
    if (bombCountAround == 0) {
        nearbyTilesArr.forEach (element => {
            if(!tiles[element].clicked) {
                tiles[element].tile.setAttribute('class', 'clicked');
                nearbyTiles(element);
            }
        })
        if (tiles[id].tile.innerHTML == '🌧️') redFlag(id);
    } else {
        tiles[id].tile.innerHTML = bombCountAround;
        tiles[id].tile.setAttribute('class', 'clicked');
    }
}


function redFlag(id) {
    let {tile} = tiles[id];
    if(!tiles[id].redFlag) {
        tiles[id].redFlag = true;
        tile.innerHTML = "🌧️";
        flagCount--;
    } else {
        tile.innerHTML = "";
        tiles[id].redFlag = false;
        flagCount++;
    }
    redFlagUpd.innerHTML = (`🌧️ ${flagCount}`);
    flagCount < 0 ? redFlagUpd.style.color = 'red' : redFlagUpd.style.color = 'black';
}

async function bombClick() {
    tiles.forEach(element => {
        if(element.bomb) element.tile.innerHTML = "☀️";   
    })
    gameOver = true;
    clearTimeout(timerUpd);
}


window.addEventListener('DOMContentLoaded', () => {
    creatBoard();
})


board.addEventListener('contextmenu', function(event) {
    let id = event.target.id;
    if (gameOver || tiles[id].clicked) return;
    redFlag(id);
    return false;
}, false);


board.onclick = element => {

    let id = element.target.id;
    let tileAtributes = tiles[id]

    if(!gameStarted) {
        timerStart();
        setMines(id);
    }
    gameStarted = true;
    


    if (tileAtributes.redFlag || tileAtributes.clicked || gameOver) return;

    tileAtributes.clicked = true;


    if (tileAtributes.bomb) bombClick()
    else nearbyTiles(id);

    if (boardSize ** 2 == bombCount + safeTiles) {
        gameWon = true;
        bombClick();
    }
} 









