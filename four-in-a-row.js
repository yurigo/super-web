const ROWS = 6;
const COLUMNS = 7;
const HUMAN = 'one';
const AI = 'two';
const players = { one: 'Tú', two: 'IA' };
const MOVE_ORDER = [3, 2, 4, 1, 5, 0, 6];
const SEARCH_DEPTH = 5;

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
let aiTimeout = null;
const victories = { one: 0, two: 0 };
const cells = [];
const columnButtons = [];
const winningWindows = [];

for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
        for (const [rowStep, columnStep] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
            const endRow = row + rowStep * 3;
            const endColumn = column + columnStep * 3;
            if (endRow < ROWS && endColumn >= 0 && endColumn < COLUMNS) {
                winningWindows.push(Array.from({ length: 4 }, (_, offset) => [
                    row + rowStep * offset,
                    column + columnStep * offset
                ]));
            }
        }
    }
}

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
    button.addEventListener('click', () => {
        if (!gameActive || currentPlayer !== HUMAN) return;
        makeMove(column);
        if (gameActive) aiTimeout = setTimeout(aiMove, 350);
    });
    controlsElement.append(button);
    columnButtons.push(button);
}

function makeMove(column) {
    if (!gameActive || board[0][column] !== '') return;

    let row = ROWS - 1;
    while (board[row][column] !== '') row--;

    const player = currentPlayer;
    board[row][column] = currentPlayer;
    const cell = cells[row][column];
    cell.classList.add(`piece-${currentPlayer}`);
    cell.setAttribute('aria-label', `Fila ${row + 1}, columna ${column + 1}, ${players[player]}`);
    updateColumnButtons();

    const winningCells = getWinningLine(board, row, column, player);
    if (winningCells) {
        gameActive = false;
        winningCells.forEach(([winningRow, winningColumn]) => {
            cells[winningRow][winningColumn].classList.add('winner');
        });
        victories[player]++;
        scoreElements[player].textContent = victories[player];
        statusElement.className = 'four-status is-win';
        statusElement.textContent = player === HUMAN ? '¡Has ganado!' : '¡La IA ha ganado!';
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

    currentPlayer = currentPlayer === HUMAN ? AI : HUMAN;
    updateTurn();
}

function aiMove() {
    aiTimeout = null;
    if (!gameActive || currentPlayer !== AI) return;
    const column = getBestMove(board);
    if (column !== null) makeMove(column);
}

function getWinningLine(position, row, column, player) {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [rowStep, columnStep] of directions) {
        const line = [[row, column]];

        for (const sign of [-1, 1]) {
            let nextRow = row + rowStep * sign;
            let nextColumn = column + columnStep * sign;

            while (
                nextRow >= 0 && nextRow < ROWS &&
                nextColumn >= 0 && nextColumn < COLUMNS &&
                position[nextRow][nextColumn] === player
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

function getAvailableMoves(position) {
    return MOVE_ORDER.filter(column => position[0][column] === '');
}

function evaluatePosition(position) {
    let score = 0;

    for (let row = 0; row < ROWS; row++) {
        if (position[row][Math.floor(COLUMNS / 2)] === AI) score += 3;
        else if (position[row][Math.floor(COLUMNS / 2)] === HUMAN) score -= 3;
    }

    for (const window of winningWindows) {
        let aiCount = 0;
        let humanCount = 0;
        for (const [row, column] of window) {
            if (position[row][column] === AI) aiCount++;
            else if (position[row][column] === HUMAN) humanCount++;
        }

        if (aiCount && !humanCount) {
            score += [0, 1, 12, 90, 10000][aiCount];
        } else if (humanCount && !aiCount) {
            score -= [0, 1, 14, 110, 10000][humanCount];
        }
    }

    return score;
}

function minimax(position, depth, maximizing, alpha, beta, lastMove) {
    if (lastMove) {
        const winner = getWinningLine(position, lastMove.row, lastMove.column, lastMove.player);
        if (winner) return lastMove.player === AI ? 10000 + depth : -10000 - depth;
    }

    const moves = getAvailableMoves(position);
    if (moves.length === 0) return 0;
    if (depth === 0) return evaluatePosition(position);

    if (maximizing) {
        let best = -Infinity;
        for (const column of moves) {
            const row = getOpenRow(position, column);
            position[row][column] = AI;
            best = Math.max(best, minimax(position, depth - 1, false, alpha, beta, { row, column, player: AI }));
            position[row][column] = '';
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break;
        }
        return best;
    }

    let best = Infinity;
    for (const column of moves) {
        const row = getOpenRow(position, column);
        position[row][column] = HUMAN;
        best = Math.min(best, minimax(position, depth - 1, true, alpha, beta, { row, column, player: HUMAN }));
        position[row][column] = '';
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
    }
    return best;
}

function getOpenRow(position, column) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!position[row][column]) return row;
    }
    return -1;
}

function getBestMove(position) {
    let bestScore = -Infinity;
    let bestColumn = null;
    let alpha = -Infinity;

    for (const column of getAvailableMoves(position)) {
        const row = getOpenRow(position, column);
        position[row][column] = AI;
        const score = minimax(position, SEARCH_DEPTH - 1, false, alpha, Infinity, { row, column, player: AI });
        position[row][column] = '';

        if (score > bestScore) {
            bestScore = score;
            bestColumn = column;
        }
        alpha = Math.max(alpha, bestScore);
    }

    return bestColumn;
}

function updateTurn() {
    statusElement.className = `four-status player-${currentPlayer}`;
    statusElement.textContent = currentPlayer === HUMAN ? 'Tu turno' : 'Turno de la IA';
    playerCards.one.classList.toggle('active', currentPlayer === 'one');
    playerCards.two.classList.toggle('active', currentPlayer === 'two');
    updateColumnButtons();
}

function updateColumnButtons() {
    columnButtons.forEach((button, column) => {
        button.disabled = !gameActive || currentPlayer !== HUMAN || board[0][column] !== '';
    });
}

function resetGame() {
    clearTimeout(aiTimeout);
    aiTimeout = null;
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
