import { readFileSync } from "fs";
import { Board, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day14/input.txt", "utf8");

class Cave {
    elements: Board;
    minXWWithoutAir: number;
    minYWWithoutAir: number;
    maxXWWithoutAir: number;
    maxYWWithoutAir: number;

    constructor(elements: Board) {
        this.elements = elements;
        this.minXWWithoutAir = this.elements.length();
        this.maxXWWithoutAir = 0;
        this.minYWWithoutAir = this.elements.height();
        this.maxYWWithoutAir = 0;
        this.elements.iterateCells((cell: string, y: number, x: number) => {
            if (cell !== "#") { return; }
            if (y < this.minYWWithoutAir) { this.minYWWithoutAir = y; }
            if (y > this.maxYWWithoutAir) { this.maxYWWithoutAir = y; }
            if (x < this.minXWWithoutAir) { this.minXWWithoutAir = x; }
            if (x > this.maxXWWithoutAir) { this.maxXWWithoutAir = x; }
        });

        this.maxYWWithoutAir += 2;
    }

    log() {
        for (let y = this.minYWWithoutAir; y <= this.maxYWWithoutAir; y++) {
            console.log(this.elements.row(y).slice(this.minXWWithoutAir, this.maxXWWithoutAir + 1).join(""));
        }
    }

    setSand(y: number, x: number) {
        this.elements.setCellValue(y, x, "o");
        if (y < this.minYWWithoutAir) { this.minYWWithoutAir = y; }
        if (y > this.maxYWWithoutAir) { this.maxYWWithoutAir = y; }
        if (x < this.minXWWithoutAir) { this.minXWWithoutAir = x; }
        if (x > this.maxXWWithoutAir) { this.maxXWWithoutAir = x; }
    }
}

console.log(part1(parseInput(rawInput.split("\n"))));
console.log(part2(parseInput(rawInput.split("\n"))));

function part1(cave: Cave) {
    let nbSandAtRest = 0;

    while(flowSand1(cave)) {
        nbSandAtRest += 1;
    }

    return nbSandAtRest;
}

function part2(cave: Cave) {
    let nbSandAtRest = 0;

    while(flowSand2(cave)) {
        nbSandAtRest += 1;
    }

    return nbSandAtRest + 1;
}

function flowSand1(cave: Cave) {
    let y = 0;
    let x = 500;

    let nextStep = flowOneStep(cave.elements, y, x);
    while(nextStep) {
        y = nextStep[0];
        x = nextStep[1];

        if (y > cave.maxYWWithoutAir) {
            return false;
        }

        nextStep = flowOneStep(cave.elements, y, x);
    }

    cave.setSand(y, x);
    return true;
}

function flowSand2(cave: Cave) {
    let y = 0;
    let x = 500;

    let nextStep = flowOneStep(cave.elements, y, x);
    if (! nextStep) {
        return false;
    }

    while(nextStep) {
        y = nextStep[0];
        x = nextStep[1];

        if (y === cave.maxYWWithoutAir - 1) {
            cave.setSand(y, x);
            return true;
        }

        nextStep = flowOneStep(cave.elements, y, x);
    }

    cave.setSand(y, x);
    return true;
}

function flowOneStep(elements: Board, y: number, x: number) {
    if (elements.cell(y + 1, x) === ".") {
        return [y + 1, x];
    } else if (elements.cell(y + 1, x - 1) === ".") {
        return [y + 1, x - 1];
    } else if (elements.cell(y + 1, x + 1) === ".") {
        return [y + 1, x + 1];
    }
    return null;
}

function parseInput(lines: string[]): Cave {
    const result: string[][] = [];
    for (let i = 0; i < 2000; i++) {
        result.push([...Array(2000).fill(".")]);
    }

    for (const line of lines) {
        const coords = line.split(" -> ");
        let i = 0;
        while(i < coords.length - 1) {
            const [x1, y1] = coords[i].split(",").map(toInt);
            const [x2, y2] = coords[i + 1].split(",").map(toInt);
            const xFrom = Math.min(x1, x2);
            const xTo = Math.max(x1, x2);
            const yFrom = Math.min(y1, y2);
            const yTo = Math.max(y1, y2);
            for (let y = yFrom; y <= yTo; y++) {
                for (let x = xFrom; x <= xTo; x++) {
                    result[y][x] = "#";
                }
            }
            i += 1;
        }
    }

    return new Cave(new Board(result));
}
