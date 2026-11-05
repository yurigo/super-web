
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

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = Number(cell.dataset.index);

        if (!gameActive || board[index] !== '') return;

        board[index] = currentPlayer;

        cell.textContent = currentPlayer;
        cell.setAttribute('aria-label', `Casilla ${index + 1}, ${currentPlayer}`);
        cell.classList.add(currentPlayer.toLowerCase());
        cell.disabled = true;

        checkWinner();
    });
});

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
