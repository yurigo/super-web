const ROWS = 6;
const COLUMNS = 7;
const players = ['one', 'two'];

const boardElement = document.getElementById('fourBoard');
const controlsElement = document.getElementById('columnControls');
const statusElement = document.getElementById('fourStatus');
const resetButton = document.getElementById('fourReset');
const scoreElements = {
    one: document.getElementById('winsOne'),
    two: document.getElementById('winsTwo')
};
const playerCards = {
    one: document.getElementById('scoreOne'),
    two: document.getElementById('scoreTwo')
};

let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(''));
let currentPlayer = 'one';
let gameActive = true;
const victories = { one: 0, two: 0 };
const cells = [];
const columnButtons = [];

for (let row = 0; row < ROWS; row++) {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('role', 'row');
    rowElement.className = 'four-row';
    cells[row] = [];

    for (let column = 0; column < COLUMNS; column++) {
        const cell = document.createElement('span');
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `Fila ${row + 1}, columna ${column + 1}, vacía`);
        cell.className = 'four-cell';
        rowElement.append(cell);
        cells[row][column] = cell;
    }

    boardElement.append(rowElement);
}

for (let column = 0; column < COLUMNS; column++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'drop-button';
    button.setAttribute('aria-label', `Soltar ficha en la columna ${column + 1}`);
    button.innerHTML = '<span aria-hidden="true">↓</span>';
    button.addEventListener('click', () => makeMove(column));
    controlsElement.append(button);
    columnButtons.push(button);
}

function makeMove(column) {
    if (!gameActive || board[0][column] !== '') return;

    let row = ROWS - 1;
    while (board[row][column] !== '') row--;

    board[row][column] = currentPlayer;
    const cell = cells[row][column];
    cell.classList.add(`piece-${currentPlayer}`);
    cell.setAttribute('aria-label', `Fila ${row + 1}, columna ${column + 1}, Jugador ${players.indexOf(currentPlayer) + 1}`);
    updateColumnButtons();

    const winningCells = getWinningLine(row, column);
    if (winningCells) {
        gameActive = false;
        winningCells.forEach(([winningRow, winningColumn]) => {
            cells[winningRow][winningColumn].classList.add('winner');
        });
        victories[currentPlayer]++;
        scoreElements[currentPlayer].textContent = victories[currentPlayer];
        statusElement.className = `four-status is-win player-${currentPlayer}`;
        statusElement.textContent = `¡Jugador ${players.indexOf(currentPlayer) + 1} ha ganado!`;
        updateColumnButtons();
        return;
    }

    if (board.every(boardRow => boardRow.every(Boolean))) {
        gameActive = false;
        statusElement.className = 'four-status is-draw';
        statusElement.textContent = '¡Empate! El tablero está completo.';
        updateColumnButtons();
        return;
    }

    currentPlayer = currentPlayer === 'one' ? 'two' : 'one';
    updateTurn();
}

function getWinningLine(row, column) {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [rowStep, columnStep] of directions) {
        const line = [[row, column]];

        for (const sign of [-1, 1]) {
            let nextRow = row + rowStep * sign;
            let nextColumn = column + columnStep * sign;

            while (
                nextRow >= 0 && nextRow < ROWS &&
                nextColumn >= 0 && nextColumn < COLUMNS &&
                board[nextRow][nextColumn] === currentPlayer
            ) {
                if (sign < 0) line.unshift([nextRow, nextColumn]);
                else line.push([nextRow, nextColumn]);
                nextRow += rowStep * sign;
                nextColumn += columnStep * sign;
            }
        }

        if (line.length >= 4) return line;
    }

    return null;
}

function updateTurn() {
    const playerNumber = players.indexOf(currentPlayer) + 1;
    statusElement.className = `four-status player-${currentPlayer}`;
    statusElement.textContent = `Turno de Jugador ${playerNumber}`;
    playerCards.one.classList.toggle('active', currentPlayer === 'one');
    playerCards.two.classList.toggle('active', currentPlayer === 'two');
    updateColumnButtons();
}

function updateColumnButtons() {
    columnButtons.forEach((button, column) => {
        button.disabled = !gameActive || board[0][column] !== '';
    });
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(''));
    currentPlayer = 'one';
    gameActive = true;

    cells.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            cell.className = 'four-cell';
            cell.setAttribute('aria-label', `Fila ${rowIndex + 1}, columna ${columnIndex + 1}, vacía`);
        });
    });

    updateTurn();
}

resetButton.addEventListener('click', resetGame);
updateTurn();
