import { left, right } from "./data.js";

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

const deltas = left.map((l, i) => Math.abs(l - right[i]));

const totalDistance = deltas.reduce((acc, curr) => acc + curr, 0);

console.log("Total distance: ", totalDistance.toLocaleString());