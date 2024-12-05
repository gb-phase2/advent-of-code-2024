import clipboard from "clipboardy";
import fs from "fs";

const rulesInput = fs.readFileSync("input-1.csv", "utf8");
const pagesInput = fs.readFileSync("input-2.csv", "utf8");

const rules = rulesInput.split("\n").map((line) => {
  const [x, y] = line.split("|").map(Number);
  return [x, y];
});

const updates = pagesInput
  .split("\n")
  .map((line) => line.split(",").map(Number));

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

// Perform a topological sort on the subset of pages
const topologicalSort = (pages, rules) => {
  // Build graph of dependencies based on pages and applicable rules
  const graph = new Map();
  const inDegree = new Map();

  // Initialize graph nodes
  for (const p of pages) {
    graph.set(p, []);
    inDegree.set(p, 0);
  }

  // Add edges for applicable rules
  for (const [x, y] of rules) {
    if (pages.includes(x) && pages.includes(y)) {
      graph.get(x).push(y);
      inDegree.set(y, inDegree.get(y) + 1);
    }
  }

  // Topological sort using Kahn's algorithm
  const queue = [];
  for (const [node, deg] of inDegree) {
    if (deg === 0) {
      queue.push(node);
    }
  }

  const sorted = [];
  while (queue.length > 0) {
    const node = queue.shift();
    sorted.push(node);
    for (const neighbor of graph.get(node)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return sorted;
};

const incorrectUpdates = [];
for (const pages of updates) {
  if (!isUpdateCorrect(pages, rules)) {
    incorrectUpdates.push(pages);
  }
}

let sumOfMiddles = 0;
for (const pages of incorrectUpdates) {
  const correctOrder = topologicalSort(pages, rules);
  const middleIndex = Math.floor(correctOrder.length / 2);
  sumOfMiddles += correctOrder[middleIndex];
}

console.log("Sum:", sumOfMiddles.toLocaleString());
clipboard.writeSync(sumOfMiddles.toString());
