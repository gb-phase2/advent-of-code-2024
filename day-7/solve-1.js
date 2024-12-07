import clipboard from 'clipboardy';
import fs from 'fs';

const inputFile = fs.readFileSync('input.txt', 'utf-8').split('\n');

/**
 * @typedef {Object} CalibrationEquation
 * @property {number} testValue
 * @property {Array<number>} values
 * @property {Array<Array<string>>} solutions
 * @property {Boolean} isSolvable
*/

const operators = ['+', '*'];

/**
 * Parse the input into an array of CalibrationEquations
 * @param {Array<string>} input
 * @returns {Array<CalibrationEquation>}
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
 * Find all possible solutions for the given equation
 * @param {CalibrationEquation} equation
 * @returns {Array<Array<string>>} solutions
 */
const findSolutions = (equation) => {
    const { testValue, values } = equation;
    const solutions = [];

    // Special case: If there's only one value and it matches the test value
    if (values.length === 1) {
        if (values[0] === testValue) {
            solutions.push([]);
        }
        return solutions;
    }

    const recurse = (index, currentOps) => {
        // If we've assigned an operator between every pair of numbers:
        if (index === values.length - 1) {
            // Evaluate the expression from left to right
            let result = values[0];
            for (let i = 0; i < currentOps.length; i++) {
                const op = currentOps[i];
                const val = values[i + 1];

                switch (op) {
                    case '+':
                        result = result + val;
                        break;
                    case '*':
                        result = result * val;
                        break;
                }
            }

            // Check if the evaluated result matches the test value
            if (result === testValue) {
                // Record this successful operator arrangement
                solutions.push(currentOps);
            }
            return;
        }

        // Otherwise, try placing each operator and recurse further
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