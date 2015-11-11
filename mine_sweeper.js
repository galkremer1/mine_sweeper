/**
 * Created by galkremer on 11/11/2015.
 */

//Global variables for the game
var gFlags = 0; //How many flags have been currently marked in the game
var gRemaining = 0; //Unexposed squares in the game
var gMinesRemaining=0;
var gBoard = [];
////////////////////////////////////////////////////



////Creating a shuffled array of mines
function createMinesArray(rawSize, colSize, numMines) {
    function shuffle(arr){
        for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
    var arr = [];
    var numMinesPushed = 0;
    var size = rawSize*colSize;
    for (var i=0; i<size; i++) {
        if (numMinesPushed<numMines) {
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


function drawBoard(rawSize, colSize, numMines) {
    var minesArray = createMinesArray(rawSize, colSize, numMines);
    var counter = 0;
    for (var i=0; i<rawSize; i++) {
        gBoard[i] = [];
        for (var j=0; j<colSize; j++) {
            gBoard[i][j] = {isMine: minesArray[counter]};
            counter++;
        }
    }
}






//console.log(createMinesArray(9,9,10));
drawBoard(9,9,10);
console.log(gBoard);