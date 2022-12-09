import { readFileSync } from "fs";

function parseGrid(inputFile: string) {
    return inputFile.split("\n").map(row => row.split(""));
}

function isFloor(square: string) {
    return square === ".";
}
function isEmpty(square: string) {
    return square === "L";
}
function isOccupied(square: string) {
    return square === "#";
}

function applySeatingRound(grid: Array<Array<string>>) {
    const nextRoundGrid = [...Array(grid.length)].map(() => Array(grid[0].length).fill("."));

    for (let row = 0; row < grid.length; row += 1) {
        for (let column = 0; column < grid[row].length; column += 1) {
            const square = grid[row][column];
            if (isFloor(square)) { continue; }

            const adjacentSquares = getAdjacentSquares(row, column);
            if (isEmpty(square) && ! adjacentSquares.some(s => isOccupied(s))) {
                nextRoundGrid[row][column] = "#";
            } else if (isOccupied(square) && adjacentSquares.filter(s => isOccupied(s)).length >= 4) {
                nextRoundGrid[row][column] = "L";
            } else {
                nextRoundGrid[row][column] = square;
            }
        }
    }

    return nextRoundGrid;

    function getAdjacentSquares(row: number, column: number) {
        const adjacentSquares = [];

        if (column > 0) { adjacentSquares.push(grid[row][column - 1]); }
        if (column < grid[row].length - 1) { adjacentSquares.push(grid[row][column + 1]); }
        if (row > 0) {
            adjacentSquares.push(grid[row - 1][column]);
            if (column > 0) { adjacentSquares.push(grid[row - 1][column - 1]); }
            if (column < grid[row].length - 1) { adjacentSquares.push(grid[row - 1][column + 1]); }
        }
        if (row < grid.length - 1) {
            adjacentSquares.push(grid[row + 1][column]);
            if (column > 0) { adjacentSquares.push(grid[row + 1][column - 1]); }
            if (column < grid[row].length - 1) { adjacentSquares.push(grid[row + 1][column + 1]); }
        }

        return adjacentSquares;
    }
}

function applyPartTwoSeatingRound(grid: Array<Array<string>>) {
    const nextRoundGrid = [...Array(grid.length)].map(() => Array(grid[0].length).fill("."));

    for (let row = 0; row < grid.length; row += 1) {
        for (let column = 0; column < grid[row].length; column += 1) {
            const square = grid[row][column];
            if (isFloor(square)) { continue; }

            const adjacentSquares = getAdjacentSquares(row, column);
            if (isEmpty(square) && ! adjacentSquares.some(s => isOccupied(s))) {
                nextRoundGrid[row][column] = "#";
            } else if (isOccupied(square) && adjacentSquares.filter(s => isOccupied(s)).length >= 5) {
                nextRoundGrid[row][column] = "L";
            } else {
                nextRoundGrid[row][column] = square;
            }
        }
    }

    return nextRoundGrid;

    function getAdjacentSquares(row: number, column: number) {
        const adjacentSquares = [];

        if (column > 0) { adjacentSquares.push(findLeftSeat()); }
        if (column < grid[row].length - 1) { adjacentSquares.push(findRightSeat()); }
        if (row > 0) {
            adjacentSquares.push(findTopSeat());
            if (column > 0) { adjacentSquares.push(findTopLeftSeat()); }
            if (column < grid[row].length - 1) { adjacentSquares.push(findTopRigtSeat()); }
        }
        if (row < grid.length - 1) {
            adjacentSquares.push(findBottomSeat());
            if (column > 0) { adjacentSquares.push(findBottomLeftSeat()); }
            if (column < grid[row].length - 1) { adjacentSquares.push(findBottomRightSeat()); }
        }

        return adjacentSquares.filter(square => ! isFloor(square));

        function findLeftSeat() {
            let y = column - 1;
            while (isFloor(grid[row][y]) && y > 0) {
                y -= 1;
            }
            return grid[row][y];
        }
        function findRightSeat() {
            let y = column + 1;
            while (isFloor(grid[row][y]) && y < grid[row].length - 1) {
                y += 1;
            }
            return grid[row][y];
        }
        function findTopSeat() {
            let x = row - 1;
            while(isFloor(grid[x][column]) && x > 0) {
                x -= 1;
            }
            return grid[x][column];
        }
        function findTopLeftSeat() {
            let x = row - 1;
            let y = column - 1;
            while(isFloor(grid[x][y]) && x > 0 && y > 0) {
                x -= 1;
                y -= 1;
            }
            return grid[x][y];
        }
        function findTopRigtSeat() {
            let x = row - 1;
            let y = column + 1;
            while(isFloor(grid[x][y]) && x > 0 && y < grid[row].length - 1) {
                x -= 1;
                y += 1;
            }
            return grid[x][y];
        }
        function findBottomSeat() {
            let x = row + 1;
            while(isFloor(grid[x][column]) && x < grid.length - 1) {
                x += 1;
            }
            return grid[x][column];
        }
        function findBottomLeftSeat() {
            let x = row + 1;
            let y = column - 1;
            while(isFloor(grid[x][y]) && x < grid.length - 1 && y > 0) {
                x += 1;
                y -= 1;
            }
            return grid[x][y];
        }
        function findBottomRightSeat() {
            let x = row + 1;
            let y = column + 1;
            while(isFloor(grid[x][y]) && x < grid.length - 1 && y < grid[row].length - 1) {
                x += 1;
                y += 1;
            }
            return grid[x][y];
        }
    }
}

function countOccupiedSeats(grid: Array<Array<string>>, applyMethod: any) {
    let nextRoundGrid = applyMethod(grid);
    let nextNextRoundGrid = applyMethod(nextRoundGrid);

    while (JSON.stringify(nextRoundGrid) !== JSON.stringify(nextNextRoundGrid)) {
        nextRoundGrid = nextNextRoundGrid;
        nextNextRoundGrid = applyMethod(nextNextRoundGrid);
    }

    return nextRoundGrid.flat().filter((square: string) => isOccupied(square)).length;
}

const inputFile = readFileSync("src/day11/day11.input.txt", "utf8");

console.log(countOccupiedSeats(parseGrid(inputFile), applySeatingRound));
console.log(countOccupiedSeats(parseGrid(inputFile), applyPartTwoSeatingRound));
