import clipboard from 'clipboardy';
import fs from 'fs';

const inputFile = fs.readFileSync('input.txt', 'utf-8').split('\n');

/**
 * @typedef {Object} CalibrationEquation
 * @property {number} testValue
 * @property {number[]} values
 * @property {string[][]} solutions
 * @property {Boolean} isSolvable
*/

const operators = ['+', '*', '||'];

/**
 * Parse the input into an array of CalibrationEquations
 * @param {string[]} input
 * @returns {CalibrationEquation[]}
*/
const parseInput = (input) => {
    return input.map((line) => {
        const sides = line.split(": ");
        return { 
            testValue: parseInt(sides[0]),
            values: sides[1].split(" ").map(val => parseInt(val)),
            solutions: [],
            isSolvable: false
        };
    });
};

/**
 * Evaluate the expression given values and operators strictly left-to-right
 * @param {number[]} values
 * @param {string[]} ops
 * @returns {number} result of the evaluated expression
 */
const evaluateExpression = (values, ops) => {
    let result = values[0];
    
    for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        const nextVal = values[i + 1];
        if (op === '+') {
            result = result + nextVal;
        } else if (op === '*') {
            result = result * nextVal;
        } else if (op === '||') {
            result = Number(String(result) + String(nextVal));
        }
    }

    return result;
};

/**
 * Find all possible solutions for the given equation
 * @param {CalibrationEquation} equation
 * @returns {string[][]} solutions
 */
const findSolutions = (equation) => {
    const { testValue, values } = equation;
    const solutions = [];

    const recurse = (index, currentOps) => {
        if (index === values.length - 1) {
            const result = evaluateExpression(values, currentOps);
            if (result === testValue) {
                solutions.push(currentOps);
            }
            
            return;
        }

        for (const op of operators) {
            recurse(index + 1, [...currentOps, op]);
        }
    };

    recurse(0, []);

    return solutions;
};

const tests = parseInput(inputFile);
tests.forEach((test) => {
    test.solutions = findSolutions(test);
    test.isSolvable = test.solutions.length > 0;
});

const solvableTests = tests.filter(test => test.isSolvable);
const sumOfSolvableTests = solvableTests.reduce((acc, test) => acc + test.testValue, 0);

console.log("Sum of solvable tests:", sumOfSolvableTests.toLocaleString());
clipboard.writeSync(sumOfSolvableTests.toString());