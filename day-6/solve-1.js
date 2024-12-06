import fs from "fs";
import GuardPatrol from "./GuardPatrol.js";
import clipboard from "clipboardy";

const map = fs.readFileSync("./input.txt", "utf-8")
                .replaceAll("\r", "")
                .split("\n")
                .map((line) => line.split(""));

const patrol = new GuardPatrol(map);

while (patrol.guardPresent) {
    patrol.moveGuard();
}

console.log("The guard has finished patrolling the map.");
console.log(`The guard made ${patrol.moves.toLocaleString()} moves and visited ${patrol.getDistinctVisitedLocations().toLocaleString()} distinct locations.`);
clipboard.writeSync(patrol.getDistinctVisitedLocations().toString());