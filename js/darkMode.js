'use strict'
var isDarkMode = false

function onClickDarkModeBtn(){
    if(!isDarkMode) {
        isDarkMode = true
        document.querySelector('body').className = 'dark-mode'
    } else {
        document.body.classList.remove('dark-mode')
        isDarkMode = false
    }
}