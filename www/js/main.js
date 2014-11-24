document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    if( window.plugins && window.plugins.NativeAudio ) {

        // Preload audio resource
        window.plugins.NativeAudio.preloadSimple( 'click', 'sounds/drop.mp3', function(msg){
        }, function(msg){
            console.log( 'error: ' + msg );
            alert( 'error: ' + msg );
        });

        // Play
        window.plugins.NativeAudio.play( 'click' );
    }
}

if((!localStorage.red || !localStorage.yellow) || (!localStorage.green || !localStorage.totalVotes )) {
    localStorage.red = "0";
    localStorage.yellow = "0";
    localStorage.green = "0";
    localStorage.totalVotes = "0";
}

var redColumn = $(".column.red"),
    yellowColumn = $(".column.yellow"),
    greenColumn = $(".column.green");
    total = $(".total span");

var returnPercentage = function(voteColor) {
    if(localStorage.totalVotes == "0") {
        return 0;
    }

    return ((parseInt(localStorage[voteColor]) / parseInt(localStorage.totalVotes)) * 100);
}

var recursiveCheck = function(voteColor) {
    setTimeout(function() {
        window.plugins.NativeAudio.play( 'click' );
    }, 250);
    setTimeout(function() {
        if(animationTime[voteColor] <= 0) $reference[voteColor].removeClass("active");
        else recursiveCheck(voteColor);
    }, 500);
}

var recalculateWidth = function() {
    $(".column").each(function() {
        var columnEl = $(this).find("img");

        if($(this).width() < columnEl.width() + 20) $(this).find("a").addClass("no-space");
        else $(this).find("a").removeClass("no-space");
    });
}

var newVote = function() {
    redColumn.css("width", returnPercentage("red") + "%");
    redColumn.find("span").html(Math.round(returnPercentage("red")) + "%<br />" + localStorage.red);

    yellowColumn.css("width", returnPercentage("yellow") + "%");
    yellowColumn.find("span").html(Math.round(returnPercentage("yellow")) + "%<br />" + localStorage.yellow);

    greenColumn.css("width", returnPercentage("green") + "%");
    greenColumn.find("span").html(Math.round(returnPercentage("green")) + "%<br />" + localStorage.green);

    total.text(localStorage.totalVotes);

    recalculateWidth();
}

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

// initiate score
newVote();

$("#admin .graph").click(function(e) {
    e.preventDefault();

    $("#wrapper").toggleClass("hidden");
});

$("#admin .reset").click(function(e) {
    e.preventDefault();

    localStorage.totalVotes = "0";
    localStorage.red = "0";
    localStorage.yellow = "0";
    localStorage.green = "0";

    newVote();
});

var animationTime = {
    "red" : 0,
    "yellow" : 0,
    "green" : 0
};

var $reference = {};
$(".column a").click(function(e) {
    e.preventDefault();

    var voteColor = $(this).parent().attr("data-color");
    animationTime[voteColor] += 500;
    $reference[voteColor] = $(this);

    setTimeout(function(){
        animationTime[voteColor] -= 500;
    }, 500);

    if(!$reference[voteColor].hasClass("active")) {
        $reference[voteColor].addClass("active");
        recursiveCheck(voteColor);
    } 

    localStorage.totalVotes = Number(localStorage.totalVotes) + 1;
    localStorage[voteColor] = Number(localStorage[voteColor]) + 1;
    newVote();
});

$(window).resize(function() {
    recalculateWidth();
});