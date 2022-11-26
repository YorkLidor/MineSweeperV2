'use strict'
var gHintsLeft = 1
var gIsHintClicked = false
var gIsHintClickedForCheckLose = false

function onHintClick() {
   if(gIsHintClicked) return 
   if(!gIsHintClicked) {
    gIsHintClicked = true
   }
}

function getArrOfNonShowNeighbors(el, cellI, cellJ) {
    var neighbors = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            var currTd = document.getElementById(`${i}-${j}`)
            //Modal + gGame + Dom
            if (currTd.className != 'cell-show') {
                neighbors.push(currTd)
            }
        }
    } return neighbors
}

function revelArrOfElemntsForSec(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].className = 'cell-show'
    }
    setTimeout(() => {
        for (var i = 0; i < arr.length; i++) {
            arr[i].className = 'cell-hide'
        }
    }, 1000)
}

function isHintsLeft() {
    if (gHintsLeft <= 0) {
        return false
    } else return true
}

function renderHints() {
    if (gHintsLeft === 3) {
        document.querySelector('.hint').innerText = '💡💡💡'
    } else if (gHintsLeft === 2) {
        document.querySelector('.hint').innerText = '💡💡'
    } else if (gHintsLeft === 1) {
        document.querySelector('.hint').innerText = '💡'
    } else if (gHintsLeft === 0){
        document.querySelector('.hint').innerText = '❌'
    }
}

function setFirstHints() {
    if (gLevel.SIZE === 4) {
        document.querySelector('.hint').innerText = '💡'
        gHintsLeft = 1
    } else if (gLevel.SIZE === 8) {
        document.querySelector('.hint').innerText = '💡💡'
        gHintsLeft = 2
    } else if (gLevel.SIZE === 12) {
        document.querySelector('.hint').innerText = '💡💡💡'
        gHintsLeft = 3
    } 
}

