import { readFileSync } from "fs";
import { toInt } from "../../utils";

const input = readFileSync("src/2021/day7/day7.input.txt", "utf8");

function parseInput(lines: string[]) {
    return lines[0].split(",").map(toInt);
}

const res = parseInput(input.split("\n"));

function fuelConsumption1(positions: number[], targetPosition: number) {
    return positions.map(position => Math.abs(targetPosition - position)).reduce((prev, curr) => prev + curr);
}

function fuelConsumption2(positions: number[], targetPosition: number) {
    return positions.map(position => {
        let consumption = 0
        for (let i = 1; i <= Math.abs(targetPosition - position); i++) {
            consumption += i;
        }
        return consumption;
    }).reduce((prev, curr) => prev + curr);
}

function part1(positions: number[]) {
    const average = positions.reduce((prev, curr) => prev + curr) / positions.length;
    const ecart = Math.sqrt(positions.map(position => (position - average) ** 2).reduce((prev, curr) => prev + curr) / positions.length);

    const consumptions = [];
    const start = Math.floor(Math.max(average - ecart, 0));
    const end = Math.ceil(average + ecart);
    for (let i = start; i <= end; i++) {
        consumptions.push(fuelConsumption2(positions, i));
    }

    return Math.min(...consumptions);
}

console.log(part1(res));
