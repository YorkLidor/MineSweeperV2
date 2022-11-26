'use strict'
var gBoard
var gLevel = { SIZE: 4, MINES: 2, LIVES: 1, HINTS: 3 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0,lives: 3 }
var MINE = '💣'
var gStartTime
var gTimeIntervalId
var gFirstRightClick = true
var gCurrLives = 1
var gTotalSeconds = 0
var gIsFirstClick = true
var gIsHint = false

function initGame() {
    gSafeClickLeft = 3
    randerSafeClick()
    setBestScoreToModal()
    resetTime()
    gIsFirstClick = true
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 1 }
    //Modal
    gBoard = buildBoard(gLevel.SIZE)
    //Dom 
    renderBoard(gBoard)
    setFirstHints()
    gGame.isOn = true
}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = { minesAroundCount: 22, isShown: false, isMine: false, isMarked: false, location: { i: i, j: j }, }
            board[i][j] = cell
            board[i][j].location.i = i
            board[i][j].location.j = j
        }
    }
    return board
}

function setRandomMines(board, size, row, col) {
    var minesInBoard = gLevel.MINES
    for (var i = 0; i < minesInBoard; i++) {
        var randomI = getRandomInt(0, size)
        var randomJ = getRandomInt(0, size)
        if (board[randomI][randomJ].isMine || board[randomI][randomJ] === board[row][col]) {
            minesInBoard++
        } else {
            board[randomI][randomJ].isMine = true
        }
    } 
    return board
}

function setNegs(size, board) {
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

            strHTML += `<td id="${i}-${j}" data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j}, ${CellObg.isMine})" 
                class="cell-hide" onmouseup="onRightClick(event,this,${i},${j})">${minesAround}</td>`

        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
    livesLeft()
}


function onCellClicked(el, i, j) {
    //Stop All if LOSE/WIN
    if (!gGame.isOn) return
    
    if(gIsFirstClick && gIsHintClicked) {
        alert('I promise you won\'t hit mine on the first step')
        gIsHintClicked = false
        return
    } else if (gIsHintClicked && isHintsLeft()) {
        var neighbors = getArrOfNonShowNeighbors(el, i, j)
        revelArrOfElemntsForSec(neighbors)
        gHintsLeft--
        gIsHintClicked = false
        gIsHintClickedForCheckLose = true
        renderHints()
    } 
    
    
    if(gIsFirstClick) {
        //Bild + render
        setRandomMines(gBoard, gLevel.SIZE, i ,j)
        setNegs(gLevel.SIZE, gBoard)
        renderBoard(gBoard)
        //Timer
        resetTime()
        gTimeIntervalId = setInterval(setTime, 1000)
        gIsFirstClick = false
        
        var gBoardCurrClicked = getCellFromTd(el)
        el = getTdFromCell(gBoardCurrClicked)
    }

    //Expand
    if (+el.innerText === 0 && el.className != 'cell-flag') {
        neighborsExpand(el, i, j)
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
        }
    }
    //chack WIN/LOSE
    if(gIsHintClickedForCheckLose) {
        gIsHintClickedForCheckLose = false
    } else {
        chackLose(i, j, el)
        gameEmojiChange(gBoard, i, j, el)
        chackWin()
    } 
}

function chackLose(i, j, el) {
    if (gBoard[i][j].isMine && el.className != 'cell-flag') {
        gLevel.LIVES--
        livesLeft()
    }
    if (gBoard[i][j].isMine && el.className != 'cell-flag' && gLevel.LIVES === 0) {
        clearInterval(gTimeIntervalId)
        gGame.isOn = false
    }
}

function levelChoose(size, mines, lives) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    gLevel.LIVES = lives
    gCurrLives = lives
    restartGame()
}

function gameWin() {
    document.querySelector('.face-img').src = "./img/winFace.png"
    var level = getCurrLevel()
    populateStorage(level,gTotalSeconds)
    setBestScoreToModal()
    clearInterval(gTimeIntervalId)
    gGame.isOn = false
}

function chackWin() {
    if (gLevel.SIZE ** 2 - gLevel.MINES === gGame.shownCount && gLevel.MINES === gGame.markedCount) {
        gameWin()
    }
}

function getTdFromCell(cell) {
    const i = cell.location.i
    const j = cell.location.j
    const td = document.getElementById(`${i}-${j}`)
    return td
}

function getCellFromTd(elTd) {
    const cellIdxI = elTd.dataset.i
    const cellIdxJ = elTd.dataset.j
    const cell = gBoard[cellIdxI][cellIdxJ]
    return cell
}

//life insert
function livesLeft() {
    if (gLevel.LIVES === 0) {
        document.querySelector('.lives').innerText = '❌'
    } else if (gLevel.LIVES === 1) {
        document.querySelector('.lives').innerText = '💖'
    } else if (gLevel.LIVES === 2) {
        document.querySelector('.lives').innerText = '💖💖'
    } else if (gLevel.LIVES === 3) {
        document.querySelector('.lives').innerText = '💖💖💖'
    }
}

function gameEmojiChange(board, i, j, el) {
    if (gLevel.LIVES === 0) {
        document.querySelector('.face-img').src = "./img/sadFace.png"
    } else if (board[i][j].isMine && gLevel.LIVES != 0 && el.className != 'cell-flag') {
        document.querySelector('.face-img').src = "./img/confusedFace.png"
        setTimeout(() => {
            document.querySelector('.face-img').src = "./img/happyFace.png"
        }, 500)
    }
}

function restartGame() {
    initGame()
    gLevel.LIVES = gCurrLives
    document.querySelector('.face-img').src = "./img/happyFace.png"
    if (gCurrLives === 1) {
        document.querySelector('.lives').innerText = '💖'
    } else if (gCurrLives === 2) {
        document.querySelector('.lives').innerText = '💖💖'
    } else if (gCurrLives === 3) {
        document.querySelector('.lives').innerText = '💖💖💖'
    }
}

function hintClick() {
    if(gLevel.HINTS!=0 && gIsHint === false) {
        gIsHint=true
        gLevel.HINTS--
        return true
    } else return false
}

function getArrOfNegs(cellI, cellJ, mat) {
    var negs = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            
        }
    }
    return negs
}