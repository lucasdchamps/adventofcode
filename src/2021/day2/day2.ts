import { DAY2_INPUT } from "./day2.input";

const position = { horizontal: 0, depth: 0 };
for (let i = 0; i < DAY2_INPUT.length; i++) {
    const direction = DAY2_INPUT[i][0];
    const units = DAY2_INPUT[i][1] as number;
    if (direction === "forward") { position.horizontal += units; }
    if (direction === "down") { position.depth += units; }
    if (direction === "up") { position.depth -= units; }
}

console.log(position.horizontal * position.depth);

const position2 = { horizontal: 0, depth: 0, aim: 0 };
for (let i = 0; i < DAY2_INPUT.length; i++) {
    const direction = DAY2_INPUT[i][0];
    const units = DAY2_INPUT[i][1] as number;
    if (direction === "forward") {
        position2.horizontal += units;
        position2.depth += position2.aim * units;
    }
    if (direction === "down") { position2.aim += units; }
    if (direction === "up") { position2.aim -= units; }
}

console.log(position2.horizontal * position2.depth);
