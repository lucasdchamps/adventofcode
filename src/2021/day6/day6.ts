import { readFileSync } from "fs";
import { Counter, toInt } from "../../utils";

const input = readFileSync("src/2021/day6/day6.input.txt", "utf8");

function parseInput(lines: string[]) {
    return lines[0].split(",").map(toInt);
}

const res = parseInput(input.split("\n"));

function part1(fishes: number[]) {
    let i = 0;
    const fishesCounter = new Counter(fishes);

    while(i < 256) {
        const nbNewFishes = fishesCounter.getCount(0);

        fishesCounter.setCount(0, fishesCounter.getCount(1));
        fishesCounter.setCount(1, fishesCounter.getCount(2));
        fishesCounter.setCount(2, fishesCounter.getCount(3));
        fishesCounter.setCount(3, fishesCounter.getCount(4));
        fishesCounter.setCount(4, fishesCounter.getCount(5));
        fishesCounter.setCount(5, fishesCounter.getCount(6));
        fishesCounter.setCount(6, fishesCounter.getCount(7) + nbNewFishes);
        fishesCounter.setCount(7, fishesCounter.getCount(8));
        fishesCounter.setCount(8, nbNewFishes);

        i++;
    }

    return fishesCounter.total();
}

console.log(part1(res));
