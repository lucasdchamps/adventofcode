import { readFileSync } from "fs";

const rawInput = readFileSync("src/2022/day3/input.txt", "utf8");

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

type Rucksack = {
    firstCompartment: string[];
    secondCompartment: string[];
}

function part1(rucksacks: Rucksack[]) {
    return rucksacks.map(intersection).map(inter => priority(inter[0])).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    );
}

function part2(rucksacks: Rucksack[]) {
    let result = 0;

    for (let i = 0; i <= rucksacks.length - 3; i += 3) {
        const r1 = allItems(rucksacks[i]);
        const r2 = allItems(rucksacks[i + 1]);
        const r3 = allItems(rucksacks[i + 2]);

        const r1r2 = new Set([...r1].filter(item => r2.has(item)));
        const r1r2r3 = [...r1r2].filter(item => r3.has(item));
        console.log(r1r2r3);
        result += priority(r1r2r3[0]);
    }

    return result;
}

function intersection(rucksack: Rucksack) {
    const firstHalf = new Set(rucksack.firstCompartment);
    return [...(new Set(rucksack.secondCompartment.filter(i => firstHalf.has(i))))];
}

function allItems(rucksack: Rucksack): Set<string> {
    return new Set([...rucksack.firstCompartment, ...rucksack.secondCompartment]);
}

function priority(letter: string) {
    if (letter === letter.toUpperCase()) {
        return letter.charCodeAt(0) - 38;
    } else {
        return letter.charCodeAt(0) - 96;
    }
}

function parseInput(lines: string[]) {
    const result = [];

    for (const line of lines) {
        const items = line.split("");
        result.push({
            firstCompartment: items.slice(0, items.length / 2),
            secondCompartment: items.slice(items.length / 2)
        });
    }

    return result;
}
