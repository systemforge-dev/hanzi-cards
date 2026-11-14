#!/bin/sh
# Mac / Linux: double-click this file (or run ./start.command) to start the app.
cd "$(dirname "$0")"
PORT=8000
URL="http://localhost:$PORT"

# Open the browser a moment after the server starts.
( sleep 1; (command -v open >/dev/null && open "$URL") || (command -v xdg-open >/dev/null && xdg-open "$URL") ) &

if command -v node >/dev/null 2>&1; then
  node scripts/serve.js $PORT
elif command -v python3 >/dev/null 2>&1; then
  echo "Hanzi Cards is running at $URL  (Ctrl+C to stop)"
  python3 -m http.server $PORT --bind 127.0.0.1
else
  echo "Please install Node.js (https://nodejs.org) or Python 3 first."
  read -r _
fi
