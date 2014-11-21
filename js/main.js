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

var redSound = new Howl({urls: ['sounds/red.mp3']}),
    yellowSound = new Howl({urls: ['sounds/yellow.mp3']}),
    greenSound = new Howl({urls: ['sounds/green.mp3']});

var newSound = function(data) {
    switch (data) {
        case "red":
            redSound.stop();
            redSound.play();
            break;
        case "yellow":
            yellowSound.stop();
            yellowSound.play();
            break;
        case "green":
            greenSound.stop();
            greenSound.play();
            break;
    }
}

var returnPercentage = function(voteColor) {
    if(localStorage.totalVotes == "0") {
        return 0;
    }

    return ((parseInt(localStorage[voteColor]) / parseInt(localStorage.totalVotes)) * 100);
}

var recursiveCheck = function(voteColor) {
    setTimeout(function() {
        if(animationTime[voteColor] <= 0) $reference[voteColor].removeClass("active");
        else recursiveCheck(voteColor);
    }, 500);
}

var recalculateWidth = function() {
    $(".column").each(function() {
        var columnEl = $(this).find("i");
        columnEl.css("width", "auto");

        if($(this).width() < columnEl.width() + 20) $(this).find("a").addClass("no-space");
        else $(this).find("a").removeClass("no-space");

        columnEl.css("width","100%");
    });
}

var newVote = function() {
    redColumn.css("width", returnPercentage("red") + "%");
    redColumn.find("span").text(Math.round(returnPercentage("red")) + "%");

    yellowColumn.css("width", returnPercentage("yellow") + "%");
    yellowColumn.find("span").text(Math.round(returnPercentage("yellow")) + "%");

    greenColumn.css("width", returnPercentage("green") + "%");
    greenColumn.find("span").text(Math.round(returnPercentage("green")) + "%");

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

    // newSound(voteColor);
    localStorage.totalVotes = Number(localStorage.totalVotes) + 1;
    localStorage[voteColor] = Number(localStorage[voteColor]) + 1;
    newVote();
});
