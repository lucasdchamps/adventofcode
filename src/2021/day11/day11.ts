import { readFileSync } from "fs";
import { Board, toInt } from "../../utils";

const input = readFileSync("src/2021/day11/day11.input.txt", "utf8");

function parseInput(lines: string[]) {
    return new Board(lines.map(line => line.split("").map(toInt)));
}

let res = parseInput(input.split("\n"));

function applyStep(board: Board) {
    const hasFlashed: Set<string> = new Set();

    let willFlash: Set<string> = new Set();
    board.iterateCells((cell: number, i: number, j: number) => {
        const newValue = cell + 1;
        board.setCellValue(i, j, newValue);
        if (newValue > 9) {
            willFlash.add(JSON.stringify([i, j]));
        }
    });

    while(willFlash.size) {
        const toIterate: number[][] = [];
        willFlash.forEach(coordinates => {
            if (hasFlashed.has(coordinates)) { return; }
            hasFlashed.add(coordinates);
            toIterate.push(JSON.parse(coordinates));
        });
        willFlash = new Set();

        toIterate.forEach(([i, j]) => {
            board.iterateAdjacents(i, j, (cell: number, adjI: number, adjJ: number) => {
                const newValue = cell + 1;
                board.setCellValue(adjI, adjJ, newValue);
                if (newValue > 9) {
                    willFlash.add(JSON.stringify([adjI, adjJ]));
                }
            });
        });
    }

    hasFlashed.forEach(coordinates => {
        const [i, j] = JSON.parse(coordinates);
        board.setCellValue(i, j, 0);
    })

    return hasFlashed.size;
}

function part1(board: Board) {
    let i = 0;
    let nbFlashes = 0;
    while(i < 100) {
        nbFlashes += applyStep(board);
        i++;
    }
    return nbFlashes;
}

console.log(part1(res));

function part2(board: Board) {
    let i = 0;
    let nbFlashes = 0;
    while(nbFlashes < 100) {
        nbFlashes = applyStep(board);
        i++;
    }
    return i;
}

res = parseInput(input.split("\n"));

console.log(part2(res));