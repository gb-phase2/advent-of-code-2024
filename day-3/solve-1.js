import fs from 'fs';

const corruptedMemory = fs.readFileSync('input.txt', 'utf8');

/**
 * 
 * @param {string} corruptedMemory 
 * @returns {number[][]} An array of mul instructions that are not corrupted
 */
const getUncorruptedMulInstructions = (corruptedMemory) => {
    const instructions = corruptedMemory.match(/mul\(\d+,\d+\)/g);
    return instructions ? instructions.map(instruction => instruction.match(/\d+/g).map(Number)) : [];
};

/**
 * Executes the mul instructions and returns the sum of the results
 * @param {number[][]} instructions
 * @returns {number} The sum of the results of the mul instructions
*/
const executeMulInstructions = (instructions) => {
    return instructions.reduce((acc, [x, y]) => acc + (x * y), 0);
};

const uncorruptedMulInstructions = getUncorruptedMulInstructions(corruptedMemory);
const result = executeMulInstructions(uncorruptedMulInstructions);

console.log("Sum: ", result.toLocaleString());
clipboard.writeSync(result.toString());