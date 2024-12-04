class XMasSearch {
    constructor(grid) {
        this.grid = grid.map(row => row.map(char => char.toUpperCase())); // Normalize to uppercase
        this.rows = grid.length;
        this.cols = grid[0].length;
    }

    isValidIndex = (row, col) => row >= 0 && row < this.rows && col >= 0 && col < this.cols;

    // Offsets for the "corners" in the X pattern
    offsets = [
        [-1, -1], // Top-left of X
        [-1, 1],  // Top-right of X
        [1, -1],  // Bottom-left of X
        [1, 1],   // Bottom-right of X
    ];

    patterns = [
        [this.offsets[0], this.offsets[3]], // Top left to bottom right
        [this.offsets[1], this.offsets[2]], // Top right to bottom left
        [this.offsets[2], this.offsets[1]], // Bottom left to top right
        [this.offsets[3], this.offsets[0]], // Bottom right to top left
    ]

    findXMAS = (centerRow, centerCol) => {
        let validPatterns = 0;

        for (let pattern of this.patterns) {
            let [offset1, offset2] = pattern;
            let [row1, col1] = [centerRow + offset1[0], centerCol + offset1[1]];
            let [row2, col2] = [centerRow + offset2[0], centerCol + offset2[1]];

            if (this.isValidIndex(row1, col1) && this.isValidIndex(row2, col2)) {
                if (this.grid[row1][col1] === 'M' && this.grid[row2][col2] === 'S') {
                    validPatterns++;
                    if (validPatterns === 2) {
                        return true;
                    }
                }
            }
        }
    };

    countXMASOccurrences = () => {
        let count = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // If the current cell is the center of the X pattern (A), check for XMAS
                if (this.grid[row][col] === 'A') {
                    if (this.findXMAS(row, col)) {
                        count++;
                    }
                }
            }
        }

        return count;
    }
}

export default XMasSearch;
