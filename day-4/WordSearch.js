class WordSearch {
    constructor(grid, wordToFind) {
        this.grid = grid;
        this.wordToFind = wordToFind;
        this.wordLength = wordToFind.length;
        this.rows = grid.length;
        this.cols = grid[0].length;
    }

    // Directions: [rowChange, colChange]
    directions = [
        [0, 1],   // Right
        [0, -1],  // Left
        [1, 0],   // Down
        [-1, 0],  // Up
        [1, 1],   // Down-Right
        [1, -1],  // Down-Left
        [-1, 1],  // Up-Right
        [-1, -1]  // Up-Left
    ];

    isValidIndex = (row, col) => row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    
    findWord = (row, col, dir) => {
        for (let i = 0; i < this.wordLength; i++) {
            const newRow = row + dir[0] * i;
            const newCol = col + dir[1] * i;

            if (!this.isValidIndex(newRow, newCol) || this.grid[newRow][newCol] !== this.wordToFind[i]) {
                return false;
            }
        }

        return true;
    }

    countWordOccurrences = () => {
        let count = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col] === this.wordToFind[0]) {
                    for (let dir of this.directions) {
                        if (this.findWord(row, col, dir)) {
                            count++;
                        }
                    }
                }
            }
        }

        return count;
    }
}

export default WordSearch;