// TESTING VARIABLES
var counter = 3;
// =================

// Colour codes
var unexploredColour = "#3A383F";
var openColour = "#54A200";
var closedColour = "#294E6A";
var pathColour = "#76C3D2";
var wallColour = "#868686";

// Global parameters
var wallNumber = 100;
var gridWidth = 20;
var gridHeight = 20;
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

// Node sets
var closedSet = [];
var openSet = [];
var walls = [];

// Helpers
var helperNum;

// ====== MAIN =======
$(document).ready(function(){
	generateGrid();
	generateInit();
	// Construct the starting position into a proper node
	var startNode = makeNode(0, origin.x, origin.y);
	closedSet.push(startNode);
	findNeighbours(closedSet[closedSet.length - 1]);
	start(startNode);
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
	for(var i = 0; i < wallNumber + 2; i++){
		wX = getRandomInt(0, gridWidth - 1);
		wY = getRandomInt(0, gridHeight - 1);
		var node = {
			x : wX,
			y : wY
		}
		if(isInSet(walls, node) == -1){
			if(i < wallNumber){
				walls.push(node);
				$(makeID(node)).css("background-color", wallColour);
			}else if(wallNumber - i == 0){
				origin.x = wX;
				origin.y = wY;
				$('body').append("starting node @ " + wX + ", " + wY + "<br>");
				$(makeID(node)).css("background-color", "#FF0055")
					.text("");
			}else if(start.x != wX || start.y != wY){
				dest.x = wX;
				dest.y = wY;
				$('body').append("ending node @ " + wX + ", " + wY + "<br>");
				$(makeID(node)).css("background-color", "#EE8B00")
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
	closedSet = [];
	openSet = [];
	walls = [];
}

// Construct the final path
function getPath(finalNode){
	var pathNodes = [];
	var node = finalNode;
	while(node.x != origin.x && node.y != origin.y){
		var parent = {
			x : node.parentX,
			y : node.parentY
		}
		var parentIndex = isInSet(closedSet, parent);
		if(parentIndex >= 0){
			pathNodes.push(closedSet[parentIndex]);
			node = closedSet[parentIndex];
		}else{
			alert("Somethin went wrong while constructing the final path.");
			return 0;
		}
	}
	pathNodes.push()
	displayPath(pathNodes); // just use pop, it will be from origin to destination
	return 1;
}

function displayPath(pathNodes){
	var path = pathNodes;
	if(path.length == 0){
		return 0;
	}
	var node = path.pop();
	animateNode(node, 3);
	setTimeout(function(){displayPath(path)}, 500);
}

// NOTE: avoiding using loops to enable delay/animations when required
// ====== Iterators =======
function start(curNode){
	if(areNodesEqual(curNode, dest)){
		$(makeID(curNode)).css("background-color", "#EE8B00")
		getPath(closedSet[closedSet.length - 1]);
		return true;	// Path found
	}
	if(openSet.length == 0){
		return false;	// Path not found
	}
	openIterator(0, 0);
	closedSet.push(openSet[helperNum]);
	openSet.splice(helperNum, 1);
	setTimeout(function(){
		var len = closedSet.length;
		len--;
		animateNode(closedSet[len], 2);
		setTimeout(function(){
			findNeighbours(closedSet[closedSet.length - 1]);
			start(closedSet[closedSet.length - 1]);
		}, 500);
	}, 500);
}

// Find the node with the smallest f value in openSet
function openIterator(i, smallestIndex){
	if(i == openSet.length){
		helperNum = smallestIndex;
		return 0;
	}
	if(openSet[i].f() < openSet[smallestIndex].f()){
		openIterator(i + 1, i);
	}else{
		openIterator(i + 1, smallestIndex);
	}
}

// ====== Helpers =======
function makeNode(parentNode, curX, curY){
	var node = {
		x : curX,
		y : curY,
		g : 0,
		h : function(){return hEstimate(this.x, this.y)},
		f : function(){return this.g + this.h()},
		parentX : 0,
		parentY : 0
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

function isInSet(set, node){
	for(var i = 0; i < set.length; i++){
		var tempNode = set[i];
		if(tempNode.x == node.x && tempNode.y == node.y){
			return i;
		}
	}
	return -1;
}

function animateNode(node, type){
	var id = makeID(node);
	if(type == 1){ // from unexplored to open
		$(id).animate({backgroundColor : openColour}, 'slow');
	}else if(type == 2){ // from open to closed
		$(id).animate({backgroundColor : closedColour}, 'slow');
	}else if(type == 3){ // from closed to path
		var pathThing; // insert HTML code of circle with closed background colour ******
		var circ = $(id).append(pathThing);
		circ.animate({backgroundColor : pathColour}, 'fast');
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
	if(y < gridWidth){
		newNode = makeNode(curNode, x, y + 1); // right
		checkNeighbourNode(curNode, newNode, 0);
	}
	if(x < gridHeight){
		newNode = makeNode(curNode, x + 1, y); // bottom
		checkNeighbourNode(curNode, newNode, 0);
	}
	if(x > 0 && y > 0){
		newNode = makeNode(curNode, x - 1, y - 1); // top left
		checkNeighbourNode(curNode, newNode, 1);
	}
	if(x < gridHeight && y > 0){
		newNode = makeNode(curNode, x + 1, y - 1); // bottom left
		checkNeighbourNode(curNode, newNode, 2);
	}
	if(x > 0 && y < gridWidth){
		newNode = makeNode(curNode, x - 1, y + 1); // top right
		checkNeighbourNode(curNode, newNode, 3);
	}
	if(x < gridHeight && y < gridWidth){
		newNode = makeNode(curNode, x + 1, y + 1); // bottom right
		checkNeighbourNode(curNode, newNode, 4);
	}
}

// Check validity of each neighbouring node and keep the openSet updated
function checkNeighbourNode(parent, node, mode){
	if(isInSet(closedSet, node) >= 0 || isInSet(walls, node) >= 0){
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
				if(isInSet(walls, n1) != -1 || isInSet(walls, n2) != -1){
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
				if(isInSet(walls, n1) != -1 || isInSet(walls, n2) != -1){
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
				if(isInSet(walls, n1) != -1 || isInSet(walls, n2) != -1){
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
				if(isInSet(walls, n1) != -1 || isInSet(walls, n2) != -1){
					return false;
				}
				break;
		}
	}
	var tempG = parent.g + distance;
	var isInOpen = isInSet(openSet, node);
	if(isInOpen == -1){
		openSet.push(node);
		animateNode(node, 1);
	}else if(tempG < openSet[isInOpen].g){
		openSet[isInOpen].g = tempG;
	}
	return true;
}

// ====== TESTS =======
function printSet(set, mode){ // 0, coord only; 1, details
	$('body').append("SET contains " + set.length + " elements. <br>");
	for(var i = 0; i < set.length; i++){
		$('body').append("      " + makeID(set[i]));
		if(mode == 1){
			$('body').append(": g = " + set[i].g + ", h = " + set[i].h() + ", f = " + set[i].f());
		}
		$('body').append("<br>");
	}
	$('body').append("<br>");
}