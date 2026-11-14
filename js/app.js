// App logic: picks cards, shows them, handles buttons and keys,
// and remembers your progress in the browser (localStorage).

(function () {
  const STORAGE_KEY = "hanzi-cards-progress";
  const MODE_KEY = "hanzi-cards-mode";
  const AGAIN_GAP = 3; // a card you missed comes back after this many cards

  const $ = (id) => document.getElementById(id);
  const pad = new DrawingPad($("canvas"));

  const state = {
    deck: "all",
    mode: safeGet(MODE_KEY) || "copy", // "copy" or "recall"
    queue: [],
    total: 0,
    learned: 0,
    misses: 0,
    revealed: false,
    hint: false,
  };

  let progress = loadProgress(); // { "你": { seen: 3, known: 2 }, ... }

  // ---------- Storage helpers ----------
  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  }
  function loadProgress() {
    try { return JSON.parse(safeGet(STORAGE_KEY)) || {}; } catch { return {}; }
  }
  function saveProgress() {
    safeSet(STORAGE_KEY, JSON.stringify(progress));
  }

  // ---------- Decks ----------
  function buildDeckSelect() {
    const select = $("deck");
    const categories = [...new Set(CHARACTERS.map((c) => c.category))];
    const option = (value, label) => `<option value="${value}">${label}</option>`;
    select.innerHTML =
      option("all", `All characters (${CHARACTERS.length})`) +
      categories
        .map((cat) => option(cat, `${cat} (${CHARACTERS.filter((c) => c.category === cat).length})`))
        .join("");
    select.addEventListener("change", () => {
      state.deck = select.value;
      startDeck();
    });
  }

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function startDeck() {
    const cards = state.deck === "all" ? CHARACTERS : CHARACTERS.filter((c) => c.category === state.deck);
    state.queue = shuffle([...cards]);
    state.total = cards.length;
    state.learned = 0;
    state.misses = 0;
    $("practice").hidden = false;
    $("done").hidden = true;
    render();
  }

  // ---------- Showing a card ----------
  function render() {
    const card = state.queue[0];
    state.revealed = false;
    state.hint = false;
    pad.clear();

    $("cardChar").textContent = card.char;
    $("ghost").textContent = card.char;
    $("cardPinyin").textContent = card.pinyin;
    $("cardTag").textContent = card.category;

    const cardEl = $("card");
    cardEl.classList.remove("enter");
    void cardEl.offsetWidth; // restart the animation
    cardEl.classList.add("enter");

    updateView();
  }

  function updateView() {
    const card = state.queue[0];
    const hidden = state.mode === "recall" && !state.revealed;
    $("card").classList.toggle("hide-char", hidden);
    // In recall mode, don't give the answer away inside the meaning, e.g. "time (时＿)".
    if (card) $("cardMeaning").textContent = hidden ? card.meaning.split(card.char).join("＿") : card.meaning;
    $("ghost").className = "ghost" + (state.revealed ? " compare" : state.hint ? " hint" : "");
    $("hintBtn").classList.toggle("on", state.hint);
    $("revealBtn").hidden = state.revealed;
    $("gradeBtns").hidden = !state.revealed;

    document.querySelectorAll(".segmented button").forEach((b) =>
      b.classList.toggle("active", b.dataset.mode === state.mode)
    );

    const pct = state.total ? (state.learned / state.total) * 100 : 0;
    $("progressBar").style.width = pct + "%";
    const known = Object.values(progress).filter((p) => p.known > 0).length;
    $("progressLabel").textContent =
      `${state.learned} / ${state.total} in this round · ${known} of ${CHARACTERS.length} characters written correctly at least once`;
  }

  // ---------- Actions ----------
  function reveal() {
    if (state.revealed || $("practice").hidden) return;
    state.revealed = true;
    updateView();
  }

  function toggleHint() {
    if (state.revealed) return;
    state.hint = !state.hint;
    updateView();
  }

  function grade(gotIt) {
    if (!state.revealed) return;
    const card = state.queue.shift();
    const p = progress[card.char] || { seen: 0, known: 0 };
    p.seen++;
    if (gotIt) {
      p.known++;
      state.learned++;
    } else {
      state.misses++;
      state.queue.splice(Math.min(AGAIN_GAP, state.queue.length), 0, card);
    }
    progress[card.char] = p;
    saveProgress();

    if (state.queue.length === 0) finish();
    else render();
  }

  function finish() {
    updateView();
    $("practice").hidden = true;
    $("done").hidden = false;
    $("doneStats").textContent =
      `You wrote ${state.total} characters` +
      (state.misses ? ` · ${state.misses} needed another try.` : " · all on the first try! 🎉");
  }

  function setMode(mode) {
    state.mode = mode;
    safeSet(MODE_KEY, mode);
    updateView();
  }

  // ---------- Wiring up buttons and keys ----------
  $("revealBtn").addEventListener("click", reveal);
  $("againBtn").addEventListener("click", () => grade(false));
  $("goodBtn").addEventListener("click", () => grade(true));
  $("undoBtn").addEventListener("click", () => pad.undo());
  $("clearBtn").addEventListener("click", () => pad.clear());
  $("hintBtn").addEventListener("click", toggleHint);
  $("restartBtn").addEventListener("click", startDeck);
  document.querySelectorAll(".segmented button").forEach((b) =>
    b.addEventListener("click", () => setMode(b.dataset.mode))
  );

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "SELECT") return;
    const key = e.key.toLowerCase();
    if (key === " " || key === "enter") { e.preventDefault(); state.revealed ? grade(true) : reveal(); }
    else if (key === "1") grade(false);
    else if (key === "2") grade(true);
    else if (key === "z") pad.undo();
    else if (key === "c") pad.clear();
    else if (key === "h") toggleHint();
  });

  buildDeckSelect();
  startDeck();
})();
