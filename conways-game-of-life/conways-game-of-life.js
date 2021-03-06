var IDs = [];
var aliveColour = "#B40431";
var deadColour = "rgba(0, 0, 0, 0)";
var newbornColour = "#FF8000";
var madeMove = 1;
var genetationCounter = 0;
var numBlocks = 40;

$(document).ready(function(){
	init();
	//makeCluster1();
	//makeCluster2();
	makeAliveCells();
	var actionInterval;
	$("#start").click(function(){
		if($("#start").text() == "Start"){
			actionInterval = setInterval(function(){
				if(madeMove == 1){
					start();
					if(madeMove == 1){
						genetationCounter++;
					}
					$(".counterInput").attr("value", genetationCounter);
				}else{
					clearInterval(actionInterval);
					$("#start").text("Start");
				}
			}, 500);
			//start();
			$("#start").text("Stop");
		}else{
			clearInterval(actionInterval);
			$("#start").text("Start");
		}
	});
	$("#reset").click(function(){
		stop(actionInterval);
		numBlocks = $(".initialInput").val();
	});
	if(madeMove == 0){
		stop(actionInterval);
	}
	$(".initialInput").focusout(function(){
		var tempVal = Number($(".initialInput").val());
		if(tempVal < 0 || tempVal > 400 || tempVal == ""){
			alert("Please enter a number between 0 ~ 400 only.");
			$(".initialInput").val(40);
		}
		numBlocks = Number($(".initialInput").val());
	});
});

function test(value){
	$('body').append(value);
}

function makeCluster1(){
	$("#0505").css("background-color", aliveColour);
	$("#0705").css("background-color", aliveColour);
	$("#0506").css("background-color", aliveColour);
}

function makeCluster2(){
	$("#1010").css("background-color", aliveColour);
	$("#1011").css("background-color", aliveColour);
	$("#1012").css("background-color", aliveColour);
}

function init(){
	for(var i = 0; i < 20; i++){
		var row = i.toString();
		if(row.length < 2){
			row = "0" + row;
		}
		for(var j = 0; j < 20; j++){
			var col =j.toString();
			if(col.length < 2){
				col = "0" + col;
			}
			var newCellID = row + col;
			IDs.push(newCellID);
			$('.mainFrame').append('<div class="cell" id="' + newCellID + '" style="background-color: ' + deadColour + '; color: #FF71FF"></div>');
		}
		$('.mainFrame').append('<br/>');
	}
	$(".counterInput").attr("value", 0);
	genetationCounter = 0;
	$(".initialInput").val(40);
	numBlocks = $(".initialInput").val();
}

function reset(){
	for(var i = 0; i < 20; i++){
		var row = i.toString();
		if(row.length < 2){
			row = "0" + row;
		}
		for(var j = 0; j < 20; j++){
			var col =j.toString();
			if(col.length < 2){
				col = "0" + col;
			}
			var newCellID = "#" + row + col;
			$(newCellID).css("background-color", deadColour)
				.css("color", "#FF71FF")
				.attr("data-value", 0);
			//$(newCellID).css;
		}
	}
	madeMove = 1;
	$(".counterInput").attr("value", 0);
	genetationCounter = 0;
	numBlocks = Number($(".initialInput").val());
}

function start(){
	/*
	var curIndex = 0;
	for(var i = 0; i < 20; i++){
		for(var j = 0; j < 20; j++){
			checkCell(i, j, curIndex);
			curIndex++;
		}
		curIndex++;
	}
	curIndex = 0;
	for(var i = 0; i < 20; i++){
		for(var j = 0; j < 20; j++){
			modifyCell(i, j, curIndex);
			curIndex++;
		}
		curIndex++;
	}
	*/
	madeMove = 0;
	for(var i = 0; i < 20; i++){
		var row = i.toString();
		if(row.length < 2){
			row = "0" + row;
		}
		for(var j = 0; j < 20; j++){
			var col =j.toString();
			if(col.length < 2){
				col = "0" + col;
			}
			var newCellID = "#" + row + col;
			checkCell(i, j, newCellID);
		}
	}
	for(var i = 0; i < 20; i++){
		var row = i.toString();
		if(row.length < 2){
			row = "0" + row;
		}
		for(var j = 0; j < 20; j++){
			var col =j.toString();
			if(col.length < 2){
				col = "0" + col;
			}
			var newCellID = "#" + row + col;
			modifyCell(row, col, newCellID);
		}
	}
}

function stop(actionInterval){
	$("#start").text("Start");
	reset();
	makeAliveCells();
	clearInterval(actionInterval);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAliveCells(){
	var row;
	var col;
	var id;
	var numCells = numBlocks;
	do{
		row = getRandomInt(0, 19).toString();
		col = getRandomInt(0, 19).toString();
		if(row.length < 2){
			row = "0" + row;
		}
		if(col.length < 2){
			col = "0" + col;
		}
		id = "#" + row + col;
		if($(id).css("background-color") == deadColour){
			$(id).css("background-color", newbornColour)
				.css("color", "#BB4600");
			numCells--;
		}
	}while(numCells > 0);
}

function checkCell(row, col, curID){ // Check the number of neighbours of a cell
	var numNeighbour = getNeighbours(row, col);
	$(curID).attr("data-value", numNeighbour);
}

function modifyCell(row, col){
	var curID = "#" + row + col
;	if($(curID).css("background-color") == deadColour){
		modifyDeadCell(row, col, curID);
	}else{
		modifyAliveCell(row, col, curID);
	}
}

function modifyAliveCell(row, col, curID){
	//test(curID + " is a live cell<br/>");
	var numNeighbour = $(curID).attr("data-value");
	if(numNeighbour < 2 || numNeighbour > 3){
		$(curID).css("background-color", deadColour)
			.css("color", "#FF71FF");
		madeMove = 1;
	}else{
		$(curID).css("background-color", aliveColour)
			.css("color", "#D23E81");
	}
}

function modifyDeadCell(row, col, curID){
	//test(curID + " is a dead cell<br/>");
	var numNeighbour = $(curID).attr("data-value");
	if(numNeighbour == 3){
		$(curID).css("background-color", newbornColour)
			.css("color", "#BB4600");
		madeMove = 1;
	}
}
function getNeighbours(row, col){
	return checkLeft(row, col) + checkRight(row, col) + checkTop(row, col) + checkBottom(row, col) + checkLeftTop(row, col) + checkRightTop(row, col) + checkLeftBottom(row, col) + checkRightBottom(row, col);
}
function checkLeft(row, col){
	if(col > 0){
		var newRow = row.toString();
		var newCol = (col - 1).toString();
		return checkHelper(newRow, newCol);
	}
	return 0;
}
function checkTop(row, col){
	if(row > 0){
		var newRow = (row - 1).toString();
		var newCol = col.toString();
		return checkHelper(newRow, newCol);
	}
	return 0;
}
function checkRight(row, col){
	if(col < 19){
		var newRow = row.toString();
		var newCol = (col + 1).toString();
		return checkHelper(newRow, newCol);
	}
	return 0;
}
function checkBottom(row, col){
	if(row < 19){
		var newRow = (row + 1).toString();
		var newCol = col.toString();
		return checkHelper(newRow, newCol);
	}
	return 0;
}
function checkLeftTop(row, col){
	if(row > 0 && col > 0){
		var newRow = (row - 1).toString();
		var newCol = (col - 1).toString();
		return checkHelper(newRow, newCol);
	}
	return 0;
}
function checkLeftBottom(row, col){
	if(row > 0 && col < 19){
		var newRow = (row - 1).toString();
		var newCol = (col + 1).toString();
		return checkHelper(newRow, newCol);
	}
	return 0;
}
function checkRightTop(row, col){
	if(row < 19 && col > 0){
		var newRow = (row + 1).toString();
		var newCol = (col - 1).toString();
		return checkHelper(newRow, newCol);
	}
	return 0;
}
function checkRightBottom(row, col){
	if(row < 19 && col < 19){
		var newRow = (row + 1).toString();
		var newCol = (col + 1).toString();
		return checkHelper(newRow, newCol);
	}
	return 0;
}
function checkHelper(row, col){
	if(row.length < 2){
		row = "0" + row;
	}
	if(col.length < 2){
		col = "0" + col;
	}
	var tempID = "#" + row + col;
	if($(tempID).css("background-color") != deadColour){
		return 1;
	}
	return 0;
}