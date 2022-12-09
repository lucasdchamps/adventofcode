import { readFileSync } from "fs";
import { toInt } from "../../utils";

const input = readFileSync("src/2021/day24/day24.input.txt", "utf8");

class ALU {
    variables: Record<string, number> = {
        "w": 0,
        "x": 0,
        "y": 0,
        "z": 0
    }

    operation(operationString: string, variable: string, value: string) {
        if (operationString === "add") { this.add(variable, value); }
        if (operationString === "mul") { this.mul(variable, value); }
        if (operationString === "div") { this.div(variable, value); }
        if (operationString === "mod") { this.mod(variable, value); }
        if (operationString === "eql") { this.eql(variable, value); }
    }

    inp(variable: string, value: number) {
        this.variables[variable] = value;
    }

    add(variable: string, value: string) {
        this.variables[variable] = this.variables[variable] + this.numberValue(value);
    }

    mul(variable: string, value: string) {
        this.variables[variable] = this.variables[variable] * this.numberValue(value);
    }

    div(variable: string, value: string) {
        this.variables[variable] = Math.floor(this.variables[variable] / this.numberValue(value));
    }

    mod(variable: string, value: string) {
        this.variables[variable] = this.variables[variable] % this.numberValue(value);
    }

    eql(variable: string, value: string) {
        this.variables[variable] = this.variables[variable] === this.numberValue(value) ? 1 : 0;
    }

    numberValue(value: string) {
        return ! isNaN(toInt(value)) ? toInt(value) : this.variables[value];
    }
}

function parseInput(lines: string[]) {
    return lines.map(line => line.split(" "));
}

const res = parseInput(input.split("\n"));

console.log(res);

function runALU(inputs: number[], operations: string[][]) {
    const alu = new ALU();
    operations.forEach(operation => {
        if (operation[0] === "inp") {
            alu.inp(operation[1], inputs.shift()!);
        } else {
            alu.operation(operation[0], operation[1], operation[2]);
        }
    });
    return alu;
}

function part1(operations: string[][]) {
    const target = [8, 1, 5, 1, 4, 1, 7, 1, 1, 6, 1, 3, 8, 1];
    let modelNumber = 81514171161381;
    let largestValidModelNumber = null;

    while (modelNumber <= 99999999999999) {
        const inputs = `${modelNumber}`.split("").map(toInt);
        const alu = runALU(inputs, operations);
        if (alu.variables.z === 0) {
            largestValidModelNumber = modelNumber;
            console.log(modelNumber, "is valid!!!!");
            break;
        }
        modelNumber += 1;
    }

    return largestValidModelNumber;
}

console.log(part1(res));