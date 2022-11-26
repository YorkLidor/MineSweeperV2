'use strict'

function populateStorage(level, score) {
    localStorage.setItem(`${level}`, `${score}`)
}

function getCurrLevel() {
    if (gLevel.SIZE === 4) {
        return 'level1'
    } else if(gLevel.SIZE === 8) {
        return 'level2'
    } else {
        return 'level3'
    }
}

function setBestScoreToModal(){
    document.querySelector('.best-score').innerText = 'Best Score' + '\n' +  'Level 1 best score ' + localStorage.getItem('level1') + '\n' + 'Level 2 best score ' + localStorage.getItem('level2') + '\n' + 'Level 3 best score ' + localStorage.getItem('level3')
}