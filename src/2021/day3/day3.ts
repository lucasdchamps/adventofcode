import { DAY3_INPUT } from "./day3.input";

function part1() {
    let gammaBits = "";
    let epsilonBits = "";
    const numberBits = DAY3_INPUT[0].length;

    for (let position = 0; position < numberBits; position++) {
        let zeroBitCount = 0;
        let oneBitCount = 0;
        for (const number of DAY3_INPUT) {
            if (number[position] === "0") { zeroBitCount += 1; }
            if (number[position] === "1") { oneBitCount += 1; }
        }
        if (oneBitCount > zeroBitCount) {
            gammaBits = gammaBits + "1";
            epsilonBits = epsilonBits + "0";
        } else {
            gammaBits = gammaBits + "0";
            epsilonBits = epsilonBits + "1";
        }
    }

    console.log(gammaBits);
    console.log(epsilonBits);
}

part1();

function CountBitOccurrences(numbers: string[], position: number) {
    let zeroBitCount = 0;
    let oneBitCount = 0;
    for (const number of numbers) {
        if (number[position] === "0") { zeroBitCount += 1; }
        if (number[position] === "1") { oneBitCount += 1; }
    }

    return { zeroBitCount, oneBitCount };
}

function part2() {
    console.log(findOxygenRating());
    console.log(findCO2Scrabing());

    function findOxygenRating() {
        let numbers = [...DAY3_INPUT];
        let position = 0;

        while(numbers.length > 1) {
            const { zeroBitCount, oneBitCount } = CountBitOccurrences(numbers, position);
            if (oneBitCount >= zeroBitCount) {
                numbers = numbers.filter(number => number[position] === "1");
            } else {
                numbers = numbers.filter(number => number[position] === "0");
            }
            position += 1;
        }

        return numbers[0];
    }

    function findCO2Scrabing() {
        let numbers = [...DAY3_INPUT];
        let position = 0;

        while(numbers.length > 1) {
            const { zeroBitCount, oneBitCount } = CountBitOccurrences(numbers, position);
            if (oneBitCount < zeroBitCount) {
                numbers = numbers.filter(number => number[position] === "1");
            } else {
                numbers = numbers.filter(number => number[position] === "0");
            }
            position += 1;
        }

        return numbers[0];
    }
}

console.log(part2());
