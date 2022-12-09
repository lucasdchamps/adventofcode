import { readFileSync } from "fs";
import { toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day5/input.txt", "utf8");

function createStartingStacks() {
    return {
        1: ["V", "C", "D", "R", "Z", "G", "B", "W"],
        2: ["G", "W", "F", "C", "B", "S", "T", "V"],
        3: ["C", "B", "S", "N", "W"],
        4: ["Q", "G", "M", "N", "J", "V", "C", "P"],
        5: ["T", "S", "L", "F", "D", "H", "B"],
        6: ["J", "V", "T", "W", "M", "N"],
        7: ["P", "F", "L", "C", "S", "T", "G"],
        8: ["B", "D", "Z"],
        9: ["M", "N", "Z", "W"]
    };
}

type Move = {
    number: number;
    from: number;
    to: number;
}

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(moves: Move[]) {
    const stacks: Record<number, string[]> = createStartingStacks();

    for (const move of moves) {
        for (let i = 0; i < move.number; i++) {
            const popped = stacks[move.from].pop();
            stacks[move.to].push(popped!);
        }
    }

    return stacks;
}

function part2(moves: Move[]) {
    const stacks: Record<number, string[]> = createStartingStacks();

    for (const move of moves) {
        const poppedCranes = [];
        for (let i = 0; i < move.number; i++) {
            const popped = stacks[move.from].pop();
            poppedCranes.push(popped!);
        }
        stacks[move.to].push(...(poppedCranes.reverse()));
    }

    return stacks;
}

function parseInput(lines: string[]) {
    const result = [];

    for (const line of lines) {
        const words = line.split(" ");
        if (words[0] !== "move") { continue; }

        result.push({
            number: toInt(words[1]),
            from: toInt(words[3]),
            to: toInt(words[5])
        })
    }

    return result;
}
