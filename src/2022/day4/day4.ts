import { readFileSync } from "fs";
import { toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day4/input.txt", "utf8");

type Range = {
    min: number;
    max: number;
}

type Pair = {
    first: Range;
    second: Range;
}

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(pairs: Pair[]) {
    let nbFullyContains = 0;

    for (const pair of pairs) {
        if (containsOther(pair.first, pair.second)) {
            nbFullyContains += 1;
        }
         else if (containsOther(pair.second, pair.first)) {
            nbFullyContains += 1;
        }
    }

    return nbFullyContains;
}

function containsOther(range1: Range, range2: Range) {
    return range1.min <= range2.min && range2.max <= range1.max;
}

function part2(pairs: Pair[]) {
    let nbOverlaps = 0;

    for (const pair of pairs) {
        if (overlaps(pair.first, pair.second)) {
            nbOverlaps += 1;
        } else if (overlaps(pair.second, pair.first)) {
            nbOverlaps += 1;
        }
    }

    return nbOverlaps;
}

function overlaps(range1: Range, range2: Range) {
    return range1.min <= range2.min && range2.min <= range1.max;
}

function parseInput(lines: string[]) {
    const result = [];

    for (const line of lines) {
        const pair = line.split(",");
        result.push({
            first: createRange(pair[0].split("-")),
            second: createRange(pair[1].split("-"))
        });
    }

    return result;
}

function createRange(values: string[]) {
    return { min: toInt(values[0]), max: toInt(values[1]) };
}
