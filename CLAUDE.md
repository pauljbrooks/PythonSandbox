# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WOPR Game Terminal — a browser-based retro terminal game collection styled after the computer in *WarGames*. Plain HTML/CSS/JS with no build tooling, no dependencies, no package manager.

## Running Locally

```bash
python3 -m http.server 4173
# Open http://127.0.0.1:4173
```

There are no tests, no linter, and no build step.

## Architecture

All logic lives in three files with no module system:

- **`index.html`** — declares three `<section>` panels: `#menu`, `#game`, `#info`. Only one panel carries the `.active` class at a time.
- **`styles.css`** — all visual styles including CRT effects. The glitch animation is driven by adding/removing `.is-glitching` on `.screen-shell` from JS; the CSS handles the rest via `@keyframes` and child selectors.
- **`app.js`** — all game logic, DOM wiring, and panel routing (no modules, no classes).

### Panel routing (`app.js`)

`showPanel(name)` removes `.active` from all panels and adds it to the named one. `showPanel('menu')` is always paired with `startBootSequence()` to replay the typing animation.

### Tic-Tac-Toe

State is a flat 9-element array (`tttBoard`). CPU uses a priority-ordered heuristic: win → block → center → corners → edges. No minimax. CPU move is delayed 440 ms via `setTimeout` to simulate "thinking".

### Squares (Dots-and-Boxes)

10×10 dot grid (`DOTS = 10`), producing a 9×9 box grid (81 boxes). Edges are stored as string keys in a `Set`:
- Horizontal: `"h-{row}-{col}"` where row ∈ [0, DOTS-1], col ∈ [0, DOTS-2]
- Vertical: `"v-{row}-{col}"` where row ∈ [0, DOTS-2], col ∈ [0, DOTS-1]

`adjacentBoxesForEdge(edge)` returns which boxes an edge borders. `sidesOfBox(row, col, extraEdge)` counts claimed sides including a hypothetical extra edge (used by the CPU to evaluate moves without mutating state). CPU strategy: take completing edges → avoid giving away 3-sided boxes → random fallback. CPU chains turns recursively via `runSquaresCpuTurn()` when it claims a box (which grants an extra move).

The DOM grid is `(2*DOTS - 1) × (2*DOTS - 1)` = 19×19 cells: even/even = dot, even/odd = horizontal edge button, odd/even = vertical edge button, odd/odd = box div.

### CRT glitch effect

`startTrackingGlitches()` runs a self-scheduling `setTimeout` loop with random intervals (5–20 s gap, 300–1500 ms glitch duration). Adding `.is-glitching` to `.screen-shell` activates a suite of CSS animations on `.tracking-glitch`, `.tracking-glitch::before`, `.tracking-glitch::after`, and `.terminal`.

## Other Files

`Bin Collections/BinCollections.py` — currently empty; a scratch area unrelated to the game.
