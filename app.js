const startBtn = document.querySelector('#start-btn')
const screens = document.querySelectorAll('.screen')
const timeBtns = document.querySelector('.button-group')
const timer = document.getElementById('timer')
const board = document.getElementById('board')
const colors = ['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#70d6ff', '#ff70a6', '#ff9770', '#ffd670', '#e9ff70', '#d4d700', '#dddf00', '#eeef20', '#ffff3f']
let time = 0
let score = 0
let highScore = 0
let interval
let chosenTime

startBtn.addEventListener('click', () => {
    screens[0].classList.add('up')
})

timeBtns.addEventListener('click', (event) => {
    if (event.target.classList.contains('time-btn')) {
        time = parseInt(event.target.getAttribute('data-time'))
        chosenTime = event.target.getAttribute('data-time')
        timer.innerText = time
        screens[1].classList.add('up')
        startGame()
    }
})

board.addEventListener('click', (event) => {
    if (event.target.classList.contains('circle')) {
        event.target.remove()
        score++
        createCircle()
    }
})

function createCircle() {
    const circle = document.createElement('div')
    circle.classList.add('circle')

    const size = getRandomNumber(20, 80)
    const { width, height } = board.getBoundingClientRect()
    const x = getRandomNumber(0, width - size)
    const y = getRandomNumber(0, height - size)
    const color = getRandomColor()

    circle.style.width = `${size}px`
    circle.style.height = `${size}px`
    circle.style.top = `${y}px`
    circle.style.left = `${x}px`
    circle.style.backgroundColor = `${color}`
    circle.style.boxShadow = `0 0 2px ${color}, 0 0 5px ${color}`

    board.append(circle)
}

function startGame() {
    interval = setInterval(timerDecrease, 1000)
    createCircle()
    setTime(time)
}

function setTime(value) {
    if (value < 10) value = `0${value}`
    timer.innerText = `00:${value}`
}

function timerDecrease() {
    if (time === 0) {
        finishGame()
    } else {
        let current = --time
        setTime(current)
    }
}

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length)
    return colors[index]
}

function finishGame() {
    clearInterval(interval)
    let notification = ''

    if (score > getHighScore()) {
        setHighScore(chosenTime, score)
        highScore = getHighScore()
        const notificationColor = getRandomColor()
        notification = ` <span class="notification" style="box-shadow: 0 0 2px ${notificationColor}, 0 0 5px ${notificationColor}">new</span>`
    }

    const highScoreContainer = `<h3 class="high-score">High score: ${getHighScore()}${notification}</h3>`

    timer.parentNode.classList.add('hide')
    board.innerHTML = `${highScoreContainer}<h3>Score: ${score}<h3><button type="button" id="try-again-btn">Try again</button>`
    const tryAgainBtn = board.querySelector('#try-again-btn')
    tryAgainBtn.addEventListener('click', resetGame)
}

function resetGame() {
    board.innerHTML = ''
    timer.parentNode.classList.remove('hide')
    time = 0
    score = 0
    chosenTime = null
    screens[1].classList.remove('up')
}

function getHighScore() {
    let highScore = 0

    if (typeof JSON.parse(localStorage.getItem('highScore')) === 'number') {
        localStorage.removeItem('highScore')
    } else if (localStorage.getItem('highScore')) {
        highScore = JSON.parse(localStorage.getItem('highScore'))[chosenTime] || 0
    }

    return highScore
}

function setHighScore(time, value) {
    const mode = {}
    mode[time] = value
    let currentResult = JSON.parse(localStorage.getItem('highScore'))

    if (!currentResult) {
        localStorage.setItem('highScore', JSON.stringify(mode))
    }  else {
        currentResult[time] = value
        localStorage.setItem('highScore', JSON.stringify(currentResult))
    }
}