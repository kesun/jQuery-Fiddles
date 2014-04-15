// GLOBAL RESOURCES
var mouseButtonDown = 0; // 1 = left, 2 = middle, 3 = right
var sourceNode = 0;
var alphabetsUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var alphabetsLower = "abcdefghijklmnopqrstuvwxyz";

// Housekeeping things
window.oncontextmenu = function () { return false; }

$(document).ready(function () {
	$(".vertex").draggable({
        containment: "parent",
        snap: true
    });

    // Mouse down
    $(".vertex").mousedown(function() {
    	$(document).mousemove(linkMouseMoveEvent);
    	// Determine the type of action
    	$(document).bind('mousedown.link', function (event) {
    		switch(event.which) {
    			case 1:
    				// Left mouse button pressed
    				mouseButtonDown = 1;
    				moveNode($(this));
    				break;
    			case 2:
    				// Middle mouse button pressed
    				mouseButtonDown = 2;
    				$(document).mousemove(linkMouseMoveEvent(2, sourceNode, -1));
    				sourceNode = $(this);
    				makeLineOnly($(this));
    				break;
    			case 3:
    				// Right mouse button pressed
    				mouseButtonDown = 3;
    				makeNodeLine($(this));
    				break;
    		}
    	});
    	// Mouse up
    	$(document).bind('mouseup.link', function (event) {
			switch (event.which) {
				case 1:
					confirmLine();
					break;
				case 2:
					endLinkMode();
					break;
			}
		});
		// Key down
    	$(document).bind('keydown.link', function (event) {
    		switch(event.which) {
    			case 88:
    				// X key is pressed
    				// Left mouse button drag + X = delete current vertex
    				if(mouseButtonDown == 1) { deleteNode($(this)); }
    				break;
    		}
    	});
    });
});

function linkMouseMoveEvent(event) {
	// If moving node only
	if(mouseButtonDown == 1){
		lines.each(function() {
			var staticNode;
			if($(this).data("nodeA") == sourceNode.data("id")) { staticNode = $(sourceNode.data("nodeA")); }
			else { staticNode = $(sourceNode.data("nodeB")); }

			if($(this).length > 0) {
				var originX = staticNode.position().left + staticNode.outerWidth() / 2;
		        var originY = staticNode.position().top + staticNode.outerHeight() / 2;
		        var destX = sourceNode.position().left + sourceNode.outerWidth() / 2;
		        var destY = sourceNode.position().top + sourceNode.outerWidth() / 2;
		        var length = Math.sqrt((destX - originX) * (destX - originX) + (destY - originY) * (destY - originY));
		        var angle = 180 / 3.1415 * Math.acos((destY - originY) / length);
		        if (destX > originX) angle *= -1;
		        $(this)
			        .css('height', length)
		            .css('-webkit-transform', 'rotate(' + angle + 'deg)')
		            .css('-moz-transform', 'rotate(' + angle + 'deg)')
		            .css('-o-transform', 'rotate(' + angle + 'deg)')
		            .css('-ms-transform', 'rotate(' + angle + 'deg)')
		            .css('transform', 'rotate(' + angle + 'deg)');
			}
		});
	}
	// If creating new line only
	else if(mouseButtonDown == 2){
		var linkLine = $('<div id="new-link-line"></div>').prependTo('.mainFrame');
		linkLine
			.css('top', sourceNode.position().top + sourceNode.outerWidth() / 2)
			.css('left', sourceNode.position().left + sourceNode.outerHeight() / 2);
	}
	// If creating new node and new line
	else if(mouseButtonDown == 3){
		var linkLine = $('<div id="new-link-line"></div>').prependTo('.mainFrame');
		linkLine
			.css('top', sourceNode.position().top + sourceNode.outerWidth() / 2)
			.css('left', sourceNode.position().left + sourceNode.outerHeight() / 2);

		var guider = $('<div class="vertex" id="vertexGuide">♥</div>').appendTo('.mainFrame');
		guider
			.css('left', event.pageX - 15)
			.css('top', event.pageY - 15);

		if ($('#new-link-line').length > 0) {
	        var originX = sourceNode.position().left + sourceNode.outerWidth() / 2;
	        var originY = sourceNode.position().top + sourceNode.outerHeight() / 2;
	        var destX = $('#vertexGuide').position().left + $('#vertexGuide').outerWidth() / 2;
	        var destY = $('#vertexGuide').position().top + $('#vertexGuide').outerWidth() / 2;
	        var length = Math.sqrt((destX - originX) * (destX - originX) + (destY - originY) * (destY - originY));
	        var angle = 180 / 3.1415 * Math.acos((destY - originY) / length);
	        if (destX > originX) angle *= -1;

	        $('#new-link-line')
	            .css('height', length)
	            .css('-webkit-transform', 'rotate(' + angle + 'deg)')
	            .css('-moz-transform', 'rotate(' + angle + 'deg)')
	            .css('-o-transform', 'rotate(' + angle + 'deg)')
	            .css('-ms-transform', 'rotate(' + angle + 'deg)')
	            .css('transform', 'rotate(' + angle + 'deg)');
	    }
	}
}

function moveNode(sourceNode) {
	// Create an array of edges that connect to sourceNode
	var lines = new Array();
	$(".edge").each(function() {
		if($(this).data("nodeA") == sourceNode.data("id") || $(this).data("nodeB") == sourceNode.data("id")) {
			lines.push($(this));
		}
	});
	$(document).mousemove(linkMouseMoveEvent(1, sourceNode, lines));
}

function makeLineOnly(sourceNode){}

function makeNodeLine(sourceNode){}

function confirmLine(){}

function endLinkMode(){}