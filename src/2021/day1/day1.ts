import { DAY1_INPUT } from "./day1.input";

let numberIncreases = 0;
for (let i = 0; i < DAY1_INPUT.length - 1; i++) {
    const currentElement = DAY1_INPUT[i];
    const nextElement = DAY1_INPUT[i + 1];
    if (nextElement > currentElement) { numberIncreases += 1; }
}

console.log(numberIncreases);

numberIncreases = 0;
for (let i = 0; i < DAY1_INPUT.length - 3; i++) {
    const firstWindowSum = DAY1_INPUT[i] + DAY1_INPUT[i + 1] + DAY1_INPUT[i + 2];
    const secondWindowSum = DAY1_INPUT[i + 1] + DAY1_INPUT[i + 2] + DAY1_INPUT[i + 3];
    if (secondWindowSum > firstWindowSum) { numberIncreases += 1; }
}

console.log(numberIncreases);
