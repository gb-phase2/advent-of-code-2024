import clipboard from "clipboardy";
import WordSearch from "./wordSearch.js";
import fs from 'fs';

const gridAsString = fs.readFileSync('input.txt', 'utf8');

const grid = gridAsString.split("\n").map(row => row.split(""));

const wordToFind = "XMAS";

const wordSearch = new WordSearch(grid, wordToFind);

const count = wordSearch.countWordOccurrences();

console.log("Count of ", wordToFind, ": ", count.toLocaleString());
clipboard.writeSync(count.toString());