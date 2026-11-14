# 汉 Hanzi Cards

Practise writing A1 (HSK 1) simplified Chinese characters by hand.

- **Copy mode** – see the character, write it in the grid box.
- **Recall mode** – see only pinyin + meaning, write it from memory.
- Press **Check** to overlay the real character on your writing, then grade yourself.
  Cards you miss come back a few cards later.

## Run it on localhost
Pick whichever is easiest:

| How | What to do |
| --- | --- |
| **Mac / Linux** | Double-click `start.command` (or run `./start.command`) |
| **Windows** | Double-click `start.bat` |
| **Terminal** | `node scripts/serve.js` — or without Node: `python3 -m http.server 8000` |

Then open **http://localhost:8000** (the start files open it for you). Stop the server with **Ctrl+C**.
Port 8000 busy? Use another one: `node scripts/serve.js 3000`.

Quickest of all: just double-click `index.html` — it also works without a server.

## Keyboard
| Key | Action |
| --- | --- |
| Space / Enter | Check, then "Got it" |
| 1 / 2 | Again / Got it |
| H | Toggle tracing hint |
| Z / C | Undo stroke / Clear box |

## Add characters
Edit `js/characters.js`, or in Claude Code run `/add-characters weather words`.
Then run `node scripts/check-data.js`.
