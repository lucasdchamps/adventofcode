import { readFileSync } from "fs";

interface Program {
    mask: Array<"X" | number>;
    instructions: Array<[number, number]>;
}

function parsePrograms(inputFile: string): Program[] {
    return inputFile.split("\n\n").map(parseProgram);

    function parseProgram(programString: string): Program {
        const lines = programString.split("\n");
        const mask = parseMask(lines[0]);
        const instructions = lines.slice(1).map(parseInstruction);
        return {
            mask,
            instructions
        };
    }

    function parseMask(maskString: string): Array<"X" | number> {
        return maskString.split("mask = ")[1].split("").map(bit => {
            if (bit === "X") { return bit; }
            return parseInt(bit, 10);
        })
    }

    function parseInstruction(instructionString: string): [number, number] {
        const match = instructionString.match(/mem\[(\d+)] = (\d+)/);
        return [parseInt(match![1], 10), parseInt(match![2], 10)];
    }
}

function convertToBitArray(decimalNumber: number) {
    const bitArray = [];
    let number = decimalNumber;

    while(number !== 0) {
        bitArray.push(number % 2);
        number = Math.floor(number / 2);
    }
    while (bitArray.length < 36) { bitArray.push(0); }

    return bitArray.reverse();
}

function convertToDecimalNumber(bitArray: number[]) {
    let number = 0;
    for (let bitIndex = 0; bitIndex < bitArray.length; bitIndex += 1) {
        if (! bitArray[bitIndex]) { continue; }
        number += 2 ** (35 - bitIndex);
    }
    return number;
}

function initialize(programs: Program[]) {
    const mem: Record<number, number> = {};
    programs.forEach(applyProgram);

    function applyProgram(program: Program) {
        const mask = program.mask;
        program.instructions.forEach(applyInstruction);

        function applyInstruction(instruction: [number, number]) {
            mem[instruction[0]] = applyMask(instruction[1], mask);
        }
    }
    function applyMask(decimalNumber: number, mask: Array<"X" | number>) {
        const bitArray = convertToBitArray(decimalNumber);
        for (let i = 0; i < bitArray.length; i++) {
            if (mask[i] === "X") { continue; }
            bitArray[i] = mask[i] as number;
        }
        return convertToDecimalNumber(bitArray);
    }

    return mem;
}

function initialize2(programs: Program[]) {
    const mem: Record<number, number> = {};
    programs.forEach(applyProgram);

    function applyProgram(program: Program) {
        const mask = program.mask;
        program.instructions.forEach(applyInstruction);

        function applyInstruction(instruction: [number, number]) {
            const memoryAddresses: number[] = applyMask(instruction[0], mask);
            memoryAddresses.forEach(memoryAddress => {
                mem[memoryAddress] = instruction[1];
            })
        }
    }
    function applyMask(decimalNumber: number, mask: Array<"X" | number>): number[] {
        const bitArray = convertToBitArray(decimalNumber);
        let addresses: Array<"X" | number>[] = [];
        const baseAddress: Array<"X" | number> = [];

        for (let i = 0; i < bitArray.length; i++) {
            if (mask[i] === 0) {
                baseAddress.push(bitArray[i]);
            } else {
                baseAddress.push(mask[i]);
            }
        }
        addresses = [baseAddress];
        while(addresses[0].some(bit => bit === "X")) {
            addresses = unfoldAddresses(addresses);
        }

        return [...new Set(addresses.map(convertToDecimalNumber))];
    }
    function unfoldAddresses(addresses: Array<"X" | number>[]): Array<"X" | number>[] {
        const xIndex = addresses[0].findIndex(bit => bit === "X");
        const address = [...addresses[0]];
        address[xIndex] = 0;
        addresses.push([...address]);
        address[xIndex] = 1;
        addresses.push([...address]);
        addresses.shift();
        return addresses;
    }

    return mem;
}

const inputFile = readFileSync("src/day14/day14.input.txt", "utf8");

console.log(convertToDecimalNumber("000000000000000000000000000001001001".split("").map(bit => parseInt(bit, 10))));
console.log(convertToBitArray(73));

const mem = initialize(parsePrograms(inputFile));
console.log(Object.values(mem).reduce((a, b) => a + b));

const mem2 = initialize2(parsePrograms(inputFile));
console.log(Object.values(mem2).reduce((a, b) => a + b));