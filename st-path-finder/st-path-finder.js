$(document).ready(function () {
    $(".vertex").draggable({
        containment: "parent",
        snap: true
    });
	$('#pointT').mousedown(function (event) {
        switch (event.which) {
            case 1: // move only
                //moveNode();
                if($('#solid-link-line').length > 0){
                    $('#solid-link-line').attr('id', 'new-link-line');
                }
                break;
            case 2: // add line only
                //makeLineOnly();
                break;
            case 3: // add node and line
                //makeNodeLine();
                $('<div id="new-link-line"></div>').prependTo('.mainFrame');
                $('#new-link-line')
                    .css('top', $('#pointS').position().top + $('#pointS').outerWidth() / 2)
                    .css('left', $('#pointS').position().left + $('#pointS').outerHeight() / 2);
                break;
        }
		$(document).mousemove(linkMouseMoveEvent);

		// Cancel on right click
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

		$(document).bind('keydown.link', function (event) {
			// ESCAPE key pressed
			if (event.keyCode == 27) {
				endLinkMode();
			}
		});
	});
});

window.oncontextmenu = function () { return false; }

function linkMouseMoveEvent(event) {
    if ($('#new-link-line').length > 0) {
        var originX = $('#pointS').position().left + $('#pointS').outerWidth() / 2;
        var originY = $('#pointS').position().top + $('#pointS').outerHeight() / 2;

        var destX = $('#pointT').position().left + $('#pointT').outerWidth() / 2;
        var destY = $('#pointT').position().top + $('#pointT').outerWidth() / 2;

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

function endLinkMode() {
    // $('#new-link-line').remove();
    $(document).unbind('mousemove.link').unbind('click.link').unbind('keydown.link');
    $('#new-link-line').attr('id', 'solid-link-line');
}

function confirmLine() {
    if ($('#new-link-line').length > 0) {
        var top = $('#new-link-line').css('top');
        var left = $('#new-link-line').css('left');
        var height = $('#new-link-line').css('height');
        var type;
        var rotation;
        if ($('#new-link-line').css('transform') != null) {
            rotation = $('#new-link-line').css('transform');
            type = 'transform-origin';
        } else if ($('#new-link-line').css('-webkit-transform') != null) {
            rotation = $('#new-link-line').css('-webkit-transform');
            type = '-webkit-transform';
        } else if ($('#new-link-line').css('-moz-transform') != null) {
            rotation = $('#new-link-line').css('-moz-transform');
            type = '-moz-transform-origin';
        } else if ($('#new-link-line').css('-o-transform') != null) {
            rotation = $('#new-link-line').css('-o-transform');
            type = '-o-transform-origin';
        } else if ($('#new-link-line').css('-ms-transform') != null) {
            rotation = $('#new-link-line').css('-ms-transform');
            type = '-ms-transform';
        }

        $('#new-link-line').attr('id', 'solid-link-line');

        $(document).unbind('mousemove.link').unbind('click.link').unbind('keydown.link');
    }
}