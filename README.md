<h1>Mancala</h1>
<h3>Project 1</h3>



<h4>Wireframe:</h4>






<h4>Setup:</h4>
	Board has 12 pockets
	6 top pockets are Green player
	6 bottom pockets are Red player
	Board has 2 home-pockets (each end)
	Each pocket starts with 4 stones

<h4>Variables/States:</h4>
	12 pocket:	Number value of contents
	Location on board(Green side/Red side

	2 home-pocket: Number value of contents

	Current player: Green/Red
	
	Winner/Tied:	Message for end of game


<h4>Game play:</h4>
	First player clicks on any of the 12 pockets
	All stones are removed from clicked pocket (stone-count stored in variable)

	For every stone stored in stone-count

	    Add 1 stone to next pocket on board (moving counter clockwise)

		If this passes current player's home-pocket
			1 stone is placed in home-pocket
		Else if loop passes opponent's home-pocket
			Skip/Do not add stone in opponent's home-pocket

	If the last stone placed is in home-pocket
		Player gets another turn
	Else if the last stone is in empty pocket on player's side of board
		Stone moves to player's home-pocket
			Stones in pocket directly opposite move to player's home pocket


	

<h4>Game ends:</h4>
	if all pockets on Green player's side are empty.
		All stones in pockets on Red player's side move to Red's home-pocket
	else if all pockets on Red player's side are empty.
		All stones in pockets on Green player's side move to Green's home-pocket
	Winner message displayed for player with most stones in Home-pocket or Tie

<h4>Reset button:</h4>
	Restarts game by emptying both home-pockets and placing 4 stones in each pocket.
	

<h4>Graphics:</h4>
	Current player indicated by Green or Red triangle on each end of board.
	Winner indicated by message on screen
	Numbers shown for number of stones in each pocket/home-pocket
	Reset button


<h4>Roadmap considerations:</h4>
	Randomizing start player
	Instruction popover
	Lesson's: scenario based
