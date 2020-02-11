/*----- constants -----*/ 
var PIT_START_STONES = 4;
var HOME_START_STONES = 0;
var G_HOME = 0;
var R_HOME = 7;
var TOTAL_PITS = 14;


/*----- classes -----*/ 
class Board {
    constructor() {
        this.player1 = 'G';
        this.player2 = 'R';
        this.boardPits = this.setupPits()
    }

    setupPits() {
        var allBoardPits = [];

        allBoardPits.push(new Pocket(this.player1, G_HOME, HOME_START_STONES));
        for (let i = G_HOME + 1; i < R_HOME ; i++) {
            allBoardPits.push(new Pocket(this.player1, i));
        }
        allBoardPits.push(new Pocket(this.player2, R_HOME, HOME_START_STONES));
        for (let i = R_HOME + 1; i < 14; i++) {
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
let domBoardPits = document.querySelectorAll('#board > div')
console.log(domBoardPits)

/*----- event listeners -----*/ 
document.getElementById('board').addEventListener('click', play)

/*----- functions -----*/


function play() {
    pitClicked = parseInt(event.target.id);
    console.log(`Pit Clicked: ${pitClicked}`)

    move(pickUpStonesFrom(pitClicked));
    


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
    
    console.log(`Ending Pit: ${index}`);

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

                currentPlayer === 'R' ?  theBoard.boardPits[R_HOME].stones += stolenStones  : theBoard.boardPits[G_HOME].stones += stolenStones;
            }
            changePlayer();
            break;
    }
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

/*----- Main Program -----*/
render();
