const fs = require("fs");
const { sync } = require("glob");

const files = sync("src/locales/**/*.po");
let hasError = false;

for (const file of files) {
  // Read content and split by double newlines to look at each translation block
  const blocks = fs.readFileSync(file, "utf8").split("\n\n");

  // Skip the first block (index 0) because it's the Metadata/Header block
  const translationBlocks = blocks.slice(1);

  for (const block of translationBlocks) {
    // Ignore "obsolete" blocks (lines starting with #~)
    if (block.trim().startsWith("#~")) {
      continue;
    }

    // Check if the block contains an empty msgstr ""
    // We look for msgstr "" at the end of the block or followed by a newline
    if (block.match(/^msgstr ""$/m)) {
      console.error(`\x1b[31m❌ Missing translation in: ${file}\x1b[0m`);
      console.error(`\x1b[33m${block}\x1b[0m\n`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log("\x1b[32m✅ Translations validated.\x1b[0m");
