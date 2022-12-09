import { readFileSync } from "fs";
import { Board, PriorityQueue, toInt } from "../../utils";

const input = readFileSync("src/2021/day15/day15.input.txt", "utf8");

function parseInput(lines: string[]) {
    return lines.map(line => line.split("").map(toInt));
}

let res = parseInput(input.split("\n"));

class Cell {
    i: number;
    j: number;

    constructor(i: number, j: number) {
        this.i = i;
        this.j = j;
    }
}

function part1(cells: number[][]) {
    const board = new Board(cells);
    const unvisited: Record<string, Cell> = {};
    const distances: Record<string, number> = {};
    const queue = new PriorityQueue();
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            if (i !== 0 || j !== 0) {
                const coords = JSON.stringify([i, j]);
                unvisited[coords] = new Cell(i, j);
                distances[coords] = 30000000000;
                queue.add(coords, 30000000000);
            }
        }
    }
    distances[JSON.stringify([0, 1])] = board.cell(0, 1);
    distances[JSON.stringify([1, 0])] = board.cell(1, 0);
    queue.remove(JSON.stringify([0, 1]));
    queue.enqueue(JSON.stringify([0, 1]), board.cell(0, 1));
    queue.remove(JSON.stringify([1, 0]));
    queue.enqueue(JSON.stringify([1, 0]), board.cell(1, 0));

    while(! queue.isEmpty()) {
        let { element: coords } = queue.dequeue()!;
        const closestDist = distances[coords];
        let [i, j] = JSON.parse(coords);

        const adjacents = board.adjacentCoordinates(i, j);
        for (let idx = 0; idx < adjacents.length; idx++) {
            ([i, j] = adjacents[idx]);
            coords = JSON.stringify([i, j]);
            if (! unvisited[coords]) { continue; }

            const newDist = closestDist + board.cell(i, j);
            if (newDist < distances[coords]) {
                distances[coords] = newDist;
                queue.remove(coords);
                queue.enqueue(coords, newDist);
            }
        }
    }

    return distances[JSON.stringify([cells.length - 1, cells[0].length - 1])];
}

// console.log(part1(res));

function modulo9(value: number) {
    if (value === 9) {
        return 1;
    } else {
        return value + 1;
    }
}

function buildFullMap(cells: number[][]) {
    const height = cells.length;
    const length = cells[0].length;
    const fullMap: number[][] = [];

    for (let i = 0; i < 5 * height; i++) {
        fullMap[i] = [];

        if (i < height) {
            for (let j = 0; j < 5 * length; j++) {
                if (j < length) {
                    fullMap[i][j] = cells[i][j];
                } else {
                    fullMap[i][j] = modulo9(fullMap[i][j - length]);
                }
            }
        } else {
            for (let j = 0; j < 5 * length; j++) {
                if (j < length) {
                    fullMap[i][j] = modulo9(fullMap[i - height][j]);
                } else {
                    fullMap[i][j] = modulo9(fullMap[i][j - length]);
                }
            }
        }
    }

    return fullMap;
}

function part2(cells: number[][]) {
    const fullMap = buildFullMap(cells);
    console.log("fullmap built");
    return part1(fullMap);
}

res = parseInput(input.split("\n"));

console.log(part2(res));
