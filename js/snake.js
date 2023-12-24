const canvas = document.getElementById('main-canvas')
const ctx = canvas.getContext('2d')
class SnakePart {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

let SPEED = 8
const TILE_COUNT = 20
const TILE_SIZE = 20
let HEAD_X = canvas.width / 2
let HEAD_Y = canvas.width / 2
let AXIS_X = 0
let AXIS_Y = 0
let FOOD_X = canvas.width / 4
let FOOD_Y = canvas.width / 4
const SNAKE_PARTS = []
let tailLength = 2
let score = 0
const moreSound = new Audio('sound/more.mp3')
const gameOverSound = new Audio('sound/game_over.mp3')

function drawGameBoard() {
  const FIRST_BOARD_COLOR = '#2c2c54'
  const SECOND_BOARD_COLOR = '#474787'

  for (let i = 0; i <= TILE_COUNT; i++) {
    for (let q = 0; q <= TILE_COUNT; q++) {
      if ((i + q) % 2 == 0) {
        ctx.fillStyle = FIRST_BOARD_COLOR
      } else {
        ctx.fillStyle = SECOND_BOARD_COLOR
      }
      ctx.fillRect(TILE_COUNT * i, TILE_COUNT * q, TILE_COUNT, TILE_COUNT)
    }
  }
}

function drawGame() {
  snakeHeadLocation()
  let result = endGame()
  if (result) {
    return gameOverSound.play()
  }

  if (score > 2) {
    SPEED = 12
  }
  if (score > 10) {
    SPEED = 22
  }

  drawGameBoard()
  didSnakeAte()
  drawFood()
  drawSnake()
  drawScore()
  drawSpeed()
  setTimeout(drawGame, 1000 / SPEED)
}

function endGame() {
  let gameOver = false

  if (AXIS_X === 0 && AXIS_Y === 0) {
    return false
  }

  if (
    HEAD_X < 0 ||
    HEAD_X >= canvas.width ||
    HEAD_Y < 0 ||
    HEAD_Y >= canvas.height
  ) {
    gameOver = true
  }

  for (let i = 0; i < SNAKE_PARTS.length; i++) {
    let part = SNAKE_PARTS[i]
    if (part.x === HEAD_X && part.y === HEAD_Y) {
      gameOver = true
      break
    }
  }

  if (gameOver) {
    ctx.fillStyle = '#FFF'
    ctx.font = '60px Verdana'
    ctx.fillText('Game Over!', 20, canvas.height / 2)
  }
  return gameOver
}

drawGame()

function drawScore() {
  ctx.fillStyle = '#fff'
  ctx.font = '12px Verdana'
  ctx.fillText('Score: ' + score, 338, 14)
}

function drawSpeed() {
  ctx.fillStyle = '#fff'
  ctx.font = '12px Verdana'
  if (SPEED === 8) {
    ctx.fillText('Speed: 1', 268, 14)
  } else if (SPEED === 12) {
    ctx.fillText('Speed: 2', 268, 14)
  } else if (SPEED >= 22) {
    ctx.fillText('Speed: 9000', 250, 14)
  }
}

function drawSnake() {
  ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'
  for (let i = 0; i < SNAKE_PARTS.length; i++) {
    let tail = SNAKE_PARTS[i]
    ctx.fillRect(tail.x + 1, tail.y + 1, TILE_SIZE - 2, TILE_SIZE - 2)
  }
  SNAKE_PARTS.push(new SnakePart(HEAD_X, HEAD_Y))
  if (SNAKE_PARTS.length > tailLength) {
    SNAKE_PARTS.shift()
  }

  // head
  // ctx.fillStyle = 'green'
  // ctx.fillRect(HEAD_X, HEAD_Y, TILE_SIZE, TILE_SIZE)

  ctx.font = '22px serif'
  ctx.strokeText('🐸', HEAD_X - 5, HEAD_Y + 17)
}

function drawFood() {
  // food
  // ctx.fillStyle = 'red'
  // ctx.fillRect(FOOD_X, FOOD_Y, TILE_SIZE, TILE_SIZE)

  ctx.font = '21px serif'
  ctx.strokeText('🪰', FOOD_X - 5, FOOD_Y + 17)
}

function didSnakeAte() {
  const random = Math.random() * canvas.width
  if ((HEAD_X === FOOD_X) & (HEAD_Y === FOOD_Y)) {
    FOOD_X = random - (random % TILE_SIZE)
    FOOD_Y = random - (random % TILE_SIZE)
    tailLength++
    score++
    moreSound.play()
  }
}

function snakeHeadLocation() {
  HEAD_X += AXIS_X
  HEAD_Y += AXIS_Y
}

document.body.addEventListener('keydown', (event) => {
  if (event.code === 'KeyW' || event.code === 'ArrowUp') {
    if (AXIS_Y == 20) return
    AXIS_Y = -20
    AXIS_X = 0
  }
  if (event.code === 'KeyS' || event.code === 'ArrowDown') {
    if (AXIS_Y == -20) return
    AXIS_Y = +20
    AXIS_X = 0
  }
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    if (AXIS_X == 20) return
    AXIS_Y = 0
    AXIS_X = -20
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    if (AXIS_X == -20) return
    AXIS_Y = 0
    AXIS_X = +20
  }
})

const gameStartButton = document.getElementById('game-start-button')
gameStartButton.onclick = function () {
  if (AXIS_Y == 20) return
  AXIS_Y = -20
  AXIS_X = 0
}

const gameRestartButton = document.getElementById('game-restart-button')
gameRestartButton.onclick = function () {
  location.reload()
}
