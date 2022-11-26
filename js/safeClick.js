'use strict'

var gisSafeclick = false
var gSafeClickLeft = 3

function onSafeClick(){
    if(!isSafeclickLeft()) return
    gisSafeclick = true
    if(gIsFirstClick && gisSafeclick) {
        alert('I promise you won\'t hit mine on the first step')
        gisSafeclick = false
        return
    } else if(gisSafeclick) {
        var safePlaces = getArrOfSafePlaces()
        markRandomSafePlace(safePlaces)
        gSafeClickLeft--
        randerSafeClick()
        gisSafeclick = false
    }   
}

function getArrOfSafePlaces() {
    var safes = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cellTd = getTdFromCell(gBoard[i][j])
            if (!gBoard[i][j].isMine && cellTd.className != 'cell-show') {
                safes.push(gBoard[i][j])
            }
        }
    }
    return safes
}

function markRandomSafePlace(arr) {
    var randomIdx = getRandomInt(0, arr.length)
    var cellTd = getTdFromCell(arr[randomIdx])

    cellTd.className = 'cell-safe-click'
    setTimeout(() => {
        cellTd.className = 'cell-hide'
    }, 500);

    cellTd.className = 'cell-safe-click'
    setTimeout(() => {
        cellTd.className = 'cell-hide'
    }, 500);

}

function randerSafeClick() {
    document.querySelector('.safe-click').innerText = gSafeClickLeft + ''
}

function isSafeclickLeft() {
    if (gSafeClickLeft > 0) {
        return true
    } else {
        return false
    }
}


