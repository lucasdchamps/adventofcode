import { readFileSync } from "fs";

const input = readFileSync("src/2021/day25/day25.input.txt", "utf8");

class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class SeaGrid {
    eastCucumbers: Position[] = [];
    southCucumbers: Position[] = [];
    grid: string[][];

    constructor(grid: string[][]) {
        this.grid = grid;
        this.grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === ">") {
                    this.eastCucumbers.push(new Position(i, j));
                }
                if (cell === "v") {
                    this.southCucumbers.push(new Position(i, j));
                }
            });
        });
    }

    toString() {
        return this.grid.map(row => row.join("")).join("\n");
    }

    nextEastPosition(position: Position) {
        if (position.y === this.grid[0].length - 1) { return new Position(position.x, 0); }
        return new Position(position.x, position.y + 1);
    }

    nextSouthPosition(position: Position) {
        if (position.x === this.grid.length - 1) { return new Position(0, position.y); }
        return new Position(position.x + 1, position.y);
    }

    moveEastCucumbers() {
        const eastCucumbersToMove = this.eastCucumbers.filter(c => {
            const nextPos = this.nextEastPosition(c);
            return this.grid[nextPos.x][nextPos.y] === ".";
        });

        eastCucumbersToMove.forEach(c => {
            this.grid[c.x][c.y] = ".";
            const nextPos = this.nextEastPosition(c);
            c.x = nextPos.x;
            c.y = nextPos.y;
            this.grid[nextPos.x][nextPos.y] = ">";
        });

        return eastCucumbersToMove.length;
    }

    moveSouthCucumbers() {
        const southCucumbersToMove = this.southCucumbers.filter(c => {
            const nextPos = this.nextSouthPosition(c);
            return this.grid[nextPos.x][nextPos.y] === ".";
        });

        southCucumbersToMove.forEach(c => {
            this.grid[c.x][c.y] = ".";
            const nextPos = this.nextSouthPosition(c);
            c.x = nextPos.x;
            c.y = nextPos.y;
            this.grid[nextPos.x][nextPos.y] = "v";
        });

        return southCucumbersToMove.length;
    }

    moveCucumbers() {
        let movedCucumbers = this.moveEastCucumbers();
        movedCucumbers += this.moveSouthCucumbers();
        return movedCucumbers;
    }
}

function parseInput(lines: string[]) {
    return new SeaGrid(lines.map(line => line.split("")));
}

let res = parseInput(input.split("\n"));

console.log(res.toString());

function part1(seaGrid: SeaGrid) {
    let nbSteps = 1;
    while(seaGrid.moveCucumbers()) {
        nbSteps += 1;
    }
    return nbSteps;
}

console.log(part1(res));

function part2(seaGrid: SeaGrid) {
    return 0;
}

res = parseInput(input.split("\n"));

console.log(part2(res));
