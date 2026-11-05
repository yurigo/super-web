const SIZE = 4;
const TARGET = 2048;
const BEST_SCORE_KEY = 'arcadia-2048-best';

const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const statusElement = document.getElementById('gameStatus');
const overlayElement = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const continueButton = document.getElementById('continueGame');
const restartButton = document.getElementById('restartGame');

const tiles = [];
for (let index = 0; index < SIZE * SIZE; index++) {
    const tile = document.createElement('div');
    tile.className = 'twenty-tile';
    tile.setAttribute('role', 'gridcell');
    tile.setAttribute('aria-label', 'Vacía');
    boardElement.append(tile);
    tiles.push(tile);
}

let board = Array(SIZE * SIZE).fill(0);
let score = 0;
let bestScore = readBestScore();
let hasWon = false;
let gameOver = false;
let touchStart = null;

function readBestScore() {
    try {
        const savedScore = Number(localStorage.getItem(BEST_SCORE_KEY));
        return Number.isSafeInteger(savedScore) && savedScore > 0 ? savedScore : 0;
    } catch {
        return 0;
    }
}

function saveBestScore() {
    try {
        localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
    } catch {
        // The game remains playable when browser storage is unavailable.
    }
}

function addTile() {
    const emptyCells = board.reduce((indices, value, index) => {
        if (value === 0) indices.push(index);
        return indices;
    }, []);

    if (emptyCells.length === 0) return;
    const index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[index] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
    board.forEach((value, index) => {
        const tile = tiles[index];
        tile.textContent = value === 0 ? '' : String(value);
        tile.dataset.value = value === 0 ? '' : String(value);
        tile.setAttribute('aria-label', value === 0 ? 'Vacía' : String(value));
    });

    scoreElement.textContent = String(score);
    bestScoreElement.textContent = String(bestScore);
    overlayElement.hidden = !hasWon && !gameOver;
    continueButton.hidden = !hasWon;
    restartButton.hidden = !gameOver;
}

function slideLine(line) {
    const values = line.filter(value => value !== 0);
    const result = [];
    let gained = 0;

    for (let index = 0; index < values.length; index++) {
        if (values[index] === values[index + 1]) {
            const merged = values[index] * 2;
            result.push(merged);
            gained += merged;
            index++;
        } else {
            result.push(values[index]);
        }
    }

    while (result.length < SIZE) result.push(0);
    return { line: result, gained };
}

function move(direction) {
    if (gameOver || hasWon) return;

    const nextBoard = Array(SIZE * SIZE).fill(0);
    let gained = 0;

    for (let lineIndex = 0; lineIndex < SIZE; lineIndex++) {
        let line = [];
        for (let position = 0; position < SIZE; position++) {
            const row = direction === 'up' || direction === 'down' ? position : lineIndex;
            const column = direction === 'left' || direction === 'right' ? position : lineIndex;
            line.push(board[row * SIZE + column]);
        }

        if (direction === 'right' || direction === 'down') line.reverse();
        const slid = slideLine(line);
        if (direction === 'right' || direction === 'down') slid.line.reverse();
        gained += slid.gained;

        slid.line.forEach((value, position) => {
            const row = direction === 'up' || direction === 'down' ? position : lineIndex;
            const column = direction === 'left' || direction === 'right' ? position : lineIndex;
            nextBoard[row * SIZE + column] = value;
        });
    }

    if (nextBoard.every((value, index) => value === board[index])) return;

    board = nextBoard;
    score += gained;
    if (score > bestScore) {
        bestScore = score;
        saveBestScore();
    }
    addTile();

    if (!hasWon && board.includes(TARGET)) {
        hasWon = true;
        overlayTitle.textContent = '¡Has llegado a 2048!';
        overlayMessage.textContent = '¡Increíble! Puedes seguir jugando para superar tu puntuación.';
    } else if (!canMove()) {
        gameOver = true;
        overlayTitle.textContent = 'Fin de la partida';
        overlayMessage.textContent = 'No quedan movimientos posibles.';
    }

    if (!hasWon && !gameOver) {
        statusElement.textContent = gained > 0 ? `+${gained} puntos` : '¡Sigue combinando fichas!';
    }
    render();
}

function canMove() {
    if (board.includes(0)) return true;

    for (let row = 0; row < SIZE; row++) {
        for (let column = 0; column < SIZE; column++) {
            const index = row * SIZE + column;
            if (column < SIZE - 1 && board[index] === board[index + 1]) return true;
            if (row < SIZE - 1 && board[index] === board[index + SIZE]) return true;
        }
    }
    return false;
}

function newGame() {
    board = Array(SIZE * SIZE).fill(0);
    score = 0;
    hasWon = false;
    gameOver = false;
    statusElement.textContent = '¡Combina las fichas para llegar a 2048!';
    addTile();
    addTile();
    render();
}

document.addEventListener('keydown', event => {
    const directions = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    move(direction);
});

document.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => move(button.dataset.direction));
});

document.getElementById('newGame').addEventListener('click', newGame);
restartButton.addEventListener('click', newGame);
continueButton.addEventListener('click', () => {
    hasWon = false;
    if (!canMove()) {
        gameOver = true;
        overlayTitle.textContent = 'Fin de la partida';
        overlayMessage.textContent = 'No quedan movimientos posibles.';
    } else {
        statusElement.textContent = '¡Sigue jugando y supera tu récord!';
    }
    render();
});

boardElement.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
}, { passive: true });

boardElement.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStart = null;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 24) return;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        move(deltaX > 0 ? 'right' : 'left');
    } else {
        move(deltaY > 0 ? 'down' : 'up');
    }
}, { passive: true });

newGame();
