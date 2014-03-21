var x;
var y;
var ID;
var tempID;
var change = 0;
var numRow = 4;
var numCol = 4;
var emptySpace = 0;

function checkWinner(){
	for(var i = 1; i <= numRow; i++){
		for(var j = 1; j <= numCol; j++){
			tempID = "#" + i + j;
			if($(tempID).is(":empty")){
				emptySpace = 1;
			}else if($(tempID).text() == "2048"){
				return 1;
			}
		}
	}
	return 0;
}

function declareWinner(){
	$("body").append("<p>We have a winner!</p>");
}

function declareLoser(){
	$("body").append("<p>You are out of moves!</p>");
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCord(){
	x = getRandomInt(1,4);
	y = getRandomInt(1,4);
	return "#" + x + y;
}

function spawn(){
	tempID = getCord();
	while(!($(tempID).is(":empty"))){
		tempID = getCord();
	}
	
	$(tempID).append("<p>2</p>");
}

function testSpawn(){
	$("#12").append("<p>2</p>");
	$("#21").append("<p>2</p>");
	$("#22").append("<p>2</p>");
	$("#24").append("<p>2</p>");
	$("#33").append("<p>2</p>");
	$("#42").append("<p>2</p>");
	$("#43").append("<p>2</p>");
}

function moveValueTo(origID, newID, value){
	$("p", newID).remove("p");
	$(newID).append("<p>" + value + "</p>");
	$("p", origID).remove("p");
}

function moveUp(){
	var targetRow = 1;
	var prevValue = 0;
	var prevRow = 0;
	
	for(var col = 1; col <= numCol; col++){
		targetRow = 1;
		prevValue = 0;
		prevRow = 0;
		
		for(var row = 1; row <= numRow; row++){
			var curID = "#" + row + col;
			if(!($(curID).is(":empty"))){	// If box not empty
				if(prevValue == 0){	// If there is no unused previous value
					prevValue = $(curID).text();	// Flag cur value
					prevRow = targetRow;	// Flag cur row
					if(targetRow < row){
						moveValueTo(curID, "#" + targetRow + col, prevValue);
						change = 1;
					}
					targetRow++;
				}else{	// If there is unused previous value
					if(prevValue == $(curID).text()){	// If prev value == cur value
						var sum = Number(prevValue) + Number($(curID).text());
						moveValueTo(curID, "#" + prevRow + col, sum);
						prevValue = 0;
						prevRow = 0;
						change = 1;
					}else{	// If prev value != cur value
						row--;
						prevValue = 0;
						prevRow = 0;
					}
				}
			}
		}
	}
}

function moveDown(){
	var targetRow = numRow;
	var prevValue = 0;
	var prevRow = 0;
	
	for(var col = 1; col <= numCol; col++){
		targetRow = numRow;
		prevValue = 0;
		prevRow = 0;
		
		for(var row = numRow; row >= 1; row--){
			var curID = "#" + row + col;
			if(!($(curID).is(":empty"))){	// If box not empty
				if(prevValue == 0){	// If there is no unused previous value
					prevValue = $(curID).text();	// Flag cur value
					prevRow = targetRow;	// Flag cur row
					if(targetRow > row){
						moveValueTo(curID, "#" + targetRow + col, prevValue);
						change = 1;
					}
					targetRow--;
				}else{	// If there is unused previous value
					if(prevValue == $(curID).text()){	// If prev value == cur value
						var sum = Number(prevValue) + Number($(curID).text());
						moveValueTo(curID, "#" + prevRow + col, sum);
						prevValue = 0;
						prevRow = 0;
						change = 1;
					}else{	// If prev value != cur value
						row++;
						prevValue = 0;
						prevRow = 0;
					}
				}
			}
		}
	}
}

function moveLeft(){
	var targetCol = 1;
	var prevValue = 0;
	var prevCol = 0;
	
	for(var row = 1; row <= numRow; row++){
		targetCol = 1;
		prevValue = 0;
		prevCol = 0;
		
		for(var col = 1; col <= numCol; col++){
			var curID = "#" + row + col;
			if(!($(curID).is(":empty"))){	// If box not empty
				if(prevValue == 0){	// If there is no unused previous value
					prevValue = $(curID).text();	// Flag cur value
					prevCol = targetCol;	// Flag cur row
					if(targetCol < col){
						moveValueTo(curID, "#" + row + targetCol, prevValue);
						change = 1;
					}
					targetCol++;
				}else{	// If there is unused previous value
					if(prevValue == $(curID).text()){	// If prev value == cur value
						var sum = Number(prevValue) + Number($(curID).text());
						moveValueTo(curID, "#" + row + prevCol, sum);
						prevValue = 0;
						prevCol = 0;
						change = 1;
					}else{	// If prev value != cur value
						col--;
						prevValue = 0;
						prevCol = 0;
					}
				}
			}
		}
	}
}

function moveRight(){
	var targetCol = numCol;
	var prevValue = 0;
	var prevCol = 0;
	
	for(var row = 1; row <= numRow; row++){
		targetCol = numCol;
		prevValue = 0;
		prevCol = 0;
		
		for(var col = numCol; col >= 1; col--){
			var curID = "#" + row + col;
			if(!($(curID).is(":empty"))){	// If box not empty
				if(prevValue == 0){	// If there is no unused previous value
					prevValue = $(curID).text();	// Flag cur value
					prevCol = targetCol;	// Flag cur row
					if(targetCol > col){
						moveValueTo(curID, "#" + row + targetCol, prevValue);
						change = 1;
					}
					targetCol--;
				}else{	// If there is unused previous value
					if(prevValue == $(curID).text()){	// If prev value == cur value
						var sum = Number(prevValue) + Number($(curID).text());
						moveValueTo(curID, "#" + row + prevCol, sum);
						prevValue = 0;
						prevCol = 0;
						change = 1;
					}else{	// If prev value != cur value
						col++;
						prevValue = 0;
						prevCol = 0;
					}
				}
			}
		}
	}
}

$(document).ready(function(){
	//init
	/*
	spawn();
	spawn();
	*/
	
	testSpawn();
	
	$(document).keydown(function(key) {
        switch(parseInt(key.which,10)) {
			// Left arrow key pressed
			case 37:
				moveLeft();
				break;
			// Up Arrow Pressed
			case 38:
		        moveUp();
				break;
			// Right Arrow Pressed
			case 39:
				moveRight();
				break;
			// Down Array Pressed
			case 40:
				moveDown();
				break;
		}
		
		if(checkWinner() == 1){
			declareWinner();
		}
		
		if(change == 1){
			spawn();
		}else if(emptySpace == 0){
			declareLoser();
		}
		change = 0;
	});
});