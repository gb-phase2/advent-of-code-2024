import clipboard from "clipboardy";
import {
  input,
  parseGrid,
  isWithinBounds,
  findAntennasByFrequency,
} from "./solve-1.js";

/**
 * Compute the greatest common divisor (Euclidean algorithm).
 * @param {number} a - An integer.
 * @param {number} b - Another integer.
 * @returns {number} The greatest common divisor of a and b.
 */
const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }

  return a;
};

/**
 * Generate all integer points on a line through (Ax,Ay) in direction (vx,vy) within the grid.
 * @param {number} Ax - Row coordinate of a point on the line.
 * @param {number} Ay - Column coordinate of a point on the line.
 * @param {number} vx - Step in the row direction (normalized).
 * @param {number} vy - Step in the column direction (normalized).
 * @param {number} rows - Total number of rows.
 * @param {number} cols - Total number of columns.
 * @returns {string[]} An array of "row,col" strings representing all points on this line within the grid.
 */
const generateLinePoints = (Ax, Ay, vx, vy, rows, cols) => {
  const points = [];

  // Start at (Ax,Ay)
  // Move forward (t positive)
  let tx = Ax;
  let ty = Ay;
  while (isWithinBounds(tx, ty, rows, cols)) {
    points.push(`${tx},${ty}`);
    tx += vx;
    ty += vy;
  }

  // Move backward (t negative)
  // We skip t=0 again, so start from -1 step
  tx = Ax - vx;
  ty = Ay - vy;
  while (isWithinBounds(tx, ty, rows, cols)) {
    points.push(`${tx},${ty}`);
    tx -= vx;
    ty -= vy;
  }

  return points;
};

/**
 * Calculates all unique antinodes generated by antennas of the same frequency under the new model:
 * Every grid position that lies on a line defined by at least two antennas of the same frequency is an antinode.
 * @param {Object.<string, number[][]>} antennasByFreq - Object mapping frequencies to arrays of antenna coordinates.
 * @param {number} rows - Total number of rows in the grid.
 * @param {number} cols - Total number of columns in the grid.
 * @returns {Set<string>} A set of unique antinode positions in the form "row,col".
 */
const calculateAntinodes = (antennasByFreq, rows, cols) => {
  const antinodes = new Set();

  for (const freq in antennasByFreq) {
    const antennas = antennasByFreq[freq];
    if (antennas.length < 2) {
      // Only one antenna of this frequency, so no line-based antinodes
      continue;
    }

    // All these antennas are antinodes themselves, since they form lines with others
    for (const [Ax, Ay] of antennas) {
      antinodes.add(`${Ax},${Ay}`);
    }

    // Find lines formed by pairs of antennas
    for (let i = 0; i < antennas.length; i++) {
      for (let j = i + 1; j < antennas.length; j++) {
        const [Ax, Ay] = antennas[i];
        const [Bx, By] = antennas[j];

        const dx = Bx - Ax;
        const dy = By - Ay;
        const g = gcd(dx, dy);

        const vx = dx / g;
        const vy = dy / g;

        // Generate all points on this line
        const linePoints = generateLinePoints(Ax, Ay, vx, vy, rows, cols);
        for (const p of linePoints) {
          antinodes.add(p);
        }
      }
    }
  }

  return antinodes;
};

/**
 * Given the puzzle input, calculates how many unique locations within the map contain an antinode
 * according to the updated rules.
 * @param {string[]} inputLines - The puzzle input lines.
 * @returns {number} The number of unique antinode locations.
 */
const calculateUniqueLocations = (inputLines) => {
  const grid = parseGrid(inputLines);
  const rows = grid.length;
  const cols = grid[0].length;

  const antennasByFreq = findAntennasByFrequency(grid);
  const antinodes = calculateAntinodes(antennasByFreq, rows, cols);

  return antinodes.size;
};

const uniqueLocationsCount = calculateUniqueLocations(input);

console.log(uniqueLocationsCount.toLocaleString());
clipboard.writeSync(uniqueLocationsCount.toString());
