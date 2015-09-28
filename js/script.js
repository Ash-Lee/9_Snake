// 9_Snake
// JavaScript + jQuery

var boxes = 40,
    gridElement = "",
    loop = null,
    foodLocation = null,
    score = 0,
    highscore = 0,
    walls = [],
     
    snake = {
        direction: "",
        body: [],
        colour: "#0E68CE",
        alive: false,
        left: function(headIndex) {snake.body.push(snake.body[headIndex] - 1);},
        up: function(headIndex) {snake.body.push(snake.body[headIndex] - 40);},
        right: function(headIndex) {snake.body.push(snake.body[headIndex] + 1);},
        down: function(headIndex) {snake.body.push(snake.body[headIndex] + 40);}
    },

    headIndex = (snake.body.length - 1);



$(function() {
    // Create initial grid
    createGrid(boxes, '.grid', '.grid-box', 'grid-box');

    // User input
    $(document).keydown( function(e) {
        switch(e.which) {
            case 37: // Left
                if (!snake.alive) {resetGame()}
                if (snake.direction !== "r") {
                    move(snake.left);
                    snake.direction = "l";
                }
                break;

            case 38: // Up
                if (!snake.alive) {resetGame()} 
                if (snake.direction !== "d") {
                    move(snake.up);
                    snake.direction = "u";
                }
                break;

            case 39: // Right
                if (!snake.alive) {resetGame()}
                if (snake.direction !== "l") {
                    move(snake.right);
                    snake.direction = "r";
                }
                break;

            case 40: // Down
                if (!snake.alive) {resetGame()}
                if (snake.direction !== "u") {
                    move(snake.down);
                    snake.direction = "d";
                }
                break;

            default: return;
        }

        e.preventDefault();
    });
});



function move(command) {
    window.clearInterval(loop);
    snake.colour = "#0E68CE";

    loop = setInterval( function() {
        // Create snake body
        for (var i = 0; i < snake.body.length; i++) {
            $('.box-' + snake.body[i]).css('background-color', snake.colour);
        }

        // Add to snake body
        headIndex = snake.body.length - 1;
        command(headIndex)

        // Remove from snake tail
        tail = snake.body.shift();
        $('.box-' + tail).css('background-color', '#F0F0F0');

        // Check for collision
        collisionCheck();

        // Check for food
        eat();
    }, 50); // Set speed of snake
};



function eat() {
    if (snake.body[headIndex] === foodLocation) {
        // Update score
        updateScore();

        // Increase size of snake
        grow();

        // Generate new food item
        createFood();
    }
};



function grow() {
    // Add an additional 5 values to the snake.body array in order to increase its length
    if (snake.direction === "l") {
        for (var i = 0; i < 5; i++) {snake.left(headIndex)}
    }

    if (snake.direction === "u") {
        for (var i = 0; i < 5; i++) {snake.up(headIndex)}
    }

    if (snake.direction === "r") {
        for (var i = 0; i < 5; i++) {snake.right(headIndex)}
    }

    if (snake.direction === "d") {
        for (var i = 0; i < 5; i++) {snake.down(headIndex)}
    }

    snake.alive = true;
};



function collisionCheck() {
    // Body collision
    for (var i = 0; i < snake.body.length - 1; i++) {
        if (snake.body[headIndex] === snake.body[i]) {
            die();
        }
    }
    
    // Horizontal wall collision
    if (snake.body[headIndex] > 1559 || snake.body[headIndex] < 40) {
        die();
        $('.box-' + snake.body[headIndex]).css('background-color', '#E0E0E0');
    }

    // Vertical wall collision
    // Only checks first 80 entries of walls array to cover left and right wall
    for (var i = 0; i < 80; i++) {
        if (snake.body[headIndex] === walls[i]) {
            die();
            $('.box-' + snake.body[headIndex]).css('background-color', '#E0E0E0');
        }
    }
};



function die() {
    window.clearInterval(loop);
    changeColour('#F44747');
    snake.alive = false;
};



function changeColour(col) {
    for (var i = 0; i < snake.body.length; i++) {
        $('.box-' + snake.body[i]).css('background-color', col);
    }
};



function createGrid(boxes, grid, gridBox, gridBoxClass) {
    // Calculate square grid dimensions
     var gridWidth = $(grid).width(),
        gridArea = gridWidth * gridWidth,

        // Number of boxes - pixels
        boxSizePx = gridWidth / boxes,
        boxArea = boxSizePx * boxSizePx,
        boxesTotal = gridArea / boxArea,
    
        // Size of each box as a % (avoids pixel rounding errors)
        boxSizePercent = ((boxSizePx / gridWidth ) * 100) + '%';

    // Set height and width of each box
    setTimeout( function() {
        $(gridBox).css({'height': boxSizePercent, 'width': boxSizePercent});
    }, 1);

    // Create grid
    for (var i = 0; i < boxesTotal; i += 1) {
        gridElement += "<div class=\'" + gridBoxClass + " box-" + i + "\'></div>";
    }
    $(grid).append(gridElement);
    
    // Create walls
    createWalls();
};



function createWalls() {
    var wallBox = 0;
    
    // Left wall
    for (var i = 0; i < 40; i++) {
        walls.push(wallBox);
        wallBox += 40;
    }

    // Right wall
    wallBox = 39;
    for (var i = 0; i < 40; i++) {
        walls.push(wallBox);
        wallBox += 40;
    }

    // Top wall
    for (var i = 0; i < 40; i++) {
        walls.push(i);
    }

    // Bottom wall
    for (var i = 1560; i < 1600; i++) {
        walls.push(i);
    }

    // Add walls to grid
    for (var i = 0; i < walls.length; i++) {
        $('.box-' + walls[i]).css('background-color', '#E0E0E0');
    }
};



function resetGame() {
    // Reset grid
    changeColour('#F0F0F0');
    createWalls();

    // Reset score
    score = 0;
    $('.score').empty().append(score);

    // Reset snake
    snake.body = [820, 820, 820, 820];  // Sets initial length of snake
    snake.direction = "";
    snake.alive = true;

    // Reset food item
    createFood();
};



function createFood() {
    // Remove existing food item
    $('.box-' + foodLocation).empty();

    // Generate new food item
    foodLocation = Math.floor(Math.random() * (1600 - 1 + 1)) + 1;
    $('.box-' + foodLocation).append("<div class=\'food\'></div>")

    // Prevent food items spawning inside the walls
    for (var i = 0; i < walls.length; i++) {
        if (foodLocation === walls[i]) {
            createFood();
        }
    }

    // Prevent food items spawning inside snake body
    for (var i = 0; i < snake.body.length; i++) {
        if (foodLocation === snake.body[i]) {
            createFood();
        }
    }
};



function updateScore() {
    score += 5;
    $('.score').empty().append(score);

    if (score > highscore) {
        highscore = score;
        $('.highscore').empty().append(score);
    }
};