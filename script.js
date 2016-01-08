var clientWidth = parseInt(window.innerWidth);
var clientHeight = parseInt(window.innerHeight);
var time = 0;
var clock;
var playing = false;

var _score;
$(document).ready(function () {
    $.ajax({
        url: "database.php",
        method: "GET",
        success: function (result) {
            var data = JSON.parse(result);
            for (i = 0; i < 6; i++) {
                $("table").append("<tr><td>" + data[i].name + "</td><td>" + parseFloat(data[i].score / 10).toFixed(1) + "</td></tr>")
            }
        }
    });

    //  BALL OBJECT

    var ball = {
        x: 0.465 * clientWidth,
        y: 0.5 * clientHeight - 0.035 * clientWidth,
        prevX: 0.465 * clientWidth,
        velX: 0,
        velY: 0,
        accX: 0,
        accY: 0,
        maxVel: 7,
        size: 0.07 * clientWidth
    };

    $("#startScreen input").click(function () {
        $("#startScreen").fadeOut(500);
        startGame();
        console.log("CHECK");
    });
    $("#gameOver input[value='Retry']").click(function () {
        $.ajax({
        url: "database.php",
        method: "GET",
        success: function (result) {
            var data = JSON.parse(result);
            $("table").empty();
            $("table").append("<th colspan='2'>HIGHSCORE</th>")
            for (i = 0; i < 6; i++) {
                $("table").append("<tr><td>" + data[i].name + "</td><td>" + parseFloat(data[i].score / 10).toFixed(1) + "</td></tr>")
            }
        }
    });
        $("#gameOver").fadeOut(500);
        startGame();
    });
    $("#gameOver #submit").click(function () {
        var _name = $("#gameOver input[name='name']").val();
        var data = {
            name: _name,
            score: _score * 10
        };
        $.ajax({
            url: "database.php",
            data: data,
            method: "GET",
            success: function (result) {
                console.log(result);
            }
        });
        $(this).css({
            padding: "0px",
            margin: "0px",
            width: "0px"
        });
        console.log('done');
    });


    function startGame() {
        playing = true;
        time = 0;
        clock = setInterval(function () {
            time += 1;
            $("#timer").html(parseFloat(time / 10).toFixed(1))
        }, 100);
        window.addEventListener('deviceorientation', orientaionHandler);
    }

    function gameOver() {
        playing = false;
        removeEventListener('deviceorientation', orientaionHandler);
        $("#gameOver").fadeIn(500);
        ball.x = 0.465 * clientWidth;
        ball.y = 0.5 * clientHeight - 0.035 * clientWidth;
        ball.velX = 0;
        ball.velY = 0;
        ball.accX = 0;
        ball.accY = 0;
        window.clearInterval(clock);
        _score = parseFloat(time / 10).toFixed(1);
        $("#gameOver h1").html("Your Score: " + _score);
    }


    function orientaionHandler(e) {
        ball.accY = e.beta * ball.maxVel / 180;
        ball.accX = e.gamma * ball.maxVel / 180;
    }


    function animate() {
        if (ball.x <= 0 || ball.y <= 0 || ball.x > clientWidth - ball.size || ball.y > clientHeight - ball.size) {
            gameOver();
        }
        if (Math.random() < 0.01 && playing) {
            ball.velX += Math.random() * 0.075;
            ball.velY += Math.random() * 0.075;
            console.log("BUMP");
        }


        ball.prevX = ball.x;
        ball.prevY = ball.y;

        ball.velX += ball.accX;
        ball.velY += ball.accY;

        ball.x += ball.velX;
        ball.y += ball.velY;

        $("#ball").css({
            left: ball.x,
            top: ball.y
        });

        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);




    //  VERTICALLY CENTER THINGS
    $(document).ready(vcenter);
    $(window).on('resize', vcenter);

    function vcenter() {
        $('.vcenter').each(function () {
            $(this).css({
                'display': 'inline-block',
                'margin-top': (parseInt($(this).parent().css('height')) - parseInt($(this).height())) / 2
            });
        });
    }
});