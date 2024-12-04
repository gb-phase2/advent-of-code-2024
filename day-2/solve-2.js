import clipboard from "clipboardy";
import { reports } from "./data.js";

/**
 * Check if a report is safe.
 * - The levels are either all increasing or all decreasing
 * - Any two adjacent levels differ by at least one and at most three.
 * @param {Array} report
 * @returns {boolean}
 */
const isSafe = (report) => {
    let increasing = true;
    let decreasing = true;

    for (let i = 1; i < report.length; i++) {
        const current = report[i];
        const previous = report[i - 1];
        const difference = Math.abs(current - previous);
        
        if (difference < 1 || difference > 3) {
            return false;
        }

        if (current < previous) {
            increasing = false;
        }

        if (current > previous) {
            decreasing = false;
        }
    }

    return increasing || decreasing;
};

const safeReports = reports.filter(report => {
    if (isSafe(report)) {
        return true;
    }

    for (let i = 0; i < report.length; i++) {
        const copy = report.slice();
        copy.splice(i, 1);

        if (isSafe(copy)) {
            return true;
        }
    }

    return false;
});

console.log("Safe reports: ", safeReports.length.toLocaleString());
clipboard.writeSync(safeReports.length.toString());