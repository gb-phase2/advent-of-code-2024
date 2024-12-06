class GuardPatrol {
    constructor(map) {
        this.map = map;
        this.width = map[0].length;
        this.height = map.length;
        this.visitedLocations = new Set();
        this.guardPresent = true;
        this.guardPosition = this.findGuardPosition();
        this.addVisitedLocation(this.guardPosition.x, this.guardPosition.y);
        this.obstacles = this.findObstacles();
        this.moves = 0;
    }

    emptySpace = ".";
    guardIcons = [
        "^", // Guard facing up
        ">", // Guard facing right
        "v", // Guard facing down
        "<"  // Guard facing left
    ];

    isObstacle = (x, y) => this.map[y][x] === "#";
    isGuard = (x, y) => this.guardIcons.includes(this.map[y][x]);
    isValidPosition = (x, y) => x >= 0 && x < this.width && y >= 0 && y < this.height;

    addVisitedLocation(x, y) {
        this.visitedLocations.add(`${x},${y}`);
    }

    getDistinctVisitedLocations = () => this.visitedLocations.size;

    findObstacles() {
        const obstacles = [];
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.isObstacle(x, y)) {
                    obstacles.push({ x, y });
                }
            }
        }

        return obstacles;
    }

    findGuardPosition() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.isGuard(x, y)) {
                    return { x, y };
                }
            }
        }

        throw new Error("Guard not found");
    }

    getForwardPosition() {
        const { x, y } = this.guardPosition;
        let forwardX = x;
        let forwardY = y;

        switch (this.map[y][x]) {
            case "^":
                forwardY--;
                break;
            case ">":
                forwardX++;
                break;
            case "v":
                forwardY++;
                break;
            case "<":
                forwardX--;
                break;
        }

        return { x: forwardX, y: forwardY };
    }

    isGuardFacingObstacle() {
        const { x, y } = this.getForwardPosition();
        if (!this.isValidPosition(x, y)) return false;
        return this.isObstacle(x, y);
    }

    turnRight() {
        const { x, y } = this.guardPosition;
        const currentDirection = this.guardIcons.indexOf(this.map[y][x]);
        const newDirection = (currentDirection + 1) % this.guardIcons.length;
        this.map[y][x] = this.guardIcons[newDirection];
    }

    moveForward() {
        const { x, y } = this.guardPosition;
        const { x: nextX, y: nextY } = this.getForwardPosition();
        
        // If the next position is valid, move the guard there, otherwise clear the map of the guard and mark as absent
        if (this.isValidPosition(nextX, nextY) && !this.isObstacle(nextX, nextY)) {
            this.map[nextY][nextX] = this.map[y][x];
            this.map[y][x] = this.emptySpace;
            this.guardPosition = { x: nextX, y: nextY };
            this.moves++;
            this.addVisitedLocation(nextX, nextY);
        } else {
            this.guardPresent = false;
            this.map[y][x] = this.emptySpace;
            this.guardPosition = null;
        }
    }

    getDirectionIndex() {
        if (!this.guardPosition) return -1;
        const { x, y } = this.guardPosition;
        return this.guardIcons.indexOf(this.map[y][x]);
    }

    // Guard Protocol:
    // - If there is an obstacle in front of the guard, turn right.
    // - Otherwise, move forward.
    moveGuard() {
        if (!this.guardPresent || !this.guardPosition) return;

        if (this.isGuardFacingObstacle()) {
            this.turnRight();
        } else {
            this.moveForward();
        }
    }
}

export default GuardPatrol;