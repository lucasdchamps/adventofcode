import { readFileSync } from "fs";

const rawInput = readFileSync("src/2022/day6/input.txt", "utf8");

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(chars: string[]) {
    for (let i = 3; i < chars.length; i++) {
        if (areCharactersDifferent(i)) {
            return i + 1
        }
    }

    function areCharactersDifferent(index: number) {
        const characters = chars.slice(index - 3, index + 1);
        return (new Set(characters)).size === characters.length;
    }
}

function part2(chars: any[]) {
    for (let i = 13; i < chars.length; i++) {
        if (areCharactersDifferent(i)) {
            return i + 1
        }
    }

    function areCharactersDifferent(index: number) {
        const characters = chars.slice(index - 13, index + 1);
        return (new Set(characters)).size === characters.length;
    }
}

function parseInput(lines: string[]) {
    return lines[0].split("");
}
