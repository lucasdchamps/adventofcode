import { readFileSync } from "fs";

const input = readFileSync("src/2021/day14/day14.input.txt", "utf8");

function parseInput(lines: string[]) {
    const polymer = lines[0];
    const rules: Record<string, string> = {};
    lines.slice(2).forEach(line => {
        const pair = line.split(" -> ")[0];
        rules[pair] = line.split(" -> ")[1];
    })
    return { polymer, rules };
}

const res = parseInput(input.split("\n"));

const NB_STEPS = 40;

function part1(polymer: string, rules: Record<string, string>) {
    const polymerChars = polymer.split("");
    let stepIndex = 0;

    let pairsCounter: Record<string, number> = {};
    for (let i = 0; i < polymerChars.length - 1; i++) {
        const pair = `${polymerChars[i]}${polymerChars[i + 1]}`;
        pairsCounter[pair] = pairsCounter[pair] ? pairsCounter[pair] + 1 : 1;
    }
    let newPairsCounter: Record<string, number> = {};

    while (stepIndex < NB_STEPS) {
        Object.entries(pairsCounter).forEach(([pair, count]) => {
            if (! rules[pair]) {
                newPairsCounter[pair] = count;
            } else {
                const firstPair = pair.split("")[0] + rules[pair];
                const secondPair = rules[pair] + pair.split("")[1];
                newPairsCounter[firstPair] = newPairsCounter[firstPair] ?  newPairsCounter[firstPair] + count : count;
                newPairsCounter[secondPair] = newPairsCounter[secondPair] ?  newPairsCounter[secondPair] + count : count;
            }
        });

        pairsCounter = newPairsCounter;
        newPairsCounter = {};

        stepIndex += 1;
    }

    const counter: Record<string, number> = {}
    Object.entries(pairsCounter).forEach(([pair, count]) => {
        const letter = pair[1];
        counter[letter] = counter[letter] ? counter[letter] + count : count;
    });

    return Math.max(...Object.values(counter)) - Math.min(...Object.values(counter));
}

console.log(part1(res.polymer, res.rules));
