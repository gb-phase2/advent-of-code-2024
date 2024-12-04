import { left, right } from "./data.js";

const convertToCountDict = (arr) => {
    return arr.reduce((acc, curr) => {
        acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
        return acc;
    }, {});
};

const rightCounts = convertToCountDict(right);

const similarityScore = left.reduce((acc, curr) => {
    return acc + (curr * rightCounts[curr] || 0);
}, 0);

console.log("Similarity score: ", similarityScore.toLocaleString());