'use strict'

function revealCells(row, col) {
    if (row < 0 || row >= gBoard.length || col < 0 || col >= gBoard[0].length) return

    var cell = gBoard[row][col]; // now we are safe, so fetch the cell
    // if(cell instanceof MineCell) return
    var cellTd = getTdFromCell(cell)
    if (+cellTd.innerText === 0 ) {
        cellTd.className = 'cell-show'
        aa(row,col)
        revealCells(row-1,col-1);
        revealCells(row-1,col);
        revealCells(row-1,col+1);
        revealCells(row,col-1);
        revealCells(row,col+1);
        revealCells(row+1,col-1);
        revealCells(row+1,col);
        revealCells(row+1,col+1);
    } else return
}

function aa(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            var currTd = document.getElementById(`${i}-${j}`)
            //Modal + gGame + Dom
            if (currTd.className != 'cell-show') {
                currTd.className = 'cell-show'
            }
        }
    }  
}