/*----- constants -----*/ 
const PIT_START_STONES = 4;
const HOME_START_STONES = 0;
const G_HOME = 0;
const R_HOME = 7;
const TOTAL_PITS = 14;

/*----- classes -----*/ 
class Board {
    constructor() {
        this.player1 = 'G';
        this.player2 = 'R';
        this.boardPits = this.setupPits()
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

/*----- app's state (variables) -----*/ 
let theBoard = new Board();
let message = '';
var currentPlayer = 'G';
var otherPlayer = 'R';

/*----- cached element references -----*/ 
let pitsOnBoard = document.getElementsByClassName('pit');
let greenPlayerTag = document.getElementById('green-player');
let redPlayerTag = document.getElementById('red-player');
let domBoardPits = document.querySelectorAll('#board > div');
let messageBoard = document.getElementById('result-banner');

/*----- event listeners -----*/ 
document.getElementById('board').addEventListener('click', play)
document.getElementById('reset-button').addEventListener('click', reset)

/*----- functions -----*/
function play() {
    message = '';
    pitClicked = parseInt((event.target.id).substring(1));
    if (!pitClicked) {
        (event.target.id === 'green-home') ? pitClicked = G_HOME : pitClicked = R_HOME;
    }
    console.log(`Pit Clicked: ${pitClicked}`)
    move(pickUpStonesFrom(pitClicked));
    stateCheck()
}

function changePlayer() {
    if (currentPlayer === 'G') {
        currentPlayer = 'R';
        otherPlayer = 'G';
    } else {
        currentPlayer = 'G';
        otherPlayer = 'R';
    }
    render();
}

function move(pickedUp) {
    let stonesInHand = pickedUp.stones;
    let index = pickedUp.originPit;
    console.log()
    while (stonesInHand > 0) {
        let nextPit = (index - 1 < 0) ? (TOTAL_PITS - 1) : index - 1;
        if ((currentPlayer === 'G') && (nextPit !== R_HOME)) {
            theBoard.boardPits[nextPit].stones += 1;
            stonesInHand--;
        }
        if ((currentPlayer === 'R') && (nextPit !== G_HOME)) {
            theBoard.boardPits[nextPit].stones += 1;
            stonesInHand--;
        }
        index = nextPit;
    }
    switch (index) {
        case R_HOME:
            currentPlayer === 'R' ?  message = `Red gets another turn!` : changePlayer();
            break;
        case G_HOME:
            currentPlayer === 'G' ?  message = `Green gets another turn!` : changePlayer();
            break;
        default:
            if (theBoard.boardPits[index].stones === 1) {

                let stealFrom = theBoard.boardPits[index].adjacentPit;
                stolenStones = theBoard.boardPits[stealFrom].stones;
                theBoard.boardPits[stealFrom].stones = 0;
                theBoard.boardPits[index].stones = 0;
                
                currentPlayer === 'R' ?  theBoard.boardPits[R_HOME].stones += (stolenStones + 1)  : theBoard.boardPits[G_HOME].stones += (stolenStones + 1);
            }
            changePlayer();
            break;
    }
    render();
    return index;
}


function render() {
    if (currentPlayer === 'G') {
        greenPlayerTag.style.opacity = 1;
        redPlayerTag.style.opacity = 0;
    }else {
        greenPlayerTag.style.opacity = 0;
        redPlayerTag.style.opacity = 1;
    }
    for (let i = 0; i <= R_HOME; i++) {
        domBoardPits[i].textContent = theBoard.boardPits[i].stones;
    }
    let n = 8;
    for (let i = 13; i > R_HOME; i--) {
        domBoardPits[n].textContent = theBoard.boardPits[i].stones;
        n += 1;
    }  
    messageBoard.textContent = message;
}

function pickUpStonesFrom(originPit) {
    console.log(`Picked up ${theBoard.boardPits[originPit].stones} stones.`)
    switch (originPit) {
        case R_HOME:
            message = `Can't play those!`
            return {stones: 0,
                originPit: R_HOME};
        case G_HOME:
            message = `Can't play those!`
            return {stones: 0,
                originPit: G_HOME};
        default:
            let inHand = theBoard.boardPits[originPit].stones;
            theBoard.boardPits[originPit].stones = 0;
            return {stones: inHand,
                    originPit: originPit};     
    }
}

function stateCheck() {
    let greenSide = 0;
    let redSide = 0;
    for (let i = 1; i < 6; i++) {
        greenSide += theBoard.boardPits[i].stones
        redSide += theBoard.boardPits[i + 7].stones
    }
    if (greenSide === 0) {
        theBoard.boardPits[R_HOME].stones += redSide;
        for (let i = R_HOME + 1; i < TOTAL_PITS; i++) {
            theBoard.boardPits[i].stones = 0;
        }
        (theBoard.boardPits[G_HOME].stones > theBoard.boardPits[R_HOME].stones) ? message = `Green Wins!!!` : message = `Red Wins!!!`
    } else if (redSide === 0) {
        theBoard.boardPits[G_HOME].stones += greenSide;
        for (let i = 1; i < R_HOME; i++) {
            theBoard.boardPits[i].stones = 0;
        }
        (theBoard.boardPits[G_HOME].stones > theBoard.boardPits[R_HOME].stones) ? message = `Green Wins!!!` : message = `Red Wins!!!`
    }
    render()
}

function reset() {
    console.log(`Reset!`);
    theBoard = new Board;
    currentPlayer = 'G';
    render()
}

/*----- Main Program -----*/
render();
