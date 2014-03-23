var x;
var y;

var tempID = 0;
var change = 0;
var numRow = 4;
var numCol = 4;
var alive = 0;
var winner = 0;
var loser = 0;

//Numbers achieved
var seenValues = [2];

function achievementMsg(msg){
    $(".achievementBox").text(msg);
    $(".achievementBox").css({ opacity: 1 });
    $(".achievementBox").fadeTo("slow", 0);
}

function achievement(num){
    switch(seenValues.length) {
        // Left arrow key pressed
        case 2: achievementMsg("First blood!"); break;
        case 3: achievementMsg("Double kill!"); break;
        case 4: achievementMsg("Triple kill!"); break;
        case 5: achievementMsg("Ultra kill!"); break;
        case 6: achievementMsg("Rampage!"); break;
        case 7: achievementMsg("Killing spree!"); break;
        case 8: achievementMsg("Dominating!"); break;
        case 9: achievementMsg("Mega kill!"); break;
        case 10: achievementMsg("Unstoppable!"); break;
        case 11: achievementMsg("Wicked sick!"); break;
    }
}

function freezeGame(){
    $(".block").each(function(){
        $(this).removeAttr("id");
    });
}

function unFreezeGame(){
    var r = 1;
    var c = 1;
    var newID;

    $(".block").each(function(){
        newID = String(r) + String(c);
        $(this).attr("id", newID);

        if(r <= 4){
            if(c < 4){
                c++;
            }else{
                r++;
                c = 1;
            }
        }
    })
}

function applyColour(id, colour){
    $(id)
        .css("background-color", "")
        .css("background-color", colour);

}

function determineColour(id, num){
    switch(num){
        case 2: applyColour(id, "#b0e6ff"); $(id).css("color", "#333"); break;
        case 4: applyColour(id, "#75d4ff"); $(id).css("color", "#333"); break;
        case 8: applyColour(id, "#31beff"); $(id).css("color", "#ffffff"); break;
        case 16: applyColour(id, "#d7b0ff"); $(id).css("color", "#333"); break;
        case 32: applyColour(id, "#bf74ff"); $(id).css("color", "#333"); break;
        case 64: applyColour(id, "#a337ff"); $(id).css("color", "#ffffff"); break;
        case 128: applyColour(id, "#ffb0d7"); $(id).css("color", "#333"); break;
        case 256: applyColour(id, "#ff77ba"); $(id).css("color", "#333"); break;
        case 512: applyColour(id, "#ff399b"); $(id).css("color", "#ffffff"); break;
        case 1024: applyColour(id, "#ffb243"); $(id).css("color", "#333"); break;
        case 2048: applyColour(id, "#ff9600"); $(id).css("color", "#333"); break;
    }
}

function checkWinner(){ // returns 1 if there's winner, 0 if not (doesn't mean losing)
    var temp;
    for(var i = 1; i <= numRow; i++){
        for(var j = 1; j <= numCol; j++){
            temp = "#" + i + j;

            if($(temp).is(":empty")){   // if block is empty

                alive = 1;  // game is alive

            }else if($(temp).text() == 2048){ // if there is 2048
                winner = 1; // there is a winner
                $(temp)
                    .css("background-image", "url(redstar.png)")
                    .css("color", "#ffffff");
                return 1;

            }else{  // if block is filled with non-2048 (implicitly less than 2048)
                var cur = $(temp).text();

                if(i < numRow){
                    var colNei = "#"+(i+1)+j;
                    colNei = $(colNei).text();

                    if(cur == colNei){
                        alive = 1;
                    }
                }

                if(j < numCol){
                    var rowNei = "#"+i+(j+1);
                    rowNei = $(rowNei).text();

                    if(cur == rowNei){
                        alive = 1;
                    }
                }
            }
        }
    }
    return 0;
}

function showResultBox(){
    $(".resultBox").fadeIn("fast");
}

function declareWinner(){
    $(".resultBox").empty();
    $(".resultBox").append('<p class="resultText">Congratulations, you win!</p>');
    showResultBox();
    // $("body").append("<p>We have a winner!</p>");
}

function declareLoser(){
    $(".resultBox").empty();
    $(".resultBox").append('<p class="resultText">You lost...</p>');
    showResultBox();
    // $("body").append("<p>You are out of moves!</p>");
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

    $(tempID).append("<p>2</p>")
        .css("background-color", "")
        .css("background-color", "#b0e6ff");
}

function moveValueTo(origID, newID, value){
    var origColour = $(origID).css("background-color");
    var origTextColour = $(origID).css("color");
    $(newID)
        .css("background-color", "")
        .css("background-color", origColour)
        .css("color", origTextColour);
    $("p", newID).remove("p");
    $(newID).append("<p>" + value + "</p>");
    $("p", origID).remove("p");
    $(origID)
        .css("background-color", "")
        .css("background-color", "#558ba5")
        .css("color", "#333");
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
            if(!($(curID).is(":empty"))){   // If box not empty
                if(prevValue == 0){ // If there is no unused previous value
                    prevValue = $(curID).text();    // Flag cur value
                    prevRow = targetRow;    // Flag cur row
                    if(targetRow < row){
                        moveValueTo(curID, "#" + targetRow + col, prevValue);
                        change = 1;
                    }
                    targetRow++;
                }else{  // If there is unused previous value
                    if(prevValue == $(curID).text()){   // If prev value == cur value
                        var sum = Number(prevValue) + Number($(curID).text());

                        if(seenValues.lastIndexOf(sum) == -1){
                            seenValues.push(sum);
                            achievement(sum);
                        }

                        moveValueTo(curID, "#" + prevRow + col, sum);
                        determineColour("#" + prevRow + col, sum);
                        prevValue = 0;
                        prevRow = 0;
                        change = 1;
                    }else{  // If prev value != cur value
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
            if(!($(curID).is(":empty"))){   // If box not empty
                if(prevValue == 0){ // If there is no unused previous value
                    prevValue = $(curID).text();    // Flag cur value
                    prevRow = targetRow;    // Flag cur row
                    if(targetRow > row){
                        moveValueTo(curID, "#" + targetRow + col, prevValue);
                        change = 1;
                    }
                    targetRow--;
                }else{  // If there is unused previous value
                    if(prevValue == $(curID).text()){   // If prev value == cur value
                        var sum = Number(prevValue) + Number($(curID).text());

                        if(seenValues.lastIndexOf(sum) == -1){
                            seenValues.push(sum);
                            achievement(sum);
                        }

                        moveValueTo(curID, "#" + prevRow + col, sum);
                        determineColour("#" + prevRow + col, sum);
                        prevValue = 0;
                        prevRow = 0;
                        change = 1;
                    }else{  // If prev value != cur value
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
            if(!($(curID).is(":empty"))){   // If box not empty
                if(prevValue == 0){ // If there is no unused previous value
                    prevValue = $(curID).text();    // Flag cur value
                    prevCol = targetCol;    // Flag cur row
                    if(targetCol < col){
                        moveValueTo(curID, "#" + row + targetCol, prevValue);
                        change = 1;
                    }
                    targetCol++;
                }else{  // If there is unused previous value
                    if(prevValue == $(curID).text()){   // If prev value == cur value
                        var sum = Number(prevValue) + Number($(curID).text());

                        if(seenValues.lastIndexOf(sum) == -1){
                            seenValues.push(sum);
                            achievement(sum);
                        }

                        moveValueTo(curID, "#" + row + prevCol, sum);
                        determineColour("#" + row + prevCol, sum);
                        prevValue = 0;
                        prevCol = 0;
                        change = 1;
                    }else{  // If prev value != cur value
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
            if(!($(curID).is(":empty"))){   // If box not empty
                if(prevValue == 0){ // If there is no unused previous value
                    prevValue = $(curID).text();    // Flag cur value
                    prevCol = targetCol;    // Flag cur row
                    if(targetCol > col){
                        moveValueTo(curID, "#" + row + targetCol, prevValue);
                        change = 1;
                    }
                    targetCol--;
                }else{  // If there is unused previous value
                    if(prevValue == $(curID).text()){   // If prev value == cur value
                        var sum = Number(prevValue) + Number($(curID).text());

                        if(seenValues.lastIndexOf(sum) == -1){
                            seenValues.push(sum);
                            achievement(sum);
                        }

                        moveValueTo(curID, "#" + row + prevCol, sum);
                        determineColour("#" + row + prevCol, sum);
                        prevValue = 0;
                        prevCol = 0;
                        change = 1;
                    }else{  // If prev value != cur value
                        col++;
                        prevValue = 0;
                        prevCol = 0;
                    }
                }
            }
        }
    }
}

function init(){
    unFreezeGame();
    // whipe the blocks
    for(var i = 1; i <= numRow; i++){
        for(var j = 1; j <= numCol; j++){
            $("#"+i+j)
                .css("background-color", "#558ba5")
                .css("color", "#333");
            $("#"+i+j).empty();
        }
    }
    numRow = 4; numCol = 4; winner = 0; loser = 0; alive = 0; seenValues = [2]; // reset global

    spawn();
    spawn();
}

$(document).ready(function(){
    //init
    init();
    /*
    $("#11").append("<p>2048</p>");
    applyColour("#11", "#ff9600");
    */
    /*
    checkWinner();

    if(winner == 1){    // if there's a winner
        declareWinner();
    }else if(alive == 0){   // if game died
        loser = 1;
        declareLoser();
    }
    */

    if(winner == 0 && loser == 0){
        $(document).keydown(function(key) {

            // test();

            alive = 0
            change = 0;

            switch(parseInt(key.which,10)) {
                // Left arrow key pressed
                case 37: moveLeft(); break;
                // Up Arrow Pressed
                case 38: moveUp(); break;
                // Right Arrow Pressed
                case 39: moveRight(); break;
                // Down Array Pressed
                case 40: moveDown(); break;
            }

            if(change == 1){    // if a valid change of position occured
                spawn();
            }

            checkWinner();

            if(winner == 1){
                freezeGame();
                declareWinner();
            }else if(alive == 0){
                freezeGame();
                loser = 1;
                declareLoser();
            }
        });
    }

    $("#restart").click(function(){
        $(".resultBox").fadeOut("fast");
        init();
    });
});