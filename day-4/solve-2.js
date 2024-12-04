import clipboard from "clipboardy";
import XMasSearch from "./XMasSearch.js";
import fs from 'fs';

const gridAsString = fs.readFileSync('input.txt', 'utf8');

const grid = gridAsString.split("\n").map(row => row.split(""));

const xmasSearch = new XMasSearch(grid);

const count = xmasSearch.countXMASOccurrences();

console.log("Count: ", count.toLocaleString());
clipboard.writeSync(count.toString());