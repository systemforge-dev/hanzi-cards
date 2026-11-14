# Hanzi Cards

A flashcard web app for practising A1 (HSK 1) simplified Chinese characters.
Each card shows a character with its pinyin and meaning; the learner writes it
by hand in the box next to it, checks against an overlay, and grades themselves.

## How to run
- No install, no build. Open `index.html` in a browser.
- Local server: `node scripts/serve.js` (port 8000, or pass a port), then open http://localhost:8000.
  Double-click launchers: `start.command` (Mac/Linux), `start.bat` (Windows). Fallback: `python3 -m http.server 8000`.
- Check the character data: `node scripts/check-data.js`

## Project structure
- `index.html` – page layout. Loads the three scripts in order: data → pad → app.
- `css/style.css` – all styling. Colors and sizes are CSS variables in `:root`.
- `js/characters.js` – the `CHARACTERS` array. **All learning content lives here.**
- `js/drawing-pad.js` – `DrawingPad` class: canvas handwriting (strokes, undo, clear).
- `js/app.js` – card queue, modes (copy/recall), grading, keyboard shortcuts, progress in localStorage.
- `scripts/serve.js` – zero-dependency Node static server for localhost.
- `start.command` / `start.bat` – double-click launchers that start the server and open the browser.
- `scripts/check-data.js` – validates `characters.js` (fields present, no duplicates, tone marks).
- `.claude/skills/` – project skills for Claude Code (e.g. `/add-characters`).

## Rules
- Plain HTML, CSS and JavaScript only. No frameworks, no npm packages, no build step.
  The app must keep working when `index.html` is double-clicked (so: classic `<script>` tags, no ES module imports).
- Simplified characters only. Pinyin always uses tone marks (nǐ hǎo), never numbers (ni3 hao3).
- Each entry in `CHARACTERS` is `{ char, pinyin, meaning, category }`. Keep meanings short (under ~30 chars).
  When a character mostly appears in a word, show the word in brackets: `"friend (朋友)"`.
- Group entries by category in the file. A new category automatically becomes a new deck.
- Keep the design calm and minimal: paper background, ink text, one red accent, jade for success.
- After changing data, run `node scripts/check-data.js` and make sure it passes.
- Commit messages: short imperative sentence, e.g. "Add Weather deck".
