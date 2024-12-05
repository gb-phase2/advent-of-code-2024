import clipboard from "clipboardy";
import fs from "fs";

const rulesInput = fs.readFileSync("input-1.csv", "utf8");
const pagesInput = fs.readFileSync("input-2.csv", "utf8");

const rules = rulesInput.split("\n").map((line) => {
  const [x, y] = line.split("|").map(Number);
  return [x, y];
});

const updates = pagesInput.split("\n").map((line) => line.split(",").map(Number));

// Function to check if an update is in the correct order
const isUpdateCorrect = (pages, rules) => {
  // For each rule, if both pages appear in the update, ensure correct order
  for (const [x, y] of rules) {
    if (pages.includes(x) && pages.includes(y)) {
      const xIndex = pages.indexOf(x);
      const yIndex = pages.indexOf(y);
      if (xIndex > yIndex) {
        // Rule violated: x should come before y, but it's not
        return false;
      }
    }
  }
  return true;
};

let sumOfMiddles = 0;
for (const pages of updates) {
  if (isUpdateCorrect(pages, rules)) {
    // Update is in correct order
    const middleIndex = Math.floor(pages.length / 2);
    sumOfMiddles += pages[middleIndex];
  }
}

console.log("Sum:", sumOfMiddles.toLocaleString());
clipboard.writeSync(sumOfMiddles.toString());
