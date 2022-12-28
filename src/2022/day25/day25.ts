import { readFileSync } from "fs";
import { toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day25/input.txt", "utf8");

console.log(part1(parseInput(rawInput.split("\n"))));
console.log(part2(parseInput(rawInput.split("\n"))));

function parseSnafu(snafu: string) {
    let multiplier = 1;
    let res = 0;

    for (const num of snafu.split("").reverse()) {
        if (num === "-") { res += multiplier * -1; }
        else if (num === "=") { res += multiplier * -2; }
        else { res += multiplier * toInt(num); }
        multiplier *= 5;
    }

    return res;
}

function toSnafu(value: number) {
    let res = "";
    let num = value;

    while (num > 0) {
        const rem = num % 5;
        num = Math.floor(num / 5);
        if (rem === 0) {
            res = "0" + res;
        } else if (rem === 1) {
            res = "1" + res;
        } else if (rem === 2) {
            res = "2" + res;
        } else if (rem === 3) {
            res = "=" + res;
            num += 1;
        } else if (rem === 4) {
            res = "-" + res;
            num += 1;
        }
    }

    return res;
}

function part1(values: string[]) {
    return toSnafu(values.reduce((acc, val) => acc = acc + parseSnafu(val), 0));
}

function part2(values: string[]) {
    return 0;
}

function parseInput(lines: string[]): string[] {
    return lines;
}
