// Checks js/characters.js for common mistakes.
// Run with: node scripts/check-data.js

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const file = path.join(__dirname, "..", "js", "characters.js");
const sandbox = {};
vm.runInNewContext(fs.readFileSync(file, "utf8") + "\nthis.CHARACTERS = CHARACTERS;", sandbox);
const list = sandbox.CHARACTERS;

const problems = [];
const seen = new Set();
const hanzi = /^[一-鿿]$/;
const toneNumber = /[1-5]/;

list.forEach((c, i) => {
  const where = `entry ${i + 1} (${c.char || "?"})`;
  for (const field of ["char", "pinyin", "meaning", "category"]) {
    if (!c[field] || typeof c[field] !== "string") problems.push(`${where}: missing "${field}"`);
  }
  if (c.char && !hanzi.test(c.char)) problems.push(`${where}: "char" must be exactly one Chinese character`);
  if (c.pinyin && toneNumber.test(c.pinyin)) problems.push(`${where}: use tone marks, not numbers, in pinyin`);
  if (seen.has(c.char)) problems.push(`${where}: duplicate character`);
  seen.add(c.char);
});

const decks = [...new Set(list.map((c) => c.category))];
if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`✓ ${list.length} characters in ${decks.length} decks: ${decks.join(", ")}`);
