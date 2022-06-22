const directions = {
    UP: 'up',
    LEFT: 'left',
    RIGHT: 'right',
    DOWN: 'down'
}

const colValues = {
    WALL: 't',
    OPEN: 'f',
    PATH: 'pt',
    DEADEND: 'de'
}

//Setup the start and exits square
var startRow = 0;
var startColumn = 0;
var exitRow = 3;
var exitColumn = 0;

//with a known start and exit get to the exit 
//with the least amount of steps
function solveMaze() {

    let grid = cGrid;
    var currentRow = 0;
    var currentColumn = 0;
    var stepCount = 0;
    var exitReached = false;
    var noExit = false;
    var moveUp = {};
    var moveLeft = {};
    var moveRight = {};
    var moveDown = {};

    //Mark the start as part of the path
    grid[startRow][startColumn] = colValues.PATH;
    var elementID = `${startRow}:${startColumn}`;
    document.getElementById(elementID).setAttribute("blockValue", "step");

    //solve the maze by lookig for the next best step
    do {

        let nextStep = [];
        let prevRow = currentRow;
        let prevCol = currentColumn;

        moveUp = move(currentRow, currentColumn, grid, directions.UP);
        if (moveUp.canMove == true) {
            nextStep.push(moveUp);
        }

        moveDown = move(currentRow, currentColumn, grid, directions.DOWN);
        if (moveDown.canMove == true) {
            nextStep.push(moveDown);
        }

        moveLeft = move(currentRow, currentColumn, grid, directions.LEFT);
        if (moveLeft.canMove == true) {
            nextStep.push(moveLeft);
        }

        moveRight = move(currentRow, currentColumn, grid, directions.RIGHT);
        if (moveRight.canMove == true) {
            nextStep.push(moveRight);
        }

        //if we have no where to go exit
        if (nextStep.length == 0) {
            noExit = true;
            break;
        }

        //sort nextstep by min distance
        nextStep.sort((a, b) => (a.minDistance - b.minDistance));

        //pick the element that is closest to the exit. Pick Up or Down first. 
        switch (nextStep[0].direction) {
            case directions.UP:
                //move and add to stepCount array               
                stepCount++;
                currentRow = currentRow + 1;
                break;
            case directions.DOWN:
                stepCount++;
                currentRow = currentRow - 1;
                break;
            case directions.LEFT:
                stepCount++;
                currentColumn = currentColumn - 1;
                break;
            case directions.RIGHT:
                stepCount++;
                currentColumn = currentColumn + 1;
                break;

        }
        //mark the sqaures on the page
        exitReached = markElements(currentRow, currentColumn, prevRow, prevCol, grid);
    }
    while (exitReached == false || noExit == true);
    if (exitReached == true) {
        document.getElementById("results").innerHTML = `Success! It took ${stepCount} step(s)`
    }
} // end of maze function

//solve the zero hour mazes. Just find the start and run to the exit.
function solveMazeZH() {

    let grid = cGrid;
    var currentRow = 0;
    var currentColumn = 0;
    var stepCount = 0;
    var exitReached = false;
    var noExit = false;
    var moveUp = {};
    var moveLeft = {};
    var moveRight = {};
    var moveDown = {};

    //find the start column. We know it is on row 0.
    exitRow = grid.length - 1;
    startRow = 0;
    startColumn = grid[startRow].findIndex(isPath);

    currentColumn = startColumn;
    currentRow = startRow;

    //Mark the start as part of the path
    grid[startRow][startColumn] = colValues.PATH;
    var elementID = `${startRow}:${startColumn}`;
    document.getElementById(elementID).setAttribute("blockValue", "step");

    //solve the maze by looking for the next best step
    do {

        let nextStep = [];
        let prevRow = currentRow;
        let prevCol = currentColumn;

        moveUp = moveZH(currentRow, currentColumn, grid, directions.UP);
        if (moveUp.canMove == true) {
            nextStep.push(moveUp);
        }

        moveDown = moveZH(currentRow, currentColumn, grid, directions.DOWN);
        if (moveDown.canMove == true) {
            nextStep.push(moveDown);
        }

        moveLeft = moveZH(currentRow, currentColumn, grid, directions.LEFT);
        if (moveLeft.canMove == true) {
            nextStep.push(moveLeft);
        }

        moveRight = moveZH(currentRow, currentColumn, grid, directions.RIGHT);
        if (moveRight.canMove == true) {
            nextStep.push(moveRight);
        }

        //if we have no where to go exit
        if (nextStep.length == 0) {
            noExit = true;
            break;
        }

        //sort nextstep by target value
        nextStep.sort(function (a, b) {
            if (a.colValue > b.colValue) {
                return 1;
            }
            if (a.colValue < b.colValue) {
                return -1;
            }
            return 0;
        });

        //pick the element that is closest to the exit. Pick Up or Down first. 
        switch (nextStep[0].direction) {
            case directions.UP:
                //move up and add to step count                
                stepCount++;
                currentRow = currentRow + 1;
                break;
            case directions.DOWN:
                //Move Down and add to step count
                stepCount++;
                currentRow = currentRow - 1;
                break;
            case directions.LEFT:
                //Move left and add to step count
                stepCount++;
                currentColumn = currentColumn - 1;
                break;
            case directions.RIGHT:
                //Move right and add to step count
                stepCount++;
                currentColumn = currentColumn + 1;
                break;

        }
        //mark the sqaures on the page
        if (currentRow == exitRow) {
            exitColumn = currentColumn;
        }

        exitReached = markElements(currentRow, currentColumn, prevRow, prevCol, grid);
    }
    while (exitReached == false || noExit == true);
    if (exitReached == true) {
        document.getElementById("results").innerHTML = `Success! It took ${stepCount} step(s)`
    }
}// end of zero hour maze function

//see if we can move to the next sqaure and 
//calculate the distance to the exit
function move(currentRow, currentColumn, grid, direction) {

    var targetRow = currentRow;
    var targetColumn = currentColumn;
    var targetVal = "";

    switch (direction) {
        case directions.UP:
            targetRow = currentRow + 1;
            break;
        case directions.LEFT:
            targetColumn = currentColumn - 1;
            break;
        case directions.RIGHT:
            targetColumn = currentColumn + 1;
            break;
        case directions.DOWN:
            targetRow = currentRow - 1;
            break;
    }

    //check for out bounds
    if (targetRow > grid.length - 1 || targetRow < 0 || targetColumn > grid[targetRow].length || targetColumn < 0) {
        return {
            canMove: false,
            minDistance: -1,
            direction: direction,
            colValue: colValues.WALL
        };
    }

    //get the value of the square we are trying to move to
    targetVal = grid[targetRow][targetColumn];

    if (targetRow == startRow && targetColumn == startColumn) {
        //we cannot move back to start.
        return {
            canMove: false,
            minDistance: -1,
            direction: direction,
            colValue: colValues.WALL
        };

    } else if (targetVal == colValues.OPEN) {
        //test if we can move to the target square.'f' means no wall
        //calculate the distance to the exit
        return {
            canMove: true,
            minDistance: GetMinDistance(targetRow, targetColumn),
            direction: direction,
            colValue: targetVal
        };

    } else if (targetVal == colValues.WALL || targetVal == colValues.DEADEND) {
        //test for a wall or deadend; 't' means wall, 'de' means deadend
        return {
            canMove: false,
            minDistance: -1,
            direction: direction,
            colValue: targetVal
        };
    } else if (targetVal == colValues.PATH) {
        //if you have to go backwards to a previous marked square 
        //we need to mark the current square as a dead end ('de')
        //'pt' means square has already been marked        
        return {
            canMove: true,
            minDistance: GetMinDistance(targetRow, targetColumn),
            direction: direction,
            colValue: targetVal
        };
    }

    return {
        canMove: false,
        minDistance: -1,
        direction: direction,
        colValue: colValues.WALL
    };
}

function moveZH(currentRow, currentColumn, grid, direction) {

    var targetRow = currentRow;
    targetColumn = currentColumn;
    targetVal = "";

    switch (direction) {
        case directions.UP:
            targetRow = currentRow + 1;
            break;
        case directions.LEFT:
            targetColumn = currentColumn - 1;
            break;
        case directions.RIGHT:
            targetColumn = currentColumn + 1;
            break;
        case directions.DOWN:
            targetRow = currentRow - 1;
            break;
    }

    //check for out bounds
    if (targetRow > grid.length - 1 || targetRow < 0 || targetColumn > grid[targetRow].length || targetColumn < 0) {
        return {
            canMove: false,
            minDistance: -1,
            direction: direction,
            colValue: colValues.WALL
        };
    }

    //get the value of the square we are trying to move to
    targetVal = grid[targetRow][targetColumn];


    if (targetRow == startRow && targetColumn == startColumn) {
        //we cannot move back to start.
        return {
            canMove: false,
            minDistance: -1,
            direction: direction,
            colValue: colValues.WALL
        };

    } else if (targetVal == colValues.OPEN) {
        //test if we can move to the target square.'f' means no wall
        //calculate the distance to the exit
        return {
            canMove: true,
            minDistance: -1,
            direction: direction,
            colValue: targetVal
        };

    } else if (targetVal == colValues.WALL || targetVal == colValues.DEADEND) {
        //check for a wall or deadend in maze 
        return {
            canMove: false,
            minDistance: -1,
            direction: direction,
            colValue: targetVal
        };
    } else if (targetVal == colValues.PATH) {
        //if you have to go backwards to a previous marked square, dead end == ('de'), marked square == ('pt')       
        return {
            canMove: true,
            minDistance: -1,
            direction: direction,
            colValue: targetVal
        };
    }

    return {
        canMove: false,
        minDistance: -1,
        direction: direction,
        colValue: colValues.WALL
    };
} // end of move function

//GetMinDistance function finds the distance between target row and target column and returns it in absoulte value
function GetMinDistance(targetRow, targetColumn) {
    return Math.abs(exitRow - targetRow) + Math.abs((exitColumn - targetColumn));
}


//marks the maze
function markElements(targetRow, targetColumn, prevRow, prevCol, grid) {

    var elementID = "";

    if (grid[targetRow][targetColumn] == colValues.PATH) {
        grid[prevRow][prevCol] = colValues.DEADEND;
        elementID = `${prevRow}:${prevCol}`;
        document.getElementById(elementID).setAttribute("blockValue", "deadend");
    }

    elementID = `${targetRow}:${targetColumn}`;
    document.getElementById(elementID).setAttribute("blockValue", "step");
    grid[targetRow][targetColumn] = colValues.PATH;


    //check if exit is possible
    if (targetRow == exitRow && targetColumn == exitColumn) {
        return true;
    } else {
        return false;
    }

}
//test for path in the array
function isPath(element) {
    return element == "f";
}