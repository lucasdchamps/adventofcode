import { readFileSync } from "fs";
import { Board } from "../../utils";

const rawInput = readFileSync("src/2022/day23/input.txt", "utf8");

console.log(part1(parseInput(rawInput.split("\n"))));
console.log(part2(parseInput(rawInput.split("\n"))));

function firstHalf(elves: Record<string, string>, directions: string[]) {
    for (const elfPos of Object.keys(elves)) {
        const [i, j] = JSON.parse(elfPos);
        if (noElfAround(i, j)) { continue; }

        for (const direction of directions) {
            if (canMove(i, j, direction)) {
                elves[elfPos] = nextPos(i, j, direction);
                break;
            }
        }
    }

    function noElfAround(x: number, y: number) {
        if (elves[JSON.stringify([x - 1, y - 1])]) { return false; }
        if (elves[JSON.stringify([x - 1, y])]) { return false; }
        if (elves[JSON.stringify([x - 1, y + 1])]) { return false; }
        if (elves[JSON.stringify([x, y - 1])]) { return false; }
        if (elves[JSON.stringify([x, y + 1])]) { return false; }
        if (elves[JSON.stringify([x + 1, y - 1])]) { return false; }
        if (elves[JSON.stringify([x + 1, y])]) { return false; }
        return ! elves[JSON.stringify([x + 1, y + 1])];

    }

    function canMove(x: number, y: number, dir: string) {
        if (dir === "N") {
            return ! elves[JSON.stringify([x - 1, y - 1])] && ! elves[JSON.stringify([x - 1, y])] && ! elves[JSON.stringify([x - 1, y + 1])];
        }
        if (dir === "E") {
            return ! elves[JSON.stringify([x - 1, y + 1])] && ! elves[JSON.stringify([x, y + 1])] && ! elves[JSON.stringify([x + 1, y + 1])];
        }
        if (dir === "S") {
            return ! elves[JSON.stringify([x + 1, y - 1])] && ! elves[JSON.stringify([x + 1, y])] && ! elves[JSON.stringify([x + 1, y + 1])];
        }
        return ! elves[JSON.stringify([x - 1, y - 1])] && ! elves[JSON.stringify([x, y - 1])] && ! elves[JSON.stringify([x + 1, y - 1])];
    }

    function nextPos(x: number, y: number, dir: string) {
        if (dir === "N") { return JSON.stringify([x - 1, y]); }
        if (dir === "E") { return JSON.stringify([x, y + 1]); }
        if (dir === "S") { return JSON.stringify([x + 1, y]); }
        return JSON.stringify([x, y - 1]);
    }
}

function secondHalf(elves: Record<string, string>) {
    const nextElves: Record<string, string> = {};
    const posCount: Record<string, number> = {};
    for (const nextPos of Object.values(elves)) {
        if (! posCount[nextPos]) { posCount[nextPos] = 0; }
        posCount[nextPos] += 1;
    }

    let hasMoved = false;
    for (const [elfPos, nextPos] of Object.entries(elves)) {
        if (posCount[nextPos] > 1) {
            nextElves[elfPos] = elfPos;
            continue;
        }
        if (nextPos !== elfPos) { hasMoved = true; }
        nextElves[nextPos] = nextPos;
    }

    return { nextElves, hasMoved };
}

function emptyTiles(elves: Record<string, string>) {
    const minX = Math.min(...Object.keys(elves).map(p => JSON.parse(p)[0]));
    const maxX = Math.max(...Object.keys(elves).map(p => JSON.parse(p)[0]));
    const minY = Math.min(...Object.keys(elves).map(p => JSON.parse(p)[1]));
    const maxY = Math.max(...Object.keys(elves).map(p => JSON.parse(p)[1]));

    for (let i = minX; i <= maxX; i++) {
        const line = [];
        for (let j = minY; j <= maxY; j++) {
            if (elves[JSON.stringify([i, j])]) {
                line.push("#");
            } else {
                line.push(".");
            }
        }
        console.log(line.join(""));
    }

    return (maxX + 1 - minX) * (maxY + 1 - minY) - Object.keys(elves).length;
}

function part1(board: Board) {
    let elves: Record<string, string> = {};
    board.iterateCells((cell, i, j) => {
        if (cell === "#") {
            elves[JSON.stringify([i, j])] = JSON.stringify([i, j]);
        }
    });

    let directions = ["N", "S", "W", "E"];
    for (let r = 0; r < 10; r++) {
        firstHalf(elves, directions);
        elves = secondHalf(elves).nextElves;
        directions = [...directions.slice(1), directions[0]];
    }

    return emptyTiles(elves);
}

function part2(board: Board) {
    let elves: Record<string, string> = {};
    board.iterateCells((cell, i, j) => {
        if (cell === "#") {
            elves[JSON.stringify([i, j])] = JSON.stringify([i, j]);
        }
    });

    let directions = ["N", "S", "W", "E"];
    let r = 1;
    // eslint-disable-next-line no-constant-condition
    while(true) {
        firstHalf(elves, directions);
        const { nextElves, hasMoved } = secondHalf(elves);
        if (! hasMoved) { return r; }

        elves = nextElves;
        directions = [...directions.slice(1), directions[0]];
        r += 1;
    }

    return r;
}

function parseInput(lines: string[]): Board {
    return new Board(lines.map(l => l.split("")));
}
