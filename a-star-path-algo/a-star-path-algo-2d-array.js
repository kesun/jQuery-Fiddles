// TESTING VARIABLES
var counter = 3;
// =================

// Colour codes
var unexploredColour = "transparent";
var openColour = "#D56AFF";
var closedColour = "#562E6E";
var pathColour = "#FFFF7A";
var wallColour = "#868686";
var startColour = "#FF0095";
var destColour = "#00ABFF";
var greyButton = "#53707C";
var liveButton = "#008CC9";

// Global parameters
var interval = 100;
var wallNumber = 500;
var gridWidth = 60;
var gridHeight = 60;
var unitDistance = 10;
var diagDistance = 14;
var origin = {
	x : 0,
	y : 0
};
var dest = {
	x : 0,
	y : 0
};
var openSetCoord;
var openCounter;
var closedCounter;

// Le grid
var grid;

// Helpers
var helperNum;
var pathSize;

// ====== MAIN =======
$(document).ready(function(){
	generateGrid();
	$(".initialInput").val(500);
	generateInit();
	// Construct the starting position into a proper node
	$('#start').click(function(){
		$(this).prop('disabled', true)
			.css('background-color', greyButton);
		$('#reset').prop('disabled', true)
			.css('background-color', greyButton);
		var startNode = makeNode(0, origin.x, origin.y);
		startNode.group = 2;
		closedCounter++;
		grid[origin.x][origin.y] = startNode;
		findNeighbours(closedSet[closedSet.length - 1]);
		start(startNode);
	});
	$('#reset').click(function(){
		$('#result').text("");
		wallNumber = $(".initialInput").val();
		reset();
		generateInit();
		$('#start').prop('disabled', false)
			.css('background-color', liveButton);
	});
	$(".initialInput").focusout(function(){
		var tempVal = Number($(".initialInput").val());
		if(tempVal < 0 || tempVal > 3598 || tempVal == ""){
			alert("Please enter a number between 0 ~ 398 only.");
			$(".initialInput").val(500);
		}
	});
});

function generateGrid(){
	for(var i = 0; i < gridWidth; i++){
		for(var j = 0; j < gridHeight; j++){
			var node = {
				x : i,
				y : j
			}
			var id = makeID(node);
			id = id.substring(1);
			$(".mainFrame").append('<div class="node" id="' + id + '"></div>');
		}
		$(".mainFrame").append('<br>');
	}
}

function generateInit(){
	var wX;
	var wY;
	openCounter = 0;
	closedCounter = 0;
	openSetCoord = [];
	grid = new Array(gridHeight);
	for(var i = 0; i < gridHeight; i++){
		grid[i] = new Array(gridWidth);
		for(var j = 0; j < gridWidth; j++){
			grid[i][j] = 0;
		}
	}
	wallNumber = Number($(".initialInput").val());
	for(var i = 0; i < wallNumber + 2; i++){
		wX = getRandomInt(0, gridWidth - 1);
		wY = getRandomInt(0, gridHeight - 1);
		var node = {
			x : wX,
			y : wY
		}
		if(grid[wX][wY] == 0){
			if(i < wallNumber){
				grid[wX][wY] = -1;
				$(makeID(node)).css("background-color", wallColour);
			}else if(wallNumber - i == 0){
				origin.x = wX;
				origin.y = wY;
				$(makeID(node)).css("background-color", startColour)
					.text("");
			}else if(origin.x != wX || origin.y != wY){
				dest.x = wX;
				dest.y = wY;
				$(makeID(node)).css("background-color", destColour)
					.text("");
			}else{
				i--;
			}
		}else{
			i--;
		}
	}
}

function reset(){
	for(var i = 0; i < gridWidth; i++){
		for(var j = 0; j < gridHeight; j++){
			var node = {
				x : i,
				y : j
			}
			$(makeID(node)).css("background-color", unexploredColour)
				.empty();
		}
	}
	grid = [];
}

// Construct the final path
function getPath(finalNode){
	var pathNodes = [];
	var node = finalNode;
	pathSize = 0;
	while(node.x != origin.x || node.y != origin.y){
		var parent = {
			x : node.parentX,
			y : node.parentY
		}
		if(Math.abs(parent.x - node.x) == 1 && Math.abs(parent.y - node.y) == 1){
			pathSize += diagDistance;
		}else{
			pathSize += unitDistance;
		}
		//var parentIndex = isInSet(closedSet, parent);
		if(grid[parent.x][parent.y] > 0 && grid[parent.x][parent.y].group == 2){
			pathNodes.push(grid[parent.x][parent.y]);
			node = grid[parent.x][parent.y];
		}else{
			alert("Somethin went wrong while constructing the final path.");
			return 0;
		}
	}
	pathNodes.pop();
	displayPath(pathNodes); // just use pop, it will be from origin to destination
	return 1;
}

function displayPath(pathNodes){
	var path = pathNodes;
	if(path.length == 0){
		$('#result').text("Size of path: " + pathSize);
		$('#reset').prop('disabled', false)
			.css('background-color', liveButton);
		return 0;
	}
	var node = path.pop();
	animateNode(node, 3);
	setTimeout(function(){displayPath(path)}, interval);
}

// NOTE: avoiding using loops to enable delay/animations when required
// ====== Iterators =======
function start(curNode){
	if(areNodesEqual(curNode, dest)){
		getPath(curNode);
		return true;	// Path found
	}
	if(openCounter == 0){
		$('#result').text("A path is not found!");
		$('#reset').prop('disabled', false)
			.css('background-color', liveButton);
		return false;	// Path not found
	}
	closedSet.push(openSet.pop());
	setTimeout(function(){
		var len = closedSet.length;
		len--;
		animateNode(closedSet[len], 2);
		setTimeout(function(){
			findNeighbours(closedSet[closedSet.length - 1]);
			start(closedSet[closedSet.length - 1]);
		}, interval);
	}, interval);
}

// ====== Helpers =======
function findSmallestOpen(){
	for(var i = 0; i < openCounter;)
}

function makeNode(parentNode, curX, curY){
	var node = {
		x : curX,
		y : curY,
		g : 0,
		h : function(){return hEstimate(this.x, this.y)},
		f : function(){return this.g + this.h()},
		parentX : 0,
		parentY : 0,
		group : 0
	}
	if(parentNode != 0){
		node.parentX = parentNode.x;
		node.parentY = parentNode.y;
		if(Math.abs(parentNode.x - curX) == 1 && Math.abs(parentNode.y - curY) == 1){
			node.g = diagDistance + parentNode.g;
		}else{
			node.g = unitDistance + parentNode.g;
		}
	}
	return node;
}

function hEstimate(x, y){
	var len = Math.abs(dest.x - x) * unitDistance;
	var hei = Math.abs(dest.y - y) * unitDistance;
	return len + hei;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeID(node){
	var x = node.x.toString();
	var y = node.y.toString();
	if(x.length == 1){
		x = "0" + x;
	}
	if(y.length == 1){
		y = "0" + y;
	}
	return "#" + x + y;
}

function areNodesEqual(node1, node2){
	if(node1.x == node2.x && node1.y == node2.y){
		return true;
	}
	return false;
}

function animateNode(node, type){
	var id = makeID(node);
	if(areNodesEqual(dest, node)){
		return 0;
	}
	if(type == 1){ // from unexplored to open
		$(id).animate({backgroundColor : openColour}, 'slow');
	}else if(type == 2){ // from open to closed
		$(id).animate({backgroundColor : closedColour}, 'slow');
	}else if(type == 3){ // from closed to path
		var pathThing; // insert HTML code of circle with closed background colour ******
		var circ = $(id).append(pathThing);
		circ.animate({backgroundColor : pathColour}, 'slow');
	}
}

function findNeighbours(curNode){
	var x = curNode.x;
	var y = curNode.y;
	var newNode;
	//Check the existence of the 8 surrounding neighbours, and add them to openSet
	if(y > 0){
		newNode = makeNode(curNode, x, y - 1); // left
		checkNeighbourNode(curNode, newNode, 0);
	}
	if(x > 0){
		newNode = makeNode(curNode, x - 1, y); // top
		checkNeighbourNode(curNode, newNode, 0);
	}
	if(y < gridWidth - 1){
		newNode = makeNode(curNode, x, y + 1); // right
		checkNeighbourNode(curNode, newNode, 0);
	}
	if(x < gridHeight - 1){
		newNode = makeNode(curNode, x + 1, y); // bottom
		checkNeighbourNode(curNode, newNode, 0);
	}
	if(x > 0 && y > 0){
		newNode = makeNode(curNode, x - 1, y - 1); // top left
		checkNeighbourNode(curNode, newNode, 1);
	}
	if(x < gridHeight - 1 && y > 0){
		newNode = makeNode(curNode, x + 1, y - 1); // bottom left
		checkNeighbourNode(curNode, newNode, 2);
	}
	if(x > 0 && y < gridWidth - 1){
		newNode = makeNode(curNode, x - 1, y + 1); // top right
		checkNeighbourNode(curNode, newNode, 3);
	}
	if(x < gridHeight - 1 && y < gridWidth - 1){
		newNode = makeNode(curNode, x + 1, y + 1); // bottom right
		checkNeighbourNode(curNode, newNode, 4);
	}
}

// Check validity of each neighbouring node and keep the openSet updated
function checkNeighbourNode(parent, node, mode){
	if((grid[node.x][node.y] > 0 && grid[node.x][node.y].group == 2) || grid[node.x][node.y] == -1){
		return false;
	}
	var distance;
	if(mode == 0){
		distance = unitDistance;
	}else{
		distance = diagDistance;
		// NO cutting corners of a wall if moving diagonally
		switch(mode){
			case 1:
				var n1 = {
					x : node.x,
					y : node.y + 1
				}
				var n2 = {
					x : node.x + 1,
					y : node.y
				}
				if(grid[n1.x][n1.y] != -1 || grid[n2.x][n2.y] != -1){
					return false;
				}
				break;
			case 2:
				var n1 = {
					x : node.x - 1,
					y : node.y
				}
				var n2 = {
					x : node.x,
					y : node.y + 1
				}
				if(grid[n1.x][n1.y] != -1 || grid[n2.x][n2.y] != -1){
					return false;
				}
				break;
			case 3:
				var n1 = {
					x : node.x,
					y : node.y - 1
				}
				var n2 = {
					x : node.x + 1,
					y : node.y
				}
				if(grid[n1.x][n1.y] != -1 || grid[n2.x][n2.y] != -1){
					return false;
				}
				break;
			case 4:
				var n1 = {
					x : node.x - 1,
					y : node.y
				}
				var n2 = {
					x : node.x,
					y : node.y - 1
				}
				if(grid[n1.x][n1.y] != -1 || grid[n2.x][n2.y] != -1){
					return false;
				}
				break;
		}
	}
	var tempG = parent.g + distance;
	var isInOpen = grid[node.x][node.y];
	if(isInOpen > 0 && isInOpen.group != 1){	// if node is not in openSet
		// openSet.push(node);
		grid[node.x][node.y].group = 1;
		openCounter++;
		openSetCoord.push(node);
		animateNode(node, 1);
	}else if(tempG < isInOpen.g){
		grid[node.x][node.y].g = tempG;
		grid[node.x][node.y].parentX = parent.x;
		grid[node.x][node.y].parentY = parent.y;
	}
	return true;
}

// ====== TESTS =======
function printSet(set, mode){ // 0, coord only; 1, details; 2, parent
	$('body').append("SET contains " + set.length + " elements. <br>");
	for(var i = 0; i < set.length; i++){
		$('body').append("      " + makeID(set[i]));
		if(mode >= 1){
			$('body').append(": g = " + set[i].g + ", h = " + set[i].h() + ", f = " + set[i].f());
		}
		if(mode >= 2){
			if(set[i].parentX >= 0 && set[i].parentY >= 0){
				$('body').append(" Parent node: " + set[i].parentX + ", " + set[i].parentY);
			}else{
				$('body').append(" No parent found");
			}
		}
		$('body').append("<br>");
	}
	$('body').append("<br>");
}