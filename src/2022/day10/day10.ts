import { readFileSync } from "fs";
import { toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day10/input.txt", "utf8");

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(moves: any[]) {
    return 0
}

function part2(moves: any[]) {
    return 0;
}

function parseInput(lines: string[]): any[] {
    const moves = []

    for (const line of lines) {
        moves.push({
            direction: line.split(" ")[0],
            nbSteps: toInt(line.split(" ")[1])
        })
    }

    return moves;
}
