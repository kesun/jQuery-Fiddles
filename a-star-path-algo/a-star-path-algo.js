var unexploredColour = "#3A383F";
var openColour = "#54A200";
var closedColour = "#294E6A";
var pathColour = "#76C3D2";

var wallNumber = 30;

var walls = [];
var gridWidth;
var gridHeight;
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
var directedNodes = {};

$(document).ready(function(){
	var startX;
	var startY;
	var startNode = {
		x : origin.x,
		y : origin.y,
		g : 0;
		h : hEstimate(origin.x, origin.y),
		parentX : -1,
		parentY : -1
	}
	openSet.push(startNode);
	animateNode(startNode, 1);
	start(startNode);
});

function makeNode(parentNode, curX, curY){
	var node = {
		x : curX,
		y : curY,
		g : -1,
		h : hEstimate(curX, curY),
		parentX : parentNode.x,
		parentY : parentNode.y
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
	if(x > 0){
		if(y > 0){
			newNode = makeNode(curNode, x, y - 1); // top
			checkNeighbourNode(curNode, newNode, 1);
			newNode = makeNode(curNode, x - 1, y - 1); // top left
		}else if(y < gridHeight){
			newNode = makeNode(curNode, x, y + 1); // bottom
			checkNeighbourNode(curNode, newNode, 1);
			newNode = makeNode(curNode, x - 1, y + 1); // bottom left
		}
		checkNeighbourNode(curNode, newNode, 1);
		newNode = makeNode(curNode, x - 1, y); // left
	}
	if(x < gridWidth){
		if(y > 0){
			newNode = makeNode(curNode, x, y - 1); // top
			checkNeighbourNode(curNode, newNode, 1);
			newNode = makeNode(curNode, x + 1, y - 1); // top right
		}else if(y < gridHeight){
			newNode = makeNode(curNode, x, y + 1); // bottom
			checkNeighbourNode(curNode, newNode, 1);
			newNode = makeNode(curNode, x + 1, y + 1); // bottom right
		}
		checkNeighbourNode(curNode, newNode, 1);
		newNode = makeNode(curNode, x + 1, y); // right
	}

}

// Check each neighbouring node and keep the openSet updated
function checkNeighbourNode(parent, node, mode){
	if(isInSet(closedSet, node) >= 0 || isInSet(walls, node >= 0)){
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

function start(startNode){
	while(openSet.length != 0){
		var smallestFNode = openSet[0];
		var index = 0;
		for(int i = 1; i < openSet.length; i++){
			if(openSet[i].f > smallestFNode.f){
				smallestFNode = openSet[i];
				index = i;
			}
		}
		if(smallestFNode.x == dest.x && smallestFNode.y == dest.y){
			return getPath(smallestFNode);
		}
		closedSet.push(smallestFNode);
		animateNode(smallestFNode, 2);
		openSet.splice(i, 1);
		findNeighbours(smallestFNode);
	}
	fail();
	return 0;
}

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
		$(id).animate({backgroundColor : openColour}, 'fast');
	}else if(type == 2){ // from open to closed
		$(id).animate({backgroundColor : closedColour}, 'fast');
	}else if(type == 3){ // from closed to path
		var pathThing; // insert HTML code of circle with closed background colour ******
		var circ = $(id).append(pathThing);
		circ.animate({backgroundColor : pathColour}, 'fast');
	}
}

function makeID(node){
	var x = toString(node.x);
	var y = toString(node.y);
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

function generateWall(){
	var x;
	var y;
	for(var i = 0; i < wallNumber; i++){
		x = getRandomInt(0, 19).toString();
		y = getRandomInt(0, 19).toString();
	}
}