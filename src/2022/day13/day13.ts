import { readFileSync } from "fs";
import { prettyPrint, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day13/input.txt", "utf8");

type Packet = number | Packet[];

type Pair = {
    left: Packet;
    right: Packet;
};

const input = parseInput(rawInput.split("\n"));
prettyPrint(input);
console.log(part1(input));
console.log(part2(input));

function part1(pairs: Pair[]) {
    const rightOrderIndices = [];

    for (let i = 0; i < pairs.length; i++) {
        if (getOrder(pairs[i].left, pairs[i].right) === -1) {
            rightOrderIndices.push(i + 1);
        }
    }

    return rightOrderIndices.reduce((acc, val) => acc + val, 0);
}

function getOrder(leftPacket: Packet, rightPacket: Packet): number {
    if (Number.isInteger(leftPacket) && Number.isInteger(rightPacket)) {
        if (leftPacket < rightPacket) { return -1; }
        if (leftPacket > rightPacket) { return 1; }
        return 0;
    }
    if (Number.isInteger(leftPacket)) {
        return getOrder([leftPacket], rightPacket);
    }
    if (Number.isInteger(rightPacket)) {
        return getOrder(leftPacket, [rightPacket]);
    }

    const left: Packet[] = leftPacket as Packet[];
    const right: Packet[] = rightPacket as Packet[];
    let i = 0;
    while (i < left.length) {
        if(i >= right.length) {
            return 1;
        }
        const res = getOrder(left[i], right[i]);
        if (res !== 0) { return res; }
        i += 1;
    }
    if (i < right.length) {
        return -1;
    }

    return 0;
}

function part2(pairs: Pair[]) {
    const packets = [];
    pairs.forEach(pair => {
        const order = getOrder(pair.left, pair.right);
        if (order === -1) {
            packets.push(pair.left);
            packets.push(pair.right);
        } else {
            packets.push(pair.right);
            packets.push(pair.left);
        }
    });
    packets.push([[2]]);
    packets.push([[6]]);

    packets.sort((p1, p2) => getOrder(p1, p2));

    const twoIndex = packets.findIndex(p => getOrder(p, [[2]]) === 0);
    const sixIndex = packets.findIndex(p => getOrder(p, [[6]]) === 0);
    return (twoIndex+ 1) * (sixIndex + 1);
}

function parseInput(lines: string[]): Pair[] {
    const result = [];

    let i = 0;
     while (i < lines.length) {
         const { packet: left } = parseLine(lines[i]);
         const { packet: right } = parseLine(lines[i + 1])
        result.push({ left, right });
        i += 3;
    }

    return result;

     function parseLine(line: string) {
         const packet: Packet = [];

         const tokens = line.split("");
         let j = 1;
         while (j < tokens.length) {
             const token = tokens[j];
             if (token === ",") {
                 j += 1;
             } else if (token === "]") {
                return { packet, length: j + 1 };
             } else if (token === "[") {
                 const { packet: subPacket, length } = parseLine(tokens.slice(j, tokens.length).join(""));
                 packet.push(subPacket);
                 j += length;
             } else {
                 if (token == "1" && tokens[j + 1] === "0") {
                     packet.push(10);
                     j += 2;
                 } else {
                     packet.push(toInt(token));
                     j += 1;
                 }
             }
         }

         return { packet, length: tokens.length };
     }
}
