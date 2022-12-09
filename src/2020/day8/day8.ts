import { readFileSync } from "fs";

const inputFile = readFileSync("src/day8/day8.input.txt", "utf8");

type Instruction = {
    type: string;
    sign: string;
    value: number;
}

function parseInstructions(inputStream: string): Instruction[] {
    return inputStream.split("\n").filter(line => !! line).map(parseInstruction);
}

function parseInstruction(inputLine: string): Instruction {
    const [type, signedValue] = inputLine.split(" ");
    const sign = signedValue.split("")[0];
    const value = signedValue.split("").slice(1).join("");
    return {
        type,
        sign,
        value: parseInt(value, 10)
    }
}

function doesProgramFinish(instructions: Instruction[]) {
    let accumulator = 0;
    let instructionIndex = 0;
    const seenInstructionIndexes = new Set();

    do {
        seenInstructionIndexes.add(instructionIndex);
        applyInstruction(instructions[instructionIndex]);
    } while(! seenInstructionIndexes.has(instructionIndex) && instructionIndex < instructions.length)

    console.log("accumulator", accumulator);
    return instructionIndex === instructions.length;

    function applyInstruction(instruction: Instruction) {
        if (instruction.type === "nop") {
            instructionIndex += 1;
        }
        if (instruction.type === "acc") {
            accumulator = addTo(accumulator);
            instructionIndex += 1
        }
        if (instruction.type === "jmp") {
            instructionIndex = addTo(instructionIndex);
        }

        function addTo(recipient: number) {
            if (instruction.sign === "+") {
                return recipient + instruction.value;
            } else {
                return recipient - instruction.value;
            }
        }
    }
}

function makeProgramFinish(instructions: Instruction[]) {
    let flippedInstructionIndex = 0;

    while(flippedInstructionIndex < instructions.length) {
        while(instructions[flippedInstructionIndex].type === "acc") { flippedInstructionIndex += 1; }

        console.log(flippedInstructionIndex);
        const flippedInstructions = flipInstructions();
        if (doesProgramFinish(flippedInstructions as Instruction[])) { return; }

        flippedInstructionIndex += 1;
    }

    function flipInstructions() {
        const instructionToFlip = instructions[flippedInstructionIndex];
        return [
            ...instructions.slice(0, flippedInstructionIndex),
            {
                type: instructionToFlip.type === "nop" ? "jmp" : "nop",
                sign: instructionToFlip.sign,
                value: instructionToFlip.value
            },
            ...instructions.slice(flippedInstructionIndex + 1)
        ]
    }
}

console.log(makeProgramFinish(parseInstructions(inputFile)));
