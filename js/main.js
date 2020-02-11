/*----- constants -----*/ 
var PIT_START_STONES = 4;
var HOME_START_STONES = 0;


/*----- classes -----*/ 
class Board {
    constructor() {
        this.player1 = 'G';
        this.player2 = 'R';
        this.boardPits = this.setupPits()
    }

    setupPits() {
        var allBoardPits = []
        for (let i = 1; i <= 6; i++) {
            allBoardPits.push(new Pocket(this.player2, this.player2 + i));
        }
        allBoardPits.push(new Pocket(this.player2, this.player2 + 'Home', HOME_START_STONES));
        for (let i = 1; i <= 6; i++) {
            allBoardPits.push(new Pocket(this.player1, this.player1 + i));
        }
        allBoardPits.push(new Pocket(this.player1, this.player1 + 'Home', HOME_START_STONES));
        return allBoardPits;
    }

    pickUpStonesFrom(identity) {
        switch (identity) {
            case 'red-home':
                return {num: 0, index: 6};
                break;
            case 'green-home':
                return {num: 0, index: 13};
                break;
            default:
                let stoneCount = 0;
                for (let i = 0; i < this.boardPits.length; i++) {
                    if (this.boardPits[i].ident === identity) {
                        stoneCount = this.boardPits[i].stones;
                        console.log('Inside pickUpStones ' + stoneCount)
                        this.boardPits[i].stones = 0;
                        return {num: stoneCount, index: i};
                    }
                }
        }
    }

    move(pickedUpStones_from) {
        
        let stones = pickedUpStones_from.num;
        let index = pickedUpStones_from.index;
    
        while (stones > 0) {
            (index + 1 === 14) ? (index = 0) : (index ++);

            if ((index === 13) && currentPlayer === 'R') {
                (index + 1 === 14) ? (index = 0) : (index ++);
            }
            if ((index === 6) && currentPlayer === 'G') {
                (index + 1 === 14) ? (index = 0) : (index ++);
            }

            console.log(index);
            this.boardPits[index].stones += 1;
            stones--;
        }
        console.log('Out of loop ' + index);
    }
   

}

class Pocket {
    constructor(player, ident, stones = PIT_START_STONES) {
        this.player = player;
        this.ident = ident;
        this.stones = stones;
        this.adjacentPit = this.findAdjacentPit();
    }

    findAdjacentPit() {
        let oppositePit = '';
        if (this.ident.endsWith('e')) {
            oppositePit = null;
        } else {
            this.player === 'R' ? oppositePit = 'G' : oppositePit = 'R';
            oppositePit = `${oppositePit}${(7 - (this.ident[1]))}`  
        }
        return oppositePit;
    }
}

/*----- app's state (variables) -----*/ 
let theBoard = new Board();
let winnerMessage = '';
var currentPlayer = 'G';
var otherPlayer = 'R';

/*----- cached element references -----*/ 
let pitsOnBoard = document.getElementsByClassName('pit');

/*----- event listeners -----*/ 
document.getElementById('board').addEventListener('click', play)

/*----- functions -----*/

function play() {
    pitClicked = event.target.id;
    pickedUpStones_from = theBoard.pickUpStonesFrom(pitClicked);

    theBoard.move(pickedUpStones_from);
    changePlayer();

    
}

function changePlayer() {
    if (currentPlayer === 'G') {
        currentPlayer = 'R';
        otherPlayer = 'G';
    } else {
        currentPlayer = 'G';
        otherPlayer = 'R';
    }
}
