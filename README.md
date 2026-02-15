# WOPR Tic-Tac-Toe

A browser-based tic-tac-toe game inspired by the computer terminal style in *WarGames*.

## Features

- Monochrome black-and-white terminal presentation.
- CRT-inspired visual treatment with scanlines, glow, and flicker.
- Opening menu flow with themed prompts.
- Human (`X`) vs computer (`O`) gameplay.
- Simple computer strategy: win first, block second, then prioritize center/corners.

## Files

- `index.html` — terminal layout, menu, game, and info panels.
- `styles.css` — visual styling and CRT effect.
- `app.js` — menu behavior and tic-tac-toe game logic.

## Run locally

From the project directory:

```bash
python3 -m http.server 4173
```

Then open:

- <http://127.0.0.1:4173>

## Controls

- **Main Menu**
  - **1. TIC-TAC-TOE** starts a game.
  - **2. VIEW RULES** opens the rules panel.
  - **3. SYSTEM STATUS** opens the status panel.
- **Game Panel**
  - Click any open cell to place `X`.
  - **NEW SIMULATION** resets the board.
  - **RETURN TO MENU** exits back to main menu.

## Notes

This project uses only plain HTML, CSS, and JavaScript (no build step required).
