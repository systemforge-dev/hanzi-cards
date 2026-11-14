---
name: add-characters
description: Add new Chinese characters or a new deck (category) to the Hanzi Cards app. Use when the user asks to add characters, words, a topic, an HSK level, or a new deck.
---

# Add characters to Hanzi Cards

Follow these steps every time characters are added.

1. **Read the current data** in `js/characters.js` and note which characters and categories already exist.
2. **Pick the characters.** If the user gave a topic (e.g. "weather") rather than a list,
   choose simple, common characters that fit A1/HSK 1–2 level and tell the user which ones you chose.
   Skip any character that is already in the file and mention it.
3. **Write each entry** in this exact shape:
   `{ char: "雪", pinyin: "xuě", meaning: "snow", category: "Weather" },`
   - Simplified characters only.
   - Pinyin with tone marks, never tone numbers.
   - Meaning short and plain English; add the common word in brackets if helpful.
4. **Place the entries** under the matching `// Category` comment block.
   For a new category, add a new block with a `// Category` comment. It becomes a new deck automatically —
   no other file needs to change.
5. **Validate:** run `node scripts/check-data.js`. Fix anything it reports and run it again until it passes.
6. **Report back** with a small table of what was added (character, pinyin, meaning, deck)
   and remind the user to refresh the page to see the new cards.
