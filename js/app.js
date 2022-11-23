'use strict'

var gBoard
var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3 }
var MINE = '💣'
var gStartTime
var gTimerInterval
// cell = { minesAroundCount: 1, isShown: false, isMine: false, isMarked: false }

function initGame() {
    clearInterval(gTimerInterval)
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3 }
    //Modal
    gBoard = buildBoard(gLevel.SIZE)
    console.log('gBoard:', gBoard)
    //Dom
    renderBoard(gBoard)
    //Game is on
    gGame.isOn = true

}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = { minesAroundCount: 1, isShown: false, isMine: false, isMarked: false }
            board[i][j] = cell
        }
    }

    //Set random mines 
    var minesInBoard = gLevel.MINES
    for (var i = 0; i < minesInBoard; i++) {
        var randomI = getRandomInt(0, size)
        var randomJ = getRandomInt(0, size)
        if (board[randomI][randomJ].isMine) {
            minesInBoard++
        } else {
            board[randomI][randomJ].isMine = true
        }
    }

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var CellObg = board[i][j]
            var minesAroundCel = setMinesNegsCount(i, j, board)
            if (CellObg.isMine) minesAroundCel = MINE
            CellObg.minesAroundCount = minesAroundCel
        }
    }

    return board
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var CellObg = gBoard[i][j]
            var minesAround = CellObg.minesAroundCount

            strHTML += `<td id="${i}-${j}" onclick="onCellClicked(this, ${i}, ${j}, ${CellObg.isMine})" 
                class="cell-hide" onmouseup="onHandleKey(event,this,${i},${j})">${minesAround}</td>`

        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(el, i, j) {
    //Stop All if LOSE/WIN
    if (!gGame.isOn) return

    //Start Timer
    if (!gTimerInterval) startTimer()

    //Expand
    if(+el.innerText === 0 && el.className != 'cell-flag') {
        neighborsExpand(el,i, j)
    } else {
        //Modal + Dom
        switch (el.className) {
            case 'cell-hide':
                el.className = 'cell-show'
                gBoard[i][j].isShown = true
                gGame.shownCount++
                break;
            case 'cell-flag':
                break;
            case 'cell-show':
                break;
            case 'cell-ismain':
                break;
    
        }  
    }

    //chack WIN/LOSE
    if (gBoard[i][j].isMine && el.className != 'cell-flag') gameLose()
    chackWin()

}

function gameLose() {
    alert('You Lose')
    clearInterval(gTimerInterval)
    gGame.isOn = false
}

function gameWin() {
    alert('You Win')
    clearInterval(gTimerInterval)
    gGame.isOn = false
}

function levelChoose(size, mines) {
    clearInterval(gTimerInterval)
    gLevel.SIZE = size
    gLevel.MINES = mines
    initGame()
}

function chackWin() {
    if (gLevel.SIZE ** 2 - gLevel.MINES === gGame.shownCount && gLevel.MINES === gGame.markedCount) {
        gameWin()
    }
}



