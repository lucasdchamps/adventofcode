import { DAY1_INPUT } from "./day1.input";

const sortedDay1Input = DAY1_INPUT.sort((a, b) => a - b);

export function getTwoNumbersSummingTo(sortedNumbers: number[], sumTarget: number): number[] | undefined {
    for (let firstNumberIndex = 0; firstNumberIndex < sortedNumbers.length; firstNumberIndex++) {
        const firstNumber = sortedNumbers[firstNumberIndex];
        if (firstNumber > sumTarget) { break; }

        for (let secondNumberIndex = firstNumberIndex + 1; secondNumberIndex < sortedNumbers.length; secondNumberIndex++) {
            const secondNumber = sortedNumbers[secondNumberIndex];
            if (firstNumber + secondNumber > sumTarget) { break; }

            if (firstNumber + secondNumber === sumTarget) { return [firstNumber, secondNumber]; }
        }
    }
}

const [firstNumber, secondNumber] = getTwoNumbersSummingTo(sortedDay1Input, 2020) as number[];
console.log(firstNumber * secondNumber);

function getThreeNumbersSummingTo(sortedNumbers: number[], sumTarget: number) {
    for (let firstNumberIndex = 0; firstNumberIndex < sortedNumbers.length; firstNumberIndex++) {
        const number1 = sortedNumbers[firstNumberIndex];
        if (number1 > sumTarget) { break; }

        const otherTwoNumbers = getTwoNumbersSummingTo(sortedNumbers, sumTarget - number1);
        if (otherTwoNumbers) { return [firstNumber, ...otherTwoNumbers]; }
    }
}

const [number1, number2, number3] = getThreeNumbersSummingTo(sortedDay1Input, 2020) as number[];
console.log(number1 * number2 * number3);
