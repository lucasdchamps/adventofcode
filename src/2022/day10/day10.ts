import { readFileSync } from "fs";
import { toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day10/input.txt", "utf8");

type Instruction = "noop" | number;

const cyclesToInspect = new Set([20, 60, 100, 140, 180, 220]);
const cyclesToInspect2 = new Set([40, 80, 120, 160, 200, 240]);

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(instructions: Instruction[]) {
    let sum = 0;
    let cycle = 0;
    let registerValue = 1;

    for (const instruction of instructions) {
        if (instruction === "noop") {
            incrementCycle();
        } else {
            incrementCycle();
            incrementCycle();
            registerValue += instruction;
        }
    }

    function incrementCycle() {
        cycle += 1;
        if (cyclesToInspect.has(cycle)) {
            sum += registerValue * cycle;
        }
    }

    return sum;
}

function part2(instructions: Instruction[]) {
    let row: string[] = [];
    let crt = 0;
    let sprite = 1;

    for (const instruction of instructions) {
        if (instruction === "noop") {
            incrementCycle();
        } else {
            incrementCycle();
            incrementCycle();
            sprite += instruction;
        }
    }

    function incrementCycle() {
        if (crt === sprite - 1 || crt === sprite || crt === sprite + 1) {
            row.push("#");
        } else {
            row.push(".");
        }
        crt += 1;
        if (crt === 40) {
            console.log(row.join(""));
            row = [];
            crt = 0;
        }
    }
}

function parseInput(lines: string[]): any[] {
    const instructions = []

    for (const line of lines) {
        if (line.startsWith("noop")) {
            instructions.push("noop");
        } else {
            instructions.push(toInt(line.split(" ")[1]));
        }
    }

    return instructions;
}
