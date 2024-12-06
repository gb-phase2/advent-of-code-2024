import fs from "fs";
import GuardPatrol from "./GuardPatrol.js";
import clipboard from "clipboardy";

const originalMap = fs.readFileSync("./input.txt", "utf-8")
                .replaceAll("\r", "")
                .split("\n")
                .map((line) => line.split(""));

const findEmptyPositions = (map, guardStart) => {
    const emptyPositions = [];
    
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "." && !(x === guardStart.x && y === guardStart.y)) {
                emptyPositions.push({ x, y });
            }
        }
    }

    return emptyPositions;
};

const causesLoop = (testMap) => {
    const patrol = new GuardPatrol(testMap);
    const seenStates = new Set();

    while (patrol.guardPresent) {
        const state = `${patrol.guardPosition.x},${patrol.guardPosition.y},${patrol.getDirectionIndex()}`;
        if (seenStates.has(state)) {
            // We've encountered a previously seen state - this indicates a loop
            return true;
        }
        seenStates.add(state);
        patrol.moveGuard();
    }

    // If the guard leaves the map or stops without looping, no loop is formed
    return false;
};

const findLoopPositions = (map) => {
    const guardStart = new GuardPatrol(map).guardPosition;
    const candidates = findEmptyPositions(map, guardStart);
    const loopPositions = [];

    for (const pos of candidates) {
        // Create a deep copy of the map so we don't mutate the original
        const testMap = map.map((row) => [...row]);
        testMap[pos.y][pos.x] = "#";

        if (causesLoop(testMap)) {
            loopPositions.push(pos);
        }
    }

    return loopPositions;
};

const loopPositions = findLoopPositions(originalMap);

console.log(`Number of positions that cause the guard to loop: ${loopPositions.length.toLocaleString()}`);
clipboard.writeSync(loopPositions.length.toString());