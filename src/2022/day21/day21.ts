import { readFileSync } from "fs";
import { prettyPrint, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day21/input.txt", "utf8");

const OPERATIONS = ["+", "-", "*", "/"];

type OperationJob = {
    monkey1: string;
    monkey2: string;
    operation: string;
}
type Job = number | OperationJob

const input = parseInput(rawInput.split("\n"));
prettyPrint(input);
// console.log(part1(input));
console.log(part2(input));

function applyOperation(val1: number, val2: number, operation: string) {
    if (operation === "+") { return val1 + val2; }
    if (operation === "-") { return val1 - val2; }
    if (operation === "*") { return val1 * val2; }
    return val1 / val2;
}

function applyReverseOperation(val1: number, val2: number, operation: string) {
    if (operation === "+") { return val1 - val2; }
    if (operation === "-") { return val1 + val2; }
    if (operation === "*") { return val1 / val2; }
    return val1 * val2;
}

function part1(monkeys: Record<string, Job>) {
    while (! Number.isInteger(monkeys["root"])) {
        for (const [monkey, job] of Object.entries(monkeys)) {
            if (Number.isInteger(job)) { continue; }

            const { monkey1, monkey2, operation } = job as OperationJob;
            if (Number.isInteger(monkeys[monkey1]) && Number.isInteger(monkeys[monkey2!])) {
                monkeys[monkey] = applyOperation(monkeys[monkey1] as number, monkeys[monkey2] as number, operation);
            }
        }
    }

    return monkeys["root"];
}

function deriveJob(monkey: string, monkeys: Record<string, Job>): string {
    if (monkey === "humn") { return monkey; }

    const job = monkeys[monkey];
    if (Number.isInteger(job)) { return `${job}`; }

    const { monkey1, monkey2, operation } = job as OperationJob;
    if (monkey === "root") {
        return `${deriveJob(monkey1, monkeys)} = ${deriveJob(monkey2, monkeys)}`;
    }
    return `${operation} ${deriveJob(monkey1, monkeys)} ${deriveJob(monkey2, monkeys)}`;
}

function simplifyEquality(equality: string): string | number {
    const left = equality.split(" = ")[0];
    const right = toInt(equality.split(" = ")[1]);
    if (left === "humn") { return right; }

    const tokens = left.split(" ");
    const operation = tokens[0];

    if (parseInt(tokens[1])) {
        if (operation === "/" || operation === "-") {
            return simplifyEquality(
                `${tokens.slice(2).join(" ")} = ${applyOperation(parseInt(tokens[1]), right, operation)}`
            );
        }
        return simplifyEquality(
            `${tokens.slice(2).join(" ")} = ${applyReverseOperation(right, parseInt(tokens[1]), operation)}`
        );
    } else {
        return simplifyEquality(
            `${tokens.slice(1, tokens.length - 1).join(" ")} = ${applyReverseOperation(right, parseInt(tokens[tokens.length - 1]), operation)}`
        );
    }
}

function part2(monkeys: Record<string, Job>) {
    let hasMonkeyToUpdate = true;
    while (hasMonkeyToUpdate) {
        hasMonkeyToUpdate = false;

        for (const [monkey, job] of Object.entries(monkeys)) {
            if (Number.isInteger(job)) { continue; }

            const { monkey1, monkey2, operation } = job as OperationJob;
            if (monkey1 === "humn" || monkey2 === "humn") { continue; }

            if (Number.isInteger(monkeys[monkey1]) && Number.isInteger(monkeys[monkey2!])) {
                hasMonkeyToUpdate = true;
                monkeys[monkey] = applyOperation(monkeys[monkey1] as number, monkeys[monkey2] as number, operation);
            }
        }
    }

    return simplifyEquality(deriveJob("root", monkeys));
}

function parseInput(lines: string[]): Record<string, Job> {
    const monkeys: Record<string, Job> = {};

    for (const line of lines) {
        monkeys[line.split(":")[0]] = parseJob(line.split(": ")[1])
    }

    return monkeys;

    function parseJob(job: string) {
        for (const operation of OPERATIONS) {
            if (job.includes(operation)) {
                return {
                    monkey1: job.split(` ${operation} `)[0],
                    monkey2: job.split(` ${operation} `)[1],
                    operation
                }
            }
        }

        return toInt(job);
    }
}
