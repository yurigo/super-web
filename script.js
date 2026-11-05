
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

const winsX = document.getElementById('winsX');
const winsO = document.getElementById('winsO');

const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

let victories = {
    X: 0,
    O: 0
};

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const HUMAN = 'X';
const AI = 'O';
const MOVE_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7];
let aiTimeout = null;

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = Number(cell.dataset.index);

        if (!gameActive || currentPlayer !== HUMAN || board[index] !== '') return;

        makeMove(index);

        if (gameActive) {
            aiTimeout = setTimeout(aiMove, 400);
        }
    });
});

function makeMove(index) {
    board[index] = currentPlayer;

    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.disabled = true;

    checkWinner();
}

function aiMove() {
    aiTimeout = null;
    const move = getBestMove(board, AI, HUMAN);
    if (move !== null) makeMove(move);
}

function getWinner(b) {
    for (const [x, y, z] of winningCombinations) {
        if (b[x] && b[x] === b[y] && b[x] === b[z]) return b[x];
    }
    return null;
}

function getAvailableMoves(b) {
    return MOVE_ORDER.filter(i => b[i] === '');
}

// Minimax with alpha-beta pruning; scores favour quicker wins / slower losses.
function minimax(b, depth, isMaximizing, ai, human, alpha, beta) {
    const winner = getWinner(b);
    if (winner === ai) return 10 - depth;
    if (winner === human) return depth - 10;

    const moves = getAvailableMoves(b);
    if (moves.length === 0) return 0;

    let best = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
        b[move] = isMaximizing ? ai : human;
        const score = minimax(b, depth + 1, !isMaximizing, ai, human, alpha, beta);
        b[move] = '';

        if (isMaximizing) {
            best = Math.max(best, score);
            alpha = Math.max(alpha, best);
        } else {
            best = Math.min(best, score);
            beta = Math.min(beta, best);
        }

        if (beta <= alpha) break;
    }

    return best;
}

// Returns an optimal move (random among equally optimal ones) or null.
function getBestMove(b, ai = AI, human = HUMAN) {
    if (getWinner(b)) return null;

    const moves = getAvailableMoves(b);
    if (moves.length === 0) return null;

    let bestScore = -Infinity;
    let bestMoves = [];

    for (const move of moves) {
        b[move] = ai;
        const score = minimax(b, 1, false, ai, human, -Infinity, Infinity);
        b[move] = '';

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [move];
        } else if (score === bestScore) {
            bestMoves.push(move);
        }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function checkWinner() {
    let winningCombination = null;

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            winningCombination = combination;
            break;
        }
    }

    if (winningCombination) {
        gameActive = false;

        winningCombination.forEach(index => {
            cells[index].classList.add('winner');
        });

        victories[currentPlayer]++;

        updateScore();

        statusText.classList.add('is-win');
        statusText.textContent = `¡Jugador ${currentPlayer} ha ganado! 🎉`;

        return;
    }

    if (!board.includes('')) {
        gameActive = false;
        statusText.classList.add('is-draw');
        statusText.textContent = '¡Empate! 🤝';
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    updateTurn();
}

function updateTurn() {
    statusText.textContent = `Turno del jugador ${currentPlayer}`;

    scoreX.classList.toggle('active', currentPlayer === 'X');
    scoreO.classList.toggle('active', currentPlayer === 'O');
}

function updateScore() {
    winsX.textContent = victories.X;
    winsO.textContent = victories.O;
}

function resetGame() {
    clearTimeout(aiTimeout);
    aiTimeout = null;
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.setAttribute('aria-label', `Casilla ${Number(cell.dataset.index) + 1}, vacía`);
        cell.disabled = false;
        cell.className = 'cell';
    });

    statusText.classList.remove('is-win', 'is-draw');
    updateTurn();
}

resetButton.addEventListener('click', resetGame);
