var counter = 3;

var unexploredColour = "#3A383F";
var openColour = "#54A200";
var closedColour = "#294E6A";
var pathColour = "#76C3D2";
var wallColour = "#868686";

var wallNumber = 30;
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
var closedSet = [];
var openSet = [];
var walls = [];

$(document).ready(function(){
	var startX;
	var startY;
	generateGrid();
	generateInit();
	var startNode = {
		x : origin.x,
		y : origin.y,
		g : 0,
		h : hEstimate(origin.x, origin.y),
		parentX : -1,
		parentY : -1
	}
	openSet.push(startNode);
	$('body').append("<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>");
	start();
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

// Generate the static elements
function generateInit(){
	var wX;
	var wY;
	for(var i = 0; i < wallNumber + 2; i++){
		wX = getRandomInt(0, gridWidth - 1);
		wY = getRandomInt(0, gridHeight - 1);
		var wall = {
			x : wX,
			y : wY
		}
		if(isInSet(walls, wall) == -1){
			if(i < wallNumber){
				walls.push(wall);
				$(makeID(wall)).css("background-color", wallColour);
			}else if(wallNumber - i == 0){
				origin.x = wX;
				origin.y = wY;
				$(makeID(wall)).css("background-color", openColour)
					.text("");

			}else{
				dest.x = wX;
				dest.y = wY;
				$(makeID(wall)).css("background-color", "#EE8B00")
					.text("");
			}
		}
	}
}

// Magic starts
function start(){
	while(openSet.length != 0){
		var smallestFNode = openSet[0];
		var index = 0;
		var i = 1;
		while(i < openSet.length){
			$('body').append('IN OPENSET: ');
			printNode(openSet[i]);
			if(openSet[i].g + openSet[i].h < smallestFNode.g + smallestFNode.h){
				$('body').append('TEMP SMALLEST: ');
				printNode(smallestFNode);
				smallestFNode = openSet[i];
				index = i;
			}
			i++;
		}
		$('body').append('smallest: ');
		printNode(smallestFNode);
		$('body').append('<br>');
		if(smallestFNode.x == dest.x && smallestFNode.y == dest.y){
			return getPath(smallestFNode);
		}
		closedSet.push(smallestFNode);
		animateNode(smallestFNode, 2);
		openSet.splice(i, 1);
		findNeighbours(smallestFNode);
		counter++
		if(counter > 100){
			break;
		}
	}
	fail();
	return 0;
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

function makeNode(parentNode, curX, curY){
	var node = {
		x : curX,
		y : curY,
		g : 0,
		h : hEstimate(curX, curY),
		parentX : parentNode.x,
		parentY : parentNode.y
	}
	if(Math.abs(parentNode.x - curX) == 1 && Math.abs(parentNode.y - curY) == 1){
		node.g = diagDistance + parentNode.g;
	}else{
		node.g = unitDistance + parentNode.g;
	}
	return node;
}

function hEstimate(x, y){
	var len = Math.abs(dest.x - x) * unitDistance;
	var hei = Math.abs(dest.y - y) * unitDistance;
	return len + hei;
}

// Fine all neighbour nodes of the current node and analyze them
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
	if(x > 0 && y < gridWidth){
		newNode = makeNode(curNode, x - 1, y + 1); // bottom left
		checkNeighbourNode(curNode, newNode, 1);
	}
	if(x < gridHeight && y > 0){
		newNode = makeNode(curNode, x + 1, y - 1); // top right
		checkNeighbourNode(curNode, newNode, 1);
	}
	if(x < gridHeight && y < gridWidth){
		newNode = makeNode(curNode, x + 1, y + 1); // bottom right
		checkNeighbourNode(curNode, newNode, 1);
	}
	printNode(curNode);

}

// Check each neighbouring node and keep the openSet updated
function checkNeighbourNode(parent, node, mode){
	if(isInSet(closedSet, node) >= 0 || isInSet(walls, node) >= 0){
		return false;
	}
	var distance;
	if(mode == 0){
		distance = unitDistance;
	}else{
		distance = diagDistance;
	}
	var tempG = parent.g + distance;
	var isInOpen = isInSet(openSet, node);
	if(isInOpen == -1 || tempG < node.g){
		node.g = tempG;
		node.f = tempG + node.h;
		if(isInOpen == -1){
			openSet.push(node);
			animateNode(node, 1);
		}
	}
	for(var i; i < openSet.length; i++){
		printNode(openSet[i]);
	}
	return true;
}

// Check whether or not a given node is in some set
function isInSet(set, node){
	for(var i = 0; i < set.length; i++){
		var tempNode = set[i];
		if(tempNode.x == node.x && tempNode.y == node.y){
			return i;
		}
	}
	return -1;
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
	while(path.length != 0){
		var node = path.pop();
		animateNode(node, 3);
	}
}

function fail(){}

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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printNode(node){
	$('body').append('Node at ' + node.x + '/' + node.y + ' has g value ' + node.g + ', h value ' + node.h + '. Number of nodes in open: ' + openSet.length + '. Number of nodes in closed: ' + closedSet.length + ' <br>');
}