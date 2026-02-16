const panels = {
  menu: document.getElementById('menu'),
  game: document.getElementById('game'),
  info: document.getElementById('info'),
};

const menuMessage = document.getElementById('menuMessage');
const menuButtons = document.querySelectorAll('[data-menu-action]');
const gameTitle = document.getElementById('gameTitle');
const boardEl = document.getElementById('board');
const dotsBoardEl = document.getElementById('dotsBoard');
const squaresScore = document.getElementById('squaresScore');
const statusText = document.getElementById('statusText');
const ticTacToeGame = document.getElementById('ticTacToeGame');
const squaresGame = document.getElementById('squaresGame');
const returnBtn = document.getElementById('returnBtn');
const newGameBtn = document.getElementById('newGameBtn');
const infoTitle = document.getElementById('infoTitle');
const infoBody = document.getElementById('infoBody');
const infoBackBtn = document.getElementById('infoBackBtn');

const HUMAN = 'X';
const CPU = 'O';

const DOTS = 10;
let activeGame = 'ttt';

let tttBoard = Array(9).fill('');
let tttOver = false;

let sqEdges = new Set();
let sqBoxes = Array((DOTS - 1) * (DOTS - 1)).fill('');
let sqCurrent = HUMAN;
let sqOver = false;
let sqScores = { X: 0, O: 0 };

function showPanel(name) {
  Object.values(panels).forEach((panel) => panel.classList.remove('active'));
  panels[name].classList.add('active');
}

function setGameMode(mode) {
  activeGame = mode;
  ticTacToeGame.classList.toggle('active', mode === 'ttt');
  squaresGame.classList.toggle('active', mode === 'squares');
  gameTitle.textContent = mode === 'ttt' ? 'SIMULATION: TIC-TAC-TOE' : 'SIMULATION: SQUARES';
}

function startBootSequence() {
  menuMessage.innerHTML = '';
  const line1 = document.createElement('div');
  line1.className = 'message-line';
  line1.textContent = 'GREETINGS PROFESSOR FALKEN.';

  const line2 = document.createElement('div');
  line2.className = 'message-line cursor';

  menuMessage.append(line1, line2);

  const message = 'SHALL WE PLAY A GAME?';
  let i = 0;
  window.setTimeout(() => {
    const timer = window.setInterval(() => {
      line2.textContent += message[i];
      i += 1;
      if (i >= message.length) {
        window.clearInterval(timer);
      }
    }, 55);
  }, 700);
}

function makeMoveTTT(idx, player) {
  tttBoard[idx] = player;
  const cell = boardEl.children[idx];
  cell.textContent = player;
  cell.disabled = true;
}

function hasWinnerTTT(state, player) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  return lines.some((line) => line.every((idx) => state[idx] === player));
}

function disableRemainingTTT() {
  Array.from(boardEl.children).forEach((cell) => {
    cell.disabled = true;
  });
}

function pickCpuMoveTTT() {
  const empties = tttBoard.map((value, index) => (value ? null : index)).filter((v) => v !== null);

  for (const idx of empties) {
    const copy = [...tttBoard];
    copy[idx] = CPU;
    if (hasWinnerTTT(copy, CPU)) {
      return idx;
    }
  }

  for (const idx of empties) {
    const copy = [...tttBoard];
    copy[idx] = HUMAN;
    if (hasWinnerTTT(copy, HUMAN)) {
      return idx;
    }
  }

  if (empties.includes(4)) {
    return 4;
  }

  const preferred = [0, 2, 6, 8, 1, 3, 5, 7];
  return preferred.find((idx) => empties.includes(idx)) ?? -1;
}

function checkEndTTT(player) {
  if (hasWinnerTTT(tttBoard, player)) {
    tttOver = true;
    statusText.textContent = player === HUMAN ? 'A STRANGE GAME. YOU WIN.' : 'COMPUTER PREVAILS.';
    disableRemainingTTT();
    return true;
  }

  if (tttBoard.every(Boolean)) {
    tttOver = true;
    statusText.textContent = 'THE ONLY WINNING MOVE IS NOT TO PLAY.';
    return true;
  }

  statusText.textContent = player === HUMAN ? 'COMPUTER THINKING...' : 'PLAYER X: MAKE YOUR MOVE';
  return false;
}

function onCellClick(event) {
  const idx = Number(event.currentTarget.dataset.index);
  if (tttOver || tttBoard[idx]) {
    return;
  }

  makeMoveTTT(idx, HUMAN);
  if (checkEndTTT(HUMAN)) {
    return;
  }

  statusText.textContent = 'COMPUTER THINKING...';
  window.setTimeout(() => {
    const cpuMove = pickCpuMoveTTT();
    if (cpuMove !== -1) {
      makeMoveTTT(cpuMove, CPU);
      checkEndTTT(CPU);
    }
  }, 440);
}

function initTicTacToe() {
  setGameMode('ttt');
  tttBoard = Array(9).fill('');
  tttOver = false;
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
  newGameBtn.textContent = 'NEW TIC-TAC-TOE';
}

function edgeKey(orientation, row, col) {
  return `${orientation}-${row}-${col}`;
}

function boxIndex(row, col) {
  return row * (DOTS - 1) + col;
}

function adjacentBoxesForEdge(edge) {
  const [orientation, row, col] = edge.split('-');
  const r = Number(row);
  const c = Number(col);
  const boxes = [];

  if (orientation === 'h') {
    if (r > 0) boxes.push([r - 1, c]);
    if (r < DOTS - 1) boxes.push([r, c]);
  } else {
    if (c > 0) boxes.push([r, c - 1]);
    if (c < DOTS - 1) boxes.push([r, c]);
  }

  return boxes;
}

function sidesOfBox(row, col, extraEdge = null) {
  const edges = [
    edgeKey('h', row, col),
    edgeKey('h', row + 1, col),
    edgeKey('v', row, col),
    edgeKey('v', row, col + 1),
  ];

  return edges.filter((edge) => sqEdges.has(edge) || edge === extraEdge).length;
}

function claimBoxesForEdge(edge, player) {
  let claimed = 0;
  for (const [row, col] of adjacentBoxesForEdge(edge)) {
    const idx = boxIndex(row, col);
    if (sqBoxes[idx]) {
      continue;
    }

    if (sidesOfBox(row, col) === 4) {
      sqBoxes[idx] = player;
      sqScores[player] += 1;
      const boxEl = dotsBoardEl.querySelector(`[data-box="${row}-${col}"]`);
      boxEl.textContent = player;
      boxEl.classList.add(player === HUMAN ? 'claimed-x' : 'claimed-o');
      claimed += 1;
    }
  }

  return claimed;
}

function updateSquaresScore() {
  squaresScore.textContent = `PLAYER X: ${sqScores.X}   |   COMPUTER O: ${sqScores.O}`;
}

function availableSquareEdges() {
  const edges = [];
  for (let r = 0; r < DOTS; r += 1) {
    for (let c = 0; c < DOTS - 1; c += 1) {
      const key = edgeKey('h', r, c);
      if (!sqEdges.has(key)) edges.push(key);
    }
  }

  for (let r = 0; r < DOTS - 1; r += 1) {
    for (let c = 0; c < DOTS; c += 1) {
      const key = edgeKey('v', r, c);
      if (!sqEdges.has(key)) edges.push(key);
    }
  }

  return edges;
}

function applySquareMove(edge, player) {
  if (sqOver || sqEdges.has(edge)) {
    return 0;
  }

  sqEdges.add(edge);
  const edgeEl = dotsBoardEl.querySelector(`[data-edge="${edge}"]`);
  edgeEl.disabled = true;
  edgeEl.classList.add(player === HUMAN ? 'claimed-x' : 'claimed-o');

  const claimed = claimBoxesForEdge(edge, player);
  updateSquaresScore();

  if (sqBoxes.every(Boolean)) {
    sqOver = true;
    if (sqScores.X > sqScores.O) {
      statusText.textContent = 'PLAYER X CONTROLS THE GRID.';
    } else if (sqScores.O > sqScores.X) {
      statusText.textContent = 'COMPUTER CONTROLS THE GRID.';
    } else {
      statusText.textContent = 'DEADLOCK. NO WINNING STRATEGY FOUND.';
    }
    return claimed;
  }

  if (claimed === 0) {
    sqCurrent = player === HUMAN ? CPU : HUMAN;
  }

  statusText.textContent = sqCurrent === HUMAN ? 'PLAYER X: DRAW ONE LINE' : 'COMPUTER ANALYZING GRID...';
  return claimed;
}

function pickSquaresCpuMove() {
  const edges = availableSquareEdges();
  const winning = edges.filter((edge) => adjacentBoxesForEdge(edge).some(([r, c]) => !sqBoxes[boxIndex(r, c)] && sidesOfBox(r, c, edge) === 4));
  if (winning.length > 0) {
    return winning[Math.floor(Math.random() * winning.length)];
  }

  const safe = edges.filter((edge) => !adjacentBoxesForEdge(edge).some(([r, c]) => !sqBoxes[boxIndex(r, c)] && sidesOfBox(r, c, edge) === 3));
  if (safe.length > 0) {
    return safe[Math.floor(Math.random() * safe.length)];
  }

  return edges[Math.floor(Math.random() * edges.length)];
}

function runSquaresCpuTurn() {
  if (sqOver || sqCurrent !== CPU) {
    return;
  }

  window.setTimeout(() => {
    const move = pickSquaresCpuMove();
    applySquareMove(move, CPU);

    if (!sqOver && sqCurrent === CPU) {
      runSquaresCpuTurn();
    }
  }, 280);
}

function onSquareEdgeClick(event) {
  if (sqOver || sqCurrent !== HUMAN) {
    return;
  }

  const edge = event.currentTarget.dataset.edge;
  applySquareMove(edge, HUMAN);
  if (!sqOver && sqCurrent === CPU) {
    runSquaresCpuTurn();
  }
}

function initSquares() {
  setGameMode('squares');
  sqEdges = new Set();
  sqBoxes = Array((DOTS - 1) * (DOTS - 1)).fill('');
  sqCurrent = HUMAN;
  sqOver = false;
  sqScores = { X: 0, O: 0 };

  dotsBoardEl.innerHTML = '';
  for (let row = 0; row < DOTS * 2 - 1; row += 1) {
    for (let col = 0; col < DOTS * 2 - 1; col += 1) {
      const rowEven = row % 2 === 0;
      const colEven = col % 2 === 0;

      if (rowEven && colEven) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsBoardEl.appendChild(dot);
        continue;
      }

      if (rowEven && !colEven) {
        const edge = document.createElement('button');
        edge.type = 'button';
        edge.className = 'edge edge-h';
        edge.dataset.edge = edgeKey('h', row / 2, (col - 1) / 2);
        edge.addEventListener('click', onSquareEdgeClick);
        dotsBoardEl.appendChild(edge);
        continue;
      }

      if (!rowEven && colEven) {
        const edge = document.createElement('button');
        edge.type = 'button';
        edge.className = 'edge edge-v';
        edge.dataset.edge = edgeKey('v', (row - 1) / 2, col / 2);
        edge.addEventListener('click', onSquareEdgeClick);
        dotsBoardEl.appendChild(edge);
        continue;
      }

      const box = document.createElement('div');
      box.className = 'box';
      box.dataset.box = `${(row - 1) / 2}-${(col - 1) / 2}`;
      dotsBoardEl.appendChild(box);
    }
  }

  updateSquaresScore();
  statusText.textContent = 'PLAYER X: DRAW ONE LINE';
  newGameBtn.textContent = 'NEW SQUARES GAME';
}

function setInfo(kind) {
  if (kind === 'rules') {
    infoTitle.textContent = 'SIMULATION RULESET';
    infoBody.textContent = 'TIC-TAC-TOE:\n- PLAYER IS X, COMPUTER IS O.\n- MAKE THREE IN A LINE TO WIN.\n\nSQUARES:\n- DRAW ONE LINE BETWEEN ADJACENT DOTS.\n- COMPLETE A BOX TO CLAIM IT AND PLAY AGAIN.\n- MOST BOXES WINS WHEN THE GRID IS FULL.';
  } else {
    infoTitle.textContent = 'SYSTEM STATUS';
    infoBody.textContent = 'PROCESSOR: WOPR-CLASS MAINFRAME\nDISPLAY: MONOCHROME CRT ACTIVE\nDIRECTIVE: SELECT A GAME';
  }
}

menuButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.menuAction;

    if (action === 'ttt') {
      showPanel('game');
      initTicTacToe();
      return;
    }

    if (action === 'squares') {
      showPanel('game');
      initSquares();
      return;
    }

    setInfo(action);
    showPanel('info');
  });
});

returnBtn.addEventListener('click', () => {
  showPanel('menu');
  startBootSequence();
});

newGameBtn.addEventListener('click', () => {
  if (activeGame === 'ttt') {
    initTicTacToe();
  } else {
    initSquares();
  }
});

infoBackBtn.addEventListener('click', () => {
  showPanel('menu');
});

showPanel('menu');
startBootSequence();
