// Midnight Fridge Roast — make.fun entry
// One line roasting a smart fridge that refuses to open after midnight.
// The line is built from three beats: the setup (midnight, the fridge),
// the act (it cards me at the door), and the turn (the leftovers are
// underage). The fridge's petty rule IS the joke, not garnish.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SETUP = "It's past midnight and the fridge just carded me at the door";
const ACT = "and decided my leftovers are underage.";
const LINE = `${SETUP} ${ACT}`;

// Gate check, mirroring the bounty gate: 1-200 chars, one line,
// non-whitespace, terminal punctuation, and it must name the fridge,
// the midnight refusal, and the petty rule that does the refusing.
function gate(line: string): string[] {
  const problems: string[] = [];
  if (line.length < 1 || line.length > 200) problems.push("length");
  if (line.trim().length === 0) problems.push("blank");
  if (line.includes("\n")) problems.push("multiline");
  if (!/[.!?]$/.test(line)) problems.push("no terminal punctuation");
  if (!/fridge/i.test(line)) problems.push("no fridge");
  if (!/midnight/i.test(line)) problems.push("no midnight");
  if (!/carded|locked|refus|denied|won't open|will not open/i.test(line))
    problems.push("no refusal");
  return problems;
}

const problems = gate(LINE);
if (problems.length > 0) {
  throw new Error(`gate failed: ${problems.join(", ")}`);
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back byte check: the file must hold exactly the line, no
// trailing newline, no extra bytes — verified both as text and as
// raw bytes, so a stray newline cannot sneak past the text compare.
const back = readFileSync(outPath, "utf8");
const backBytes = readFileSync(outPath);
if (back !== LINE) throw new Error("read-back mismatch");
if (backBytes.length !== Buffer.byteLength(LINE, "utf8"))
  throw new Error("read-back byte length mismatch");
console.log(`wrote ${outPath}: ${LINE.length} chars, 1 line`);
console.log(LINE);
