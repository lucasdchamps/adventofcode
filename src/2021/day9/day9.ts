import { readFileSync } from "fs";
import { Board, toInt } from "../../utils";

const input = readFileSync("src/2021/day9/day9.input.txt", "utf8");

function parseInput(lines: string[]) {
    const values: number[][] = [];
    lines.forEach(line => {
        values.push(line.split("").map(toInt));
    });
    return new Board(values);
}

const res = parseInput(input.split("\n"));

function getLowPoints(values: Board) {
    const lowPoints: number[][] = [];
    for (let i = 0; i < values.height(); i++) {
        for (let j = 0; j < values.length(); j++) {
            const cell = values.cell(i, j);
            const adjacents = values.adjacents(i, j);
            if (adjacents.filter(adj => cell < adj).length === adjacents.length) {
                lowPoints.push([i, j]);
            }
        }
    }
    return lowPoints;
}

function part1(values: Board) {
    return getLowPoints(values).map(([i, j]) => values.cell(i, j) + 1).reduce((prev, curr) => prev + curr);
}

console.log(part1(res));

function part2(values: Board) {
    const lowPoints = getLowPoints(values);
    const basinSizes: number[] = [];
    for (const [i, j] of lowPoints) {
        const seen = new Set();
        seen.add(JSON.stringify([i, j]));
        const stack = values.adjacentCoordinates(i, j);
        while (stack.length) {
            const [adjI, adjJ] = stack.pop()!;
            if (seen.has(JSON.stringify([adjI, adjJ]))) { continue; }
            if (values.cell(adjI, adjJ) === 9) { continue; }

            seen.add(JSON.stringify([adjI, adjJ]));
            stack.push(...values.adjacentCoordinates(adjI, adjJ));
        }

        basinSizes.push(seen.size);
    }

    console.log(basinSizes.sort((a, b) => b - a));
    return basinSizes[0] * basinSizes[1] * basinSizes[2];
}

console.log(part2(res));
