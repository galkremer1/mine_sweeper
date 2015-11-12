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
var gTimer = false;
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
            cell = row.insertCell(0);
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

            if (!gIsGameOn) {
                if (gBoard[i][j].isMine===1 && !gBoard[i][j].isFlagged) {
                    cell.style.background="url('img/mine.png')";
                    button.style.opacity='0';
                }
                else if (gBoard[i][j].isMine===0 && gBoard[i][j].isFlagged) {
                    cell.style.background="url('img/wrongmine.png')";
                    button.style.opacity='0';
                }
                else if (gBoard[i][j].isMine===1) {
                    cell.style.background="url('img/flag.png')";
                    button.style.opacity='0';
                }
            }
        }
        board.innerHTML += "<BR>";
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////Unify these two functions///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

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
    console.log('Flagged: ' + flagged);
    console.log('Clicked: ' + clicked);
    if (((flagged+clicked) === gRowSize*gColSize) && gIsGameOn && flagged===gNumMines ){
        gIsGameOn = false;
        gTimer = false;
        drawBoard();
        alert('Congratulation! You have won the game!');
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////timer functions////////////////////////////////////////////////////////////////////////////
function setElapsed() {
    // update elapsed time display
    var elt = document.querySelector(".timer");
    if (gTimer) {
        var now = new Date();
        var secs = Math.floor((now.getTime() - startTime.getTime())/1000);
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
    startTime = new Date();
    gTimer = true;
    timerAction();
}

function gameOver() {
    gIsGameOn = false;
    gTimer = false;
    alert('Game over!');
    drawBoard();
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
    flagScore.innerText=gFlags;
    event.preventDefault();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function elementClicked(i,j) {
    if (gIsGameOn) {
        if (!gTimer) startTimer();
        if (event.button === 0) { //Left click
            if (gBoard[i][j].isMine) {
                gameOver();
            }
            else {
                gBoard[i][j].symbole = gBoard[i][j].minesNeighbours;
                gBoard[i][j].isClicked = true;
                if (gBoard[i][j].isFlagged) {
                    var flagScore = document.querySelector(".flagsRaised")
                    gFlags--;
                    flagScore.innerText=gFlags;
                }
                gBoard[i][j].isFlagged=false;
                updateBoard();
                drawBoard();
            }
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
    gFlags=0;
    document.querySelector(".flagsRaised").innerText=gFlags;

    gTimer = false;
    setElapsed();
    var lvlBtn=document.querySelector(".level");
    var level=lvlBtn.value;
    switch (level) {
        case "Easy":
            gRowSize = 3;
            gColSize = 3;
            gNumMines = 2;
            lvlBtn.style.background='blue';
            break;
        case "Beginner":
            gRowSize = 9;
            gColSize = 9;
            gNumMines = 10;
            lvlBtn.style.background='gray';
            break;
        case "Intermediate":
            gRowSize = 16;
            gColSize = 16;
            gNumMines = 40;
            break;
        case "Expert":
            gRowSize = 20;
            gColSize = 20;
            gNumMines = 10;
            lvlBtn.style.background='blue';
            break;
    }
    gIsGameOn = true;
    createBoard();
    updateNeighbours();
    drawBoard()
}


