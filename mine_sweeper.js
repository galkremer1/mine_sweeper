/**
 * Created by galkremer on 11/11/2015.
 */

//Global variables for the game
var gFlags = 0; //How many flags have been currently marked in the game
var gBoard = [];
var gRowSize =0;
var gColSize =0;
var gNumMines=0;
var gIsGameOn = true;
////////////////////////////////////////////////////



////Creating a shuffled array of mines
function createMinesArray() {
    function shuffle(arr){
        for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
    var arr = [];
    var numMinesPushed = 0;
    var size = gRowSize*gColSize;
    for (var i=0; i<size; i++) {
        if (numMinesPushed<gNumMines) {
            arr.push(1);
            numMinesPushed++;
        }
        else {
            arr.push(0);
        }
    }
    return shuffle(arr);
}
//////////////////////////////////////////////////////////


function createBoard() {
    gBoard = [];
    var minesArray = createMinesArray();
    var counter = 0;
    for (var i=0; i<gRowSize; i++) {
        gBoard[i] = [];
        for (var j=0; j<gColSize; j++) {
            gBoard[i][j] = {isMine: minesArray[counter], symbole: ' ', backgroundColor:'white', alreadyChecked: false, minesNeighbours: 0, isFlagged: false};
            counter++;
        }
    }
}

///Drawing the board on the HTML

function drawBoard(){
    var board = document.querySelector(".board");
    board.innerHTML='';
    for (var i=gRowSize-1; i>=0; i--) {
        var row = board.insertRow(0);
        for (var j = gColSize-1; j >=0; j--) {
            cell = row.insertCell(0);
            cell.innerHTML +='<button id="btn"' +' oncontextmenu="elementClicked(' + i +',' +j+')" '+' onclick="elementClicked(' + i +',' +j+')">' + gBoard[i][j].symbole +' </button>';
            cell.style.background = gBoard[i][j].backgroundColor;
        }
        board.innerHTML += "<BR>";
    }

}


function updateNeighbours() {
    for (var i=0; i<gRowSize; i++) {
        for (var j = 0; j < gColSize; j++) {
            var surrMines=0;
            for (var ii = -1; ii <= 1; ii++) {
                for (var jj = -1; jj <= 1; jj++) {
                    var currI = i + ii;
                    var currJ = j + jj;
                    if (ii === 0 && jj === 0) continue;
                    if (currI < 0 || currI > gColSize - 1) continue;
                    if (currJ < 0 || currJ > gRowSize - 1) continue;
                    if (gBoard[currI][currJ].isMine === 1) {
                        surrMines++;
                    }
                }
            }
            gBoard[i][j].minesNeighbours = surrMines;
        }
    }
}

function updateBoard() {
    for (var i = 0; i < gRowSize; i++) {
        for (var j = 0; j < gColSize; j++) {
            for (var ii = -1; ii <= 1; ii++) {
                for (var jj = -1; jj <= 1; jj++) {
                    var currI = i + ii;
                    var currJ = j + jj;
                  //  if (ii === 0 && jj === 0) continue;
                    if (currI < 0 || currI > gColSize - 1) continue;
                    if (currJ < 0 || currJ > gRowSize - 1) continue;
                    if (gBoard[i][j].symbole === 0) {
                        gBoard[currI][currJ].symbole = gBoard[currI][currJ].minesNeighbours;
                    }
                }
            }
        }
    }
}

function gameOver() {
    showMines();
    alert('Game over!');
    gIsGameOn = false;
}

function showMines(){
    for (var i = 0; i < gRowSize; i++) {
        for (var j = 0; j < gColSize; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].symbole = 'X';
                gBoard[i][j].backgroundColor='blue';
            }
        }
    }
}

function elementClicked(i,j) {
    if (gIsGameOn) {
        if (event.button === 0) { //Left click
            if (gBoard[i][j].isMine === 1) {
                gameOver();
            }
            else {
                gBoard[i][j].symbole = gBoard[i][j].minesNeighbours;
                updateBoard();
                drawBoard();
            }
        }
        else { //right click
            alert(event.button);
            event.preventDefault();
        }
        console.log(i,j);
        drawBoard();
    }
}

function newGame() {
    var level = document.querySelector(".level").value;
    switch (level) {
        case "Beginner":
            gRowSize = 9;
            gColSize = 9;
            gNumMines = 10;
            break;
        case "Intermediate":
            gRowSize = 16;
            gColSize = 16;
            gNumMines = 40;
            break;
        case "Expert":
            gRowSize = 16;
            gColSize = 30;
            gNumMines = 99;
            break;
    }
    gIsGameOn = true;
    createBoard();
    updateNeighbours();
    drawBoard()

}


