const panels = {
  menu: document.getElementById('menu'),
  game: document.getElementById('game'),
  info: document.getElementById('info'),
};

const menuMessage = document.getElementById('menuMessage');
const menuButtons = document.querySelectorAll('[data-menu-action]');
const boardEl = document.getElementById('board');
const statusText = document.getElementById('statusText');
const returnBtn = document.getElementById('returnBtn');
const newGameBtn = document.getElementById('newGameBtn');
const infoTitle = document.getElementById('infoTitle');
const infoBody = document.getElementById('infoBody');
const infoBackBtn = document.getElementById('infoBackBtn');

const HUMAN = 'X';
const CPU = 'O';
let board = Array(9).fill('');
let gameOver = false;

function showPanel(name) {
  Object.values(panels).forEach((panel) => panel.classList.remove('active'));
  panels[name].classList.add('active');
}

function printMenuLine(text, delay = 0) {
  window.setTimeout(() => {
    menuMessage.textContent = text;
  }, delay);
}

function initBoard() {
  board = Array(9).fill('');
  gameOver = false;
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i += 1) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.type = 'button';
    cell.dataset.index = String(i);
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Cell ${i + 1}`);
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  }
  statusText.textContent = 'PLAYER X: MAKE YOUR MOVE';
}

function onCellClick(event) {
  const idx = Number(event.currentTarget.dataset.index);
  if (gameOver || board[idx]) {
    return;
  }

  makeMove(idx, HUMAN);
  if (checkEnd(HUMAN)) {
    return;
  }

  statusText.textContent = 'COMPUTER THINKING...';
  window.setTimeout(() => {
    const cpuMove = pickCpuMove();
    if (cpuMove !== -1) {
      makeMove(cpuMove, CPU);
      checkEnd(CPU);
    }
  }, 480);
}

function makeMove(idx, player) {
  board[idx] = player;
  const cell = boardEl.children[idx];
  cell.textContent = player;
  cell.disabled = true;
}

function checkEnd(player) {
  if (hasWinner(board, player)) {
    gameOver = true;
    statusText.textContent = player === HUMAN ? 'A STRANGE GAME. YOU WIN.' : 'COMPUTER PREVAILS.';
    disableRemaining();
    return true;
  }

  if (board.every(Boolean)) {
    gameOver = true;
    statusText.textContent = 'THE ONLY WINNING MOVE IS NOT TO LOSE.';
    return true;
  }

  statusText.textContent = player === HUMAN ? 'COMPUTER THINKING...' : 'PLAYER X: MAKE YOUR MOVE';
  return false;
}

function disableRemaining() {
  Array.from(boardEl.children).forEach((cell) => {
    cell.disabled = true;
  });
}

function pickCpuMove() {
  const empties = board
    .map((value, index) => (value ? null : index))
    .filter((value) => value !== null);

  for (const idx of empties) {
    const copy = [...board];
    copy[idx] = CPU;
    if (hasWinner(copy, CPU)) {
      return idx;
    }
  }

  for (const idx of empties) {
    const copy = [...board];
    copy[idx] = HUMAN;
    if (hasWinner(copy, HUMAN)) {
      return idx;
    }
  }

  if (empties.includes(4)) {
    return 4;
  }

  const preferred = [0, 2, 6, 8, 1, 3, 5, 7];
  return preferred.find((idx) => empties.includes(idx)) ?? -1;
}

function hasWinner(state, player) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return lines.some((line) => line.every((idx) => state[idx] === player));
}

function setInfo(kind) {
  if (kind === 'rules') {
    infoTitle.textContent = 'SIMULATION RULESET';
    infoBody.textContent = '1. PLAYER IS X. COMPUTER IS O.\n2. THREE SYMBOLS IN A LINE WINS.\n3. FAILURE TO PLAN IS PLANNING TO FAIL.';
  } else {
    infoTitle.textContent = 'SYSTEM STATUS';
    infoBody.textContent = 'PROCESSOR: WOPR-CLASS MAINFRAME\nDISPLAY: MONOCHROME CRT ACTIVE\nDIRECTIVE: PLAY TIC-TAC-TOE';
  }
}

menuButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.menuAction;

    if (action === 'start') {
      showPanel('game');
      initBoard();
      return;
    }

    setInfo(action);
    showPanel('info');
  });
});

returnBtn.addEventListener('click', () => {
  showPanel('menu');
  printMenuLine('SIMULATION ABORTED. SELECT OPTION.');
});

newGameBtn.addEventListener('click', initBoard);
infoBackBtn.addEventListener('click', () => showPanel('menu'));

showPanel('menu');
printMenuLine('GREETINGS PROFESSOR FALKEN.', 250);
window.setTimeout(() => printMenuLine('SHALL WE PLAY A GAME?', 900), 900);
