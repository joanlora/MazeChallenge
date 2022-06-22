const grid1 = [
    ['f', 'f', 'f', 'f'],
    ['t', 't', 'f', 't'],
    ['f', 'f', 'f', 'f'],
    ['f', 'f', 'f', 'f']
];

const grid2 = [
    ['f', 'f', 'f', 'f', 'f'],
    ['t', 't', 'f', 't', 'f'],
    ['f', 'f', 'f', 'f', 'f'],
    ['f', 't', 'f', 'f', 'f']
];

const grid3 = [
    ['t', 'f', 't', 't', 't'],
    ['f', 'f', 't', 't', 't'],
    ['f', 't', 'f', 'f', 'f'],
    ['f', 'f', 'f', 't', 'f'],
    ['t', 't', 't', 'f', 'f'],
    ['t', 't', 't', 'f', 't']
];

const grid4 = [
    ['t', 't', 't', 't', 'f'],
    ['f', 'f', 'f', 't', 'f'],
    ['f', 't', 'f', 't', 'f'],
    ['f', 't', 'f', 't', 'f'],
    ['f', 't', 'f', 'f', 'f'],
    ['f', 't', 't', 't', 't']
];

const grid5 = [
    ['t', 'f', 't', 't', 't'],
    ['t', 'f', 'f', 'f', 'f'],
    ['t', 't', 't', 't', 'f'],
    ['f', 'f', 'f', 't', 'f'],
    ['f', 't', 'f', 'f', 'f'],
    ['f', 't', 't', 't', 't']
];

var cGrid = []; // Holds grid1-5

//render rows and columns for grid1-5
function displayGrid(grid, title) {

    //set the current grid. So that the solve method knows which one to solve. 
    cGrid = grid;
    document.getElementById("gridTitle").innerHTML = title;

    if (title.includes("void")) {
        document.getElementById("gridTitle").setAttribute("colorValue", "void");
    } else if (title.includes("arc")) {
        document.getElementById("gridTitle").setAttribute("colorValue", "arc");
    } else if (title.includes("solar")) {
        document.getElementById("gridTitle").setAttribute("colorValue", "solar");
    } else {
        document.getElementById("gridTitle").setAttribute("colorValue", "default");
    }

    let resultsHTML = "";
    //loops through rows of grid1-5 to find path, wall, open or deadend (from bottom row to top row)
    for (irow = cGrid.length - 1; irow >= 0; irow--) {

        let rowVal = "";
        let blockVal = "";
        let colVal = "";
        let name = "";
        //loop through columns. Reset the columns values if selected before        
        for (icol = 0; icol < cGrid[irow].length; icol++) {
            blockVal = cGrid[irow][icol];
            switch (cGrid[irow][icol].toLowerCase()) {
                case "t":
                    blockVal = "wall"
                    break;
                case "f":
                    blockVal = "path"
                    break;
                case "pt":
                    blockVal = "path"
                    cGrid[irow][icol] = "f"
                    break;
                case "de":
                    blockVal = "path"
                    cGrid[irow][icol] = "f"
                    break;
            }

            colVal = cGrid[irow][icol];
            name = `${irow}:${icol}`;
            rowVal += renderColumn(colVal, blockVal, name);
        }
        resultsHTML += renderRow(rowVal);
    }
    document.getElementById("gridDisplay").innerHTML = resultsHTML;

}

//renders grid columns (passes through values and will insert into this string)
function renderColumn(colVal, blockVal, name) {
    return `<td id="${name}" blockValue = "${blockVal}" class="gridStyle">
                ${colVal}
             </td>`
}

//renders row template with template literals experssions
function renderRow(rowVal) {
    return `<tr h-100>
                ${rowVal}
            </tr>`
}