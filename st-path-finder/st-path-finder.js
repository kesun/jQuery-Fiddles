var SorT = 0;

$(document).ready(function () {
    $(".vertex").draggable({
        containment: "parent",
        snap: true
    });
    $(document).on ("click", ".edgeLengthBox", function(){
        if($(this).is("div")){
            var inputBox = $(this).prev();
            $(this).hide()
            inputBox.val($(this).text());
            inputBox.focus();
        }
    });
    $(document).on ("focusout", ".edgeLengthBox", function(){
        if($(this).is("input")){
            var divBox = $(this).next();
            divBox.text($(this).val());
            $(this).val('');
            divBox.show();
        }
    });
	$('.vertex').mousedown(function (event) {
        switch (event.which) {
            case 1: // move only
                //moveNode();
                if($('#solid-link-line').length > 0){
                    $('#solid-link-line').attr('id', 'new-link-line');
                    var angle = getRotation($('#new-link-line'));
                    var top = $('#new-link-line').css('top');
                    var left = $('#new-link-line').css('left');
                    if($(this).attr("id") == "pointS"){
                        $('#new-link-line')
                            .css('top', $('#pointT').position().top + $('#pointT').outerWidth() / 2)
                            .css('left', $('#pointT').position().left + $('#pointT').outerHeight() / 2);
                        SorT = 1;
                    }else{
                        $('#new-link-line')
                            .css('top', $('#pointS').position().top + $('#pointS').outerWidth() / 2)
                            .css('left', $('#pointS').position().left + $('#pointS').outerHeight() / 2);
                        SorT = 2;
                    }
                    if($('#new-link-line').css('top') != top || $('#new-link-line').css('left') != left){
                        angle += 180;
                        setRotation($('#new-link-line'), angle);
                        setRotation($("#new-link-line").children($("input")), angle * -1);
                    }
                }
                if($(this).attr("id") == "pointS"){
                    SorT = 1;
                }else{
                    SorT = 2;
                }
                break;
            case 2: // add line only
                //makeLineOnly();
                break;
            case 3: // add node and line
                //makeNodeLine();
                if ($('#solid-link-line').length > 0 || $('#new-link-line').length > 0) break;
                $('<div id="new-link-line"><input type="text" class="edgeLengthBox"><div class="edgeLengthBox"></div></div>').prependTo('.mainFrame');
                var lengthAngle;
                if($(this).attr("id") == "pointS"){
                    lengthAngle = calclengthAngle($('#pointS'), $('#pointT'));
                    setRotation($('#new-link-line'), lengthAngle[1]);
                    setRotation($("#new-link-line").children($("input")), lengthAngle[1] * -1);
                    $('#new-link-line')
                        .css('height', lengthAngle[0])
                        .css('top', $('#pointT').position().top + $('#pointT').outerWidth() / 2)
                        .css('left', $('#pointT').position().left + $('#pointT').outerHeight() / 2);
                }else{
                    lengthAngle = calclengthAngle($('#pointT'), $('#pointS'));
                    setRotation($('#new-link-line'), lengthAngle[1]);
                    setRotation($("#new-link-line").children($("input")), lengthAngle[1] * -1);
                    $('#new-link-line')
                        .css('height', lengthAngle[0])
                        .css('top', $('#pointS').position().top + $('#pointS').outerWidth() / 2)
                        .css('left', $('#pointS').position().left + $('#pointS').outerHeight() / 2);
                }
                break;
        }
		$(document).mousemove(linkMouseMoveEvent);

		$(document).bind('mouseup.link', function (event) {
			confirmLine();
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
        var lengthAngle;
        if(SorT == 1){
            lengthAngle = calclengthAngle($('#pointS'), $('#pointT'));
        }else{
            lengthAngle = calclengthAngle($('#pointT'), $('#pointS'));
        }
        length = lengthAngle[0];
        angle = lengthAngle[1];

        $('#new-link-line').css('height', length);
        setRotation($('#new-link-line'), angle);
        setRotation($("#new-link-line").children($("input")), angle * -1);
    }
}

function confirmLine() {
    $('#new-link-line').attr('id', 'solid-link-line');
    $(document).unbind('mousemove.link').unbind('click.link').unbind('keydown.link');
}

function getRotation(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle +=360 : angle;
}

function calclengthAngle(from, to){
    var originX = from.position().left + from.outerWidth() / 2;;
    var originY = from.position().top + from.outerHeight() / 2;;
    var destX = to.position().left + to.outerWidth() / 2;;
    var destY = to.position().top + to.outerWidth() / 2;;
    var length = Math.sqrt((destX - originX) * (destX - originX) + (destY - originY) * (destY - originY));
    var angle = 180 / 3.1415 * Math.acos((destY - originY) / length);
    if (destX > originX) angle *= -1;
    angle += 180;
    var result = new Array(length, angle);
    return result;
}

function setRotation(obj, angle){
    obj
        .css('-webkit-transform', 'rotate(' + angle + 'deg)')
        .css('-moz-transform', 'rotate(' + angle + 'deg)')
        .css('-o-transform', 'rotate(' + angle + 'deg)')
        .css('-ms-transform', 'rotate(' + angle + 'deg)')
        .css('transform', 'rotate(' + angle + 'deg)');
}