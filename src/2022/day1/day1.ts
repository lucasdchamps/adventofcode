import { readFileSync } from "fs";
import { toInt } from "../../utils";

const input = readFileSync("src/2022/day1/day1.input.txt", "utf8");

const elvesCalories = parseInput(input.split("\n"));

console.log(elvesCalories);
console.log(part1(elvesCalories));
console.log(part2(elvesCalories));
console.log(72602 + 68012 + 66796);

function part1(calories: number[][]) {
    let max = 0;

    for (const elfCalories of calories) {
        const total = elfCalories.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
        );
        if (total > max) {
            max = total;
        }
    }

    return max;
}

function part2(calories: number[][]) {
    return calories.map(elfCalories => elfCalories.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    )).sort((a, b) => b - a);
}

function parseInput(lines: string[]) {
    const result = [];

    let currentCalories = [];
    for (const line of lines) {
        if (line === "") {
            result.push(currentCalories);
            currentCalories = [];
        } else {
            currentCalories.push(toInt(line));
        }
    }

    return result;
}
