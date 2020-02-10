/*----- constants -----*/ 
var PIT_START_STONES = 4;
var HOME_START_STONES = 0;

/*----- classes -----*/ 
class Board {
    constructor() {
        this.player1 = 'g';
        this.player2 = 'r';
        this.boardPits = this.setupPits()
    }

    setupPits() {
        var allBoardPits = []
        
        for (let i = 1; i <= 6; i++) {
            allBoardPits.push(new Pocket(this.player2, this.player2 + i));
        }

        allBoardPits.push(new Pocket(this.player2, this.player2 + 'Home', HOME_START_STONES));

        for (let i = 6; i > 0; i--) {
            allBoardPits.push(new Pocket(this.player1, this.player1 + i));
        }

        allBoardPits.push(new Pocket(this.player1, this.player1 + 'Home', HOME_START_STONES));

        return [allBoardPits];
    }

}

class Pocket {
    constructor(player, ident, stones = PIT_START_STONES) {
        this.player = player;
        this.ident = ident;
        this.stones = stones;
        this.adjacentPit = this.findAdjacent();
    }

    findAdjacent() {
        let oppositePit = '';
        if (this.ident.endsWith('e')) {
            oppositePit = null;
        } else {
            this.player === 'r' ? oppositePit = 'g' : oppositePit = 'r';
            oppositePit = `${oppositePit}${(7 - (this.ident[1]))}`  
        }
        return oppositePit;
    }
}

/*----- app's state (variables) -----*/ 
const theBoard = new Board();
let winnerMessage = '';
let currentPlayer = '';

/*----- cached element references -----*/ 


/*----- event listeners -----*/ 


/*----- functions -----*/

function move() {
    
}