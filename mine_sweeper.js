/**
 * Created by galkremer on 11/11/2015.
 */
"use strict";
//Global variables for the game
var gFlags = 0;
var gBoard = [];
var gRowSize =9;
var gColSize =9;
var gNumMines=10;
var gIsGameOn = true;
var gTimer = false;
var gStartTime=0;
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

//Creating a matrix of objects
function createBoard() {
    gBoard = [];
    var minesArray = createMinesArray();
    var counter = 0;
    for (var i=0; i<gRowSize; i++) {
        gBoard[i] = [];
        for (var j=0; j<gColSize; j++) {
            gBoard[i][j] = {isMine: minesArray[counter], symbole: ' ', backgroundColor:'white', minesNeighbours: 0, isFlagged: false, isClicked: false};
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
            var cell = row.insertCell(0);
            cell.innerHTML +='<button class="btn"' +' oncontextmenu="elementClicked(' + i +',' +j+')" '+' onclick="elementClicked(' + i +',' +j+')">' + gBoard[i][j].symbole +' </button>';
            var button = document.querySelector(".btn");
            if (gBoard[i][j].isClicked && gBoard[i][j].minesNeighbours===0 && !gBoard[i][j].isFlagged) {
                button.style.visibility='hidden';
            }
            if (gBoard[i][j].isFlagged) {
                cell.style.background="url('img/flag.png')";
                button.style.opacity='0';
            }
            else if (gBoard[i][j].isClicked) {
                button.style.background='white';
            }

            //The game has finished. We are updating the board with the mines that were wrongfully and successfully
            //selected.
            if (!gIsGameOn) {
                if (gBoard[i][j].isMine && !gBoard[i][j].isFlagged) {
                    cell.style.background = "url('img/mine.png')";
                    button.style.opacity = '0';
                }
                else if (!gBoard[i][j].isMine && gBoard[i][j].isFlagged) {
                    cell.style.background = "url('img/wrongmine.png')";
                    button.style.opacity = '0';
                }
                else if (gBoard[i][j].isMine) {
                    cell.style.background = "url('img/flag.png')";
                    button.style.opacity = '0';
                }
                else {
                    button.disabled = true; //Disabling all the other buttons once the game is finished
                }

                if (gBoard[i][j].isMine && gBoard[i][j].isClicked) { //Marking the bomb that was clicked and triggered the game over
                    cell.style.background="url('img/explodedMine.png')";
                    button.style.opacity='0';
                }
            }
        }
        board.innerHTML += "<BR>";
    }

}



//This function goes through the board and updates each object with the number of its neighbours.
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
                    if (gBoard[currI][currJ].isMine) {
                        surrMines++;
                    }
                }
            }
            gBoard[i][j].minesNeighbours = surrMines;
        }
    }
}

//Updating the board with the relevant attributes of each object.
function updateBoard() {
    var flagged=0;
    var clicked=0;
    for (var i = 0; i < gRowSize; i++) {
        for (var j = 0; j < gColSize; j++) {
            if (gBoard[i][j].isClicked) clicked++;
            if (gBoard[i][j].isFlagged) flagged++;
            for (var ii = -1; ii <= 1; ii++) {
                for (var jj = -1; jj <= 1; jj++) {
                    var currI = i + ii;
                    var currJ = j + jj;
                    if (currI < 0 || currI > gColSize - 1) continue;
                    if (currJ < 0 || currJ > gRowSize - 1) continue;
                    if (gBoard[i][j].symbole === 0 && !gBoard[currI][currJ].isFlagged) {
                            gBoard[currI][currJ].symbole = gBoard[currI][currJ].minesNeighbours;
                            gBoard[currI][currJ].isClicked = true;
                    }
                }
            }
        }
    }

    //Checking if the game is won
    if (((flagged+clicked) === gRowSize*gColSize) && gIsGameOn && flagged===gNumMines ){
        gIsGameOn = false;
        gTimer = false;
        drawBoard();
        document.querySelector(".gameStatus").innerText = "Well Done!";
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////




//////timer functions////////////////////////////////////////////////////////////////////////////
function setElapsed() {
    // update elapsed time display
    var elt = document.querySelector(".timer");
    if (gTimer) {
        var now = new Date();
        var secs = Math.floor((now.getTime() - gStartTime.getTime())/1000);
        elt.innerHTML = (secs > 999 ? charInfinity : "" + secs);
    }
    else {
        elt.innerHTML = "&nbsp;";
    }
}

function timerAction() {

    if (gTimer) {
        setElapsed();
        setTimeout("timerAction()", 100);
    }
}

function startTimer() {
    gStartTime = new Date();
    gTimer = true;
    timerAction();
}

function gameOver() {
    gIsGameOn = false;
    gTimer = false;
    drawBoard();
    document.querySelector(".gameStatus").innerText = "GAME OVER!";
}

function flagCell (i,j) {
    var flagScore = document.querySelector(".flagsRaised");
    if (gBoard[i][j].symbole === ' ') {
        gBoard[i][j].symbole = '!';
        gBoard[i][j].isFlagged=true;
        gFlags++;
    }
    else if (gBoard[i][j].symbole === '!') {
        gBoard[i][j].symbole = ' ';
        gBoard[i][j].isFlagged=false;
        gBoard[i][j].isClicked=false;

        gFlags--;
    }
    flagScore.innerText=gNumMines-gFlags;
    event.preventDefault();
}

function handleLeftClick(i,j) {
    if (gBoard[i][j].isMine) {
        gBoard[i][j].isClicked = true;
        gameOver();
    }
    else {
        gBoard[i][j].symbole = gBoard[i][j].minesNeighbours;
        gBoard[i][j].isClicked = true;
        if (gBoard[i][j].isFlagged) {
            var flagScore = document.querySelector(".flagsRaised")
            gFlags--;
            flagScore.innerText=gNumMines-gFlags;
        }
        gBoard[i][j].isFlagged=false;
        updateBoard();
        drawBoard();
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function elementClicked(i,j) {
    if (gIsGameOn) {
        if (!gTimer) startTimer();
        if (event.button === 0) { //Left click
            handleLeftClick(i,j);
        }
        else { //right click
            flagCell(i,j);
        }

        if (gIsGameOn) { /// Need to fix!
            updateBoard();
            updateBoard();
            updateBoard();
            updateBoard();
            updateBoard();
            drawBoard()
        }
    }
}

function newGame() {
    var lvlBtn=document.querySelector(".level");
    var level=lvlBtn.value;
    var board=document.querySelector(".minesweeper");
    switch (level) {
        case "Easy":
            gRowSize = 3;
            gColSize = 3;
            gNumMines = 2;
            lvlBtn.style.background='blue';
            board.style.width="35%";
            break;
        case "Beginner":
            gRowSize = 9;
            gColSize = 9;
            gNumMines = 10;
            lvlBtn.style.background='gray';
            board.style.width="35%";
            break;
        case "Intermediate":
            gRowSize = 16;
            gColSize = 16;
            gNumMines = 40;
            board.style.width="80%";
            break;
        case "Expert":
            gRowSize = 20;
            gColSize = 20;
            gNumMines = 99;
            lvlBtn.style.background='blue';
            board.style.width="100%";

            break;
    }
   gameInit();
}

function gameInit(){
    gFlags=0;
    document.querySelector(".flagsRaised").innerText=gNumMines-gFlags;
    document.querySelector(".gameStatus").innerText = '';
    gTimer = false;
    gIsGameOn = true;
    setElapsed();
    createBoard();
    updateNeighbours();
    drawBoard()
}

gameInit();

