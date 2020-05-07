/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let lockClick = 1;
let redTeam = document.querySelector('#player1');
let blueTeam = document.querySelector('#player2');
let resetButton = document.querySelector('#reset');
let startButton = document.querySelector('#start');

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {

  for(let i = 0; i <= HEIGHT; i++){
    
    board[i] = new Array(WIDTH);

  }

}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
 
  let htmlBoard = document.querySelector('#board')

  // This will create the top row where you will be able to hover and drop in a piece
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create each HEIGHT row with WIDTH number of tds that each have an 
  // id of y-x coordinates where they are located on the grid
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}


/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let lowestY = null;
  for (let y = 0; y < HEIGHT; y++) {

    if(board[y][x] == undefined){
      lowestY = y;

    }
  }
//   return the lowestY value on the board within that column
  return lowestY;
}


/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {

  let selectedSlot = document.getElementById(`${y}-${x}`)
  let newPiece = document.createElement('div');
  
  if(currPlayer === 1){

    newPiece.classList.add('piece', 'blue');

  }else if (currPlayer === 2){
  
    newPiece.classList.add('piece', 'red');
  
  }else{

  }

  selectedSlot.append(newPiece);
  
}



/** endGame: announce game end */

function endGame(msg) {

    // select the winner's div and then add an h2 that says winner
  changeTurn();
  let winner = 'player' + currPlayer;
  let winnerDiv = document.querySelector(`#${winner}`);

    //changeTurn will ungray the winner to show that they are the one who has one.
  changeTurn();
  let winningMsg = document.createElement('h2');
  winningMsg.innerText = 'WINNER!';
  winnerDiv.append(winningMsg);

    //with a lockClick value of anything but 0 the user cannot continue playing until they have clicked reset
  lockClick = -1;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  if(lockClick == 0){
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;


  // check for win
  if (checkForWin()) {
    return endGame(`The ${currPlayer == 1 ? 'Blue' : 'Red'} Player won!`);
  }

  changeTurn();
}
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  // This will check for all combinations of winning sets in the game of Connect 4. 
  // _win will then iterate and see if all of the cells are from the same player.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

    //Switch current player to the other player and grey out the non-active player.  
function changeTurn(){
  redTeam.classList.toggle('greyed');
  blueTeam.classList.toggle('greyed');
  if(currPlayer === 1){
    currPlayer = 2;

  }else if(currPlayer == 2){
    currPlayer = 1;
  }else{

  }
}


    // Reset the board as a new game, remove any winner tags.
function reset(){

  board = [];
  let htmlBoard = document.querySelector('#board');
  htmlBoard.innerHTML = '';
  let winnerDiv = document.querySelectorAll('h2');
  for (const element of winnerDiv) {
    element.innerText = '';
  }
  
    // Allows the user to place pieces again if the lockClick was previously set to anything not 0
  lockClick = 0;

  makeBoard();
  makeHtmlBoard();

}


// Allow the game to start by allowing players to drop pieces.
function startGame(){

  lockClick = 0;

}

// Listeners for both buttons.
resetButton.addEventListener('click', reset);
startButton.addEventListener('click', startGame);

// Initalizes the board internally and on the dom and then sets the non-active player to greyed-out
makeBoard();
makeHtmlBoard();
redTeam.classList.toggle('greyed');

