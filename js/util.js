'use strict'

function setMinesNegsCount(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

//Expand 
function neighborsExpand(el,cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            //Modal + gGame + Dom
            var elCell = document.getElementById(`${i}-${j}`)
            console.log('ellCell:', elCell)
            if(!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
                gGame.shownCount++
                elCell.className = 'cell-show'
            }
            if(gBoard[i][j].isMarked) {
                gBoard[i][j].isMarked = false
                gGame.markedCount--
                elCell.className = 'cell-show'
            } 
        }
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function onHandleKey(event, el, i, j) {
    //Strat timer
    if (!gTimerInterval) startTimer()

    if (!gGame.isOn) return

    //Modal+Dom
    if (event.which === 3) {
        switch (el.className) {
            case 'cell-hide':
                el.className = 'cell-flag'
                gBoard[i][j].isMarked = true
                gGame.markedCount++
                break;
            case 'cell-flag':
                el.className = 'cell-hide'
                gBoard[i][j].isMarked = false
                gGame.markedCount--
                break;
            case 'cell-show':
                break;

        }
    }
    chackWin()
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        const seconds = (Date.now() - gStartTime) / 1000
        var elH2 = document.querySelector('.time')
        elH2.innerText = seconds.toFixed(3)
    }, 1);
}

function resetTime() {
    var elH2 = document.querySelector('.time')
    elH2.innerText = '0.000'
}