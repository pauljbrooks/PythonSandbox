# WOPR Game Terminal

A browser-based retro terminal game collection inspired by the computer style in *WarGames*.

## Features

- Black-and-white monochrome UI with CRT scanlines, glow, and flicker.
- Opening boot-style message sequence with persistent lines and a blinking cursor.
- Dynamic viewport sizing to fit standard browser windows.
- Two playable games:
  - **Tic-Tac-Toe** (`X` vs computer `O`)
  - **Squares** (10x10 dots / Dots-and-Boxes style)

## Files

- `index.html` — menu, game panels, and info screen layout.
- `styles.css` — terminal visuals, responsive sizing, and game board styling.
- `app.js` — menu flow, tic-tac-toe logic, and squares game logic.

## Run locally

```bash
python3 -m http.server 4173
```

Open:

- <http://127.0.0.1:4173>

## Controls

- **Main Menu**
  - **1. TIC-TAC-TOE** starts tic-tac-toe.
  - **2. SQUARES** starts the 10x10 dots grid game.
  - **3. VIEW RULES** opens rules.
  - **4. SYSTEM STATUS** opens status info.
- **In Game**
  - **RETURN TO MENU** exits to menu.
  - **NEW ...** restarts the current game mode.

## Notes

Built with plain HTML, CSS, and JavaScript (no build step required).
