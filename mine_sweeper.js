/**
 * Created by galkremer on 11/11/2015.
 */

//Global variables for the game
var gFlags = 0; //How many flags have been currently marked in the game
var gRemaining = 0; //Unexposed squares in the game
var gMinesRemaining=0;
var gBoard = [];
var gRawSize =9;
var gColSize = 9;
var gNumMines= 10;
////////////////////////////////////////////////////



////Creating a shuffled array of mines
function createMinesArray() {
    function shuffle(arr){
        for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
    var arr = [];
    var numMinesPushed = 0;
    var size = gRawSize*gColSize;
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
    var minesArray = createMinesArray();
    var counter = 0;
    for (var i=0; i<gRawSize; i++) {
        gBoard[i] = [];
        for (var j=0; j<gColSize; j++) {
            gBoard[i][j] = {isMine: minesArray[counter], symbole: ''};
            counter++;
        }
    }
}

///Drawing the board on the HTML

function drawBoard(){
    var board = document.querySelector(".board");
    board.innerHTML='';
    for (var i=gRawSize-1; i>=0; i--) {
        var row = board.insertRow(0);
        for (var j = gColSize-1; j >=0; j--) {
            cell = row.insertCell(0);
            cell.innerHTML +='<button id="btn"' +' oncontextmenu="elementClicked(' + i +',' +j+')"'+' onclick="elementClicked(' + i +',' +j+')">' + gBoard[i][j].symbole +' </button>';
        }
        board.innerHTML += "<BR>";

    }
}

function elementClicked(i,j) {
    if (event.button === 0) { //Left click
        if (gBoard[i][j].isMine === 1) {
            alert('bomb!!');
            gBoard[i][j].symbole='X';
        }
    }
    else { //right click
        alert(event.button);
        event.preventDefault();
    }
    console.log(i,j);
    drawBoard();
}


//console.log(createMinesArray(9,9,10));
//drawBoard(9,9,10);
createBoard();
drawBoard();