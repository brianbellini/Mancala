/*----- constants -----*/ 
const PIT_START_STONES = 4;
const HOME_START_STONES = 0;
const G_HOME = 0;
const R_HOME = 7;
const TOTAL_PITS = 14;

/*----- classes -----*/ 
class Pocket {
    constructor(owner, ident, stones = PIT_START_STONES) {
        this.owner = owner;
        this.ident = ident;
        this.stones = stones;
        this.adjacentPit = this.findAdjacentPit();
    }

    findAdjacentPit() {
        let oppositePit = '';
        if ((this.ident === R_HOME) || (this.ident === G_HOME)) {
            oppositePit = null;
        } else {
            oppositePit = TOTAL_PITS - this.ident; 
        }
        return oppositePit;
    }
}

class Board {
    constructor() {
        this.player1 = 'G';
        this.player2 = 'R';
        this.boardPits = this.setupPits();
    }

    setupPits() {
        var allBoardPits = [];
        //Create Green home
        allBoardPits.push(new Pocket(this.player1, G_HOME, HOME_START_STONES));
        //Create top row
        for (let i = G_HOME + 1; i < R_HOME ; i++) {
            allBoardPits.push(new Pocket(this.player1, i));
        }
        //Create Red home
        allBoardPits.push(new Pocket(this.player2, R_HOME, HOME_START_STONES));
        //Create bottom row
        for (let i = R_HOME + 1; i < TOTAL_PITS; i++) {
            allBoardPits.push(new Pocket(this.player2, i));
        }
        return allBoardPits;
    }
}


/*----- app's state (variables) -----*/ 
let theBoard = new Board();
let message = '';
var currentPlayer = 'G';

/*----- cached element references -----*/ 
let pitsOnBoard = document.getElementsByClassName('pit');
let greenPlayerTag = document.getElementById('green-player');
let redPlayerTag = document.getElementById('red-player');
let domBoardPits = document.querySelectorAll('#board > div');
let messageBoard = document.getElementById('result-banner');

/*----- event listeners -----*/ 
document.getElementById('board').addEventListener('click', play);
document.getElementById('reset-button').addEventListener('click', reset);

/*----- functions -----*/
function play() {
    // Reset message after click
    message = '';
    // Get pit clicked
    pitClicked = parseInt((event.target.id).substring(1));
    // Error handling for home pit clicked
    if (!pitClicked) {
        (event.target.id === 'green-home') ? pitClicked = G_HOME : pitClicked = R_HOME;
        message = `Can't play those!`;
        render();
    } else if (theBoard.boardPits[pitClicked].owner !== currentPlayer) {
        message = `Can't play those!`;
        render();
    } else {
        // Make move
        move(pickUpStonesFrom(pitClicked));
    }
    // Check game status
    stateCheck();
}

function changePlayer() {
    // Changes player and renders player marker
    if (currentPlayer === 'G') {
        currentPlayer = 'R';
    } else {
        currentPlayer = 'G';
    }
    render();
}

function move(pickedUp) {
    let stonesInHand = pickedUp.stones;
    let index = pickedUp.originPit;
    // Place stones in hand 1 per pit
    while (stonesInHand > 0) {
        let nextPit = (index - 1 < 0) ? (TOTAL_PITS - 1) : index - 1;
        // Check if last pit is now opponent home
        if ((currentPlayer === 'G') && (nextPit !== R_HOME)) {
            theBoard.boardPits[nextPit].stones += 1;
            stonesInHand--;
        }
        // Check if last pit is now opponent home
        if ((currentPlayer === 'R') && (nextPit !== G_HOME)) {
            theBoard.boardPits[nextPit].stones += 1;
            stonesInHand--;
        }
        index = nextPit;
    }
    switch (index) {
        // Check if last pit is player home
        case R_HOME:
            currentPlayer === 'R' ?  message = `Red gets another turn!` : changePlayer();
            break;
        // Check if last pit is player home
        case G_HOME:
            currentPlayer === 'G' ?  message = `Green gets another turn!` : changePlayer();
            break;
        // Check if last pit is empty
        default:
            if (theBoard.boardPits[index].stones === 1) {
                // Was last pit on player side
                if (theBoard.boardPits[index].owner === currentPlayer) {
                    // Steal stones from adjacent pit
                    let stealFrom = theBoard.boardPits[index].adjacentPit;
                    stolenStones = theBoard.boardPits[stealFrom].stones;
                    theBoard.boardPits[stealFrom].stones = 0;
                    theBoard.boardPits[index].stones = 0;
                    currentPlayer === 'R' ?  theBoard.boardPits[R_HOME].stones += (stolenStones + 1)  : theBoard.boardPits[G_HOME].stones += (stolenStones + 1);
                }
            }
            // Last pit not empty, start next turn
            changePlayer();
            break;
    }
    render();
    return index;
}

function render() {
    // Show player pointer
    if (currentPlayer === 'G') {
        greenPlayerTag.style.opacity = 1;
        redPlayerTag.style.opacity = 0;
    }else {
        greenPlayerTag.style.opacity = 0;
        redPlayerTag.style.opacity = 1;
    }
    // Update stone counts on top row
    for (let i = 0; i <= R_HOME; i++) {
        domBoardPits[i].textContent = theBoard.boardPits[i].stones;
    }
    // Update stone counts on bottom row
    let n = 8;
    for (let i = 13; i > R_HOME; i--) {
        domBoardPits[n].textContent = theBoard.boardPits[i].stones;
        n += 1;
    }  
    // Update message
    messageBoard.textContent = message;
}

function pickUpStonesFrom(originPit) {
    // Error handling for home pits
    switch (originPit) {
        case R_HOME:
            message = `Can't play those!`;
            return {stones: 0,
                originPit: R_HOME};
        case G_HOME:
            message = `Can't play those!`;
            return {stones: 0,
                originPit: G_HOME};
        // Pickup stones and set pit stone count to 0
        default:
            let inHand = theBoard.boardPits[originPit].stones;
            theBoard.boardPits[originPit].stones = 0;
            return {stones: inHand, originPit: originPit};  
    }
}

function stateCheck() {
    let greenSide = 0;
    let redSide = 0;
    // Count stones on both sides
    for (let i = 1; i < 6; i++) {
        greenSide += theBoard.boardPits[i].stones;
        redSide += theBoard.boardPits[i + 7].stones;
    }
    // If top row total is 0
    if (greenSide === 0) {
        // Move bottom row stones to Red home
        theBoard.boardPits[R_HOME].stones += redSide;
        for (let i = R_HOME + 1; i < TOTAL_PITS; i++) {
            theBoard.boardPits[i].stones = 0;
        }
        // Which home has the most stones
        (theBoard.boardPits[G_HOME].stones > theBoard.boardPits[R_HOME].stones) ? message = `Green Wins!!!` : message = `Red Wins!!!`;
        // If bottom row total is 0
    } else if (redSide === 0) {
        // Move bottom row stones to Green home
        theBoard.boardPits[G_HOME].stones += greenSide;
        for (let i = 1; i < R_HOME; i++) {
            theBoard.boardPits[i].stones = 0;
        }
        // Which home has the most stones
        (theBoard.boardPits[G_HOME].stones > theBoard.boardPits[R_HOME].stones) ? message = `Green Wins!!!` : message = `Red Wins!!!`;
    }
    render();
}

function reset() {
    // Rest board data to base
    theBoard = new Board;
    currentPlayer = 'G';
    message = '';
    render();
}

/*----- Main Program -----*/
render();