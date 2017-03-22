/* 	
	Chiho Kim, CSE 190 MX, Assignment #7
	May 16 2012
	Java Script for functions on the fifteen.html page.
	Extra feature: #1 End-of-game Notification
*/

"use strict";

// global variables for empty square's position, puzzle size, tile size, and puzzle pieces
var EMPTYROW = 3;
var EMPTYCOL = 3;
var PUZZLESIZE = 4;
var TILESIZE = 100;
var PIECES = [];
// extra feature: initially not shuffled
var SHUFFLE = false;

// This function runs once the page loads.
window.onload = function() {
	// store all the puzzle pieces into the array
	PIECES = $$("#puzzlearea div");
	// assign each piece's position, background position, and events
	for(var i = 0; i < PIECES.length; i++) {
		// x coordinate of the piece is the remainder
		// from its index divided by puzzle size multiplied by the tile size
		var left = i%PUZZLESIZE*TILESIZE;
		// y coordinate of the piece is the quotient
		// from its index divided by the puzzle size multiplied by the tile size
		var top = Math.floor(i/PUZZLESIZE)*TILESIZE;
		PIECES[i].style.left = left+"px";
		PIECES[i].style.top = top+"px";
		// negate offsets for background position
		PIECES[i].style.backgroundPosition = (-left)+"px "+(-top)+"px";
		// event handler for click and mouseover on the piece
		PIECES[i].onclick = click;
		PIECES[i].onmouseover = mouseover;
	}
	// event handler for click on the shuffle button
	$("shufflebutton").onclick = shuffle;
};

// This function runs when a puzzle piece is clicked
function click() {
	// if the piece is highlighted, move the piece
	if(this.className == "highlight") {
		move(this);
	}
}

// This function accepts a puzzle piece and moves it to the empty space.
function move(piece) {
	// store initial position of the piece in integers
	var row = parseInt(piece.style.top);
	var col = parseInt(piece.style.left);
	// set final position of the piece as the position of the empty square
	piece.style.left = EMPTYCOL*TILESIZE+"px";
	piece.style.top = EMPTYROW*TILESIZE+"px";
	// set position of the empty square to the moved piece's initial position
	EMPTYROW = row/TILESIZE;
	EMPTYCOL = col/TILESIZE;
	// extra feature: see if the move solves the puzzle
	solve();
}

// This function runs when a mouse goes over a puzzle piece.
function mouseover() {
	// if the piece is movable, give a class name "highlight"
	if(movable(this)) {
		this.className = "highlight";
		// if not, remove the class name "highlight"
		} else {
		this.removeClassName("highlight");
	}
}

// This function accepts a puzzle piece and returns whether it is movable.
function movable(piece) {
	// default is not movable
	var move = false;
	// if the piece is adjacent to the empty squre, the piece is movable
	if(Math.abs(EMPTYROW*TILESIZE-parseInt(piece.style.top)) == TILESIZE &&
		Math.abs(EMPTYCOL*TILESIZE-parseInt(piece.style.left)) == 0 ||
		Math.abs(EMPTYROW*TILESIZE-parseInt(piece.style.top)) == 0 &&
		Math.abs(EMPTYCOL*TILESIZE-parseInt(piece.style.left)) == TILESIZE) {
		move = true;
	}
	return move;
}

// This function runs when the shuffle button is clicked
function shuffle() {
	// random pieces are moved 200 times
	for(var i = 0; i < 200; i++) {
		// create an empty array
		var movables = [];
		// check each if the piece is movable
		// if movable, add the piece to the array
		for(var j = 0; j < PIECES.length; j++) {
			if(movable(PIECES[j])) {
				movables.push(PIECES[j]);
			}
		}
		// choose a random piece in the array of movable pieces
		var piece = Math.floor(Math.random()*movables.length);
		// move the piece
		move(movables[piece]);
	}
	SHUFFLE = true;
}

// Extra feature: This function tests if the puzzle is solved.
// If the puzzle is solved, the page shows notification
function solve() {
	// run test if the puzzle is shuffled
	if(SHUFFLE) {
		// initially good
		var good = true;
		// test all the pieces
		for(var i = 0; i < PIECES.length; i++) {
			// expected position for each piece
			var left = i%PUZZLESIZE*TILESIZE;
			var top = Math.floor(i/PUZZLESIZE)*TILESIZE;
			// if the position is not expected, it is no more good
			if(!(PIECES[i].style.left == left+"px" && PIECES[i].style.top == top+"px")) {
				good = false;
			}
		}
		// if still good, call victory to show notification
		if(good) {
			victory();
		}
	}
}

// Extra feature: This function runs if the puzzle is solved. 
function victory() {
	// change heading and the first paragraph
	document.querySelector("h1").innerHTML = "Congratulations!";
	document.querySelector("p").innerHTML = "Now go play.";
	// send message
	alert("You win!");
	// open diablo website
	window.open("http://us.battle.net/d3/en/?-");
	// must shuffle again to win
	SHUFFLE = false;
}