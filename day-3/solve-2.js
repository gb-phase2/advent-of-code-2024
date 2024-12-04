import clipboard from 'clipboardy';
import fs from 'fs';

const corruptedMemory = fs.readFileSync('input.txt', 'utf8');

/**
 * @typedef {object} Instruction
 * @property {string} type
 * @property {Array<number>} values
 */

/**
 * 
 * @param {string} corruptedMemory 
 * @returns {Array<Instruction>} An array of instructions that are not corrupted
 */
const getUncorruptedInstructions = (corruptedMemory) => {
    // Make sure 'don't' is listed before 'do' so that it matches first
    const instructions = corruptedMemory.match(/(?:do\(\)|don't\(\)|mul\(\d+,\d+\))/g);

    return instructions ? instructions.map(instruction => {
        const matches = instruction.match(/don't|do|mul|\d+/g);
        const type = matches[0];
        const values = matches.slice(1);

        return {
            type,
            values: type === 'mul' ? values.map(Number) : []
        };
    }) : [];
};

/**
 * Executes the instructions and returns the sum of the results
 * @param {Array<Instruction>} instructions
 * @returns {number} The sum of the results of the mul instructions
*/
const executeMulInstructions = (instructions) => {
    let enabled = true;
    return instructions.reduce((acc, { type, values }) => {
        if (type === 'do') {
            enabled = true;
            return acc;
        }

        if (type === 'don\'t') {
            enabled = false;
            return acc;
        }

        if (type === 'mul' && enabled) {
            return acc + values.reduce((mul, value) => mul * value, 1);
        }

        return acc;
    }, 0);
};

const uncorruptedMulInstructions = getUncorruptedInstructions(corruptedMemory);
const result = executeMulInstructions(uncorruptedMulInstructions);

console.log("Sum: ", result.toLocaleString());
clipboard.writeSync(result.toString());