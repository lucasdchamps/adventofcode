import { readFileSync } from "fs";
import { prettyPrint, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day18/input.txt", "utf8");

type Position = {
    x: number;
    y: number;
    z: number;
}

type Cube = {
    pos: Position;
    masked: number;
}

const input = parseInput(rawInput.split("\n"));
// prettyPrint(input);
console.log(part1(input));
console.log(part2(input));

function areAdjacents(pos1: Position, pos2: Position) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) + Math.abs(pos1.z - pos2.z) === 1;
}

function maskCubes(cubes: Cube[]) {
    for (let i = 0; i < cubes.length; i++) {
        const c1 = cubes[i];
        for (let j = i + 1; j < cubes.length; j++) {
            const c2 = cubes[j];
            if (areAdjacents(c1.pos, c2.pos)) {
                c1.masked += 1;
                c2.masked += 1;
            }
        }
    }
}

function part1(positions: Position[]) {
    const cubes = positions.map(pos => ({ pos, masked: 0 }));
    maskCubes(cubes);
    return cubes.map(c => 6 - c.masked).reduce((acc, v) => acc + v, 0);
}

function computeEmptyPositions(cubes: Position[]): Position[] {
    const cubesPos = new Set(cubes.map(c => JSON.stringify(c)));
    const emptyPos = [];
    for (let x = Math.min(...cubes.map(c => c.x)); x <= Math.max(...cubes.map(c => c.x)); x++) {
        for (let y = Math.min(...cubes.map(c => c.y)); y <= Math.max(...cubes.map(c => c.y)); y++) {
            for (let z = Math.min(...cubes.map(c => c.z)); z <= Math.max(...cubes.map(c => c.z)); z++) {
                if (! cubesPos.has(JSON.stringify({ x, y, z }))) {
                    emptyPos.push({ x, y, z });
                }
            }
        }
    }
    return emptyPos;
}

function groupEmptyPositions(emptyPositions: Position[]) {
    let groupIndex = 1;
    const seen = new Set<string>();
    const groupToEmptyPositions: Record<number, Set<string>> = {};

    for (const pos of emptyPositions) {
        if (seen.has(JSON.stringify(pos))) { continue; }
        groupToEmptyPositions[groupIndex] = new Set();
        groupToEmptyPositions[groupIndex].add(JSON.stringify(pos));
        seen.add(JSON.stringify(pos));

        let toGroup = emptyPositions.filter(p => areAdjacents(p, pos));
        while (toGroup.length) {
            const pos2 = toGroup.pop()!;
            if (seen.has(JSON.stringify(pos2))) { continue; }

            groupToEmptyPositions[groupIndex].add(JSON.stringify(pos2));
            seen.add(JSON.stringify(pos2));
            toGroup = toGroup.concat(emptyPositions.filter(p => areAdjacents(p, pos2)));
        }

        groupIndex += 1;
    }

    return groupToEmptyPositions;
}

function computeAdjacentPositions({ x, y, z }: Position) {
    return [
        { x: x - 1, y, z },
        { x: x + 1, y, z },
        { x, y: y - 1, z },
        { x, y: y + 1, z },
        { x, y, z: z - 1 },
        { x, y, z: z + 1 }
    ];
}

function part2(positions: Position[]) {
    const cubes = positions.map(pos => ({ pos, masked: 0 }));
    maskCubes(cubes);

    const groupToEmptyPositions = groupEmptyPositions(computeEmptyPositions(cubes.map(c => c.pos)));

    const cubesPos: Record<string, Cube> = {};
    for (const cube of cubes) {
        cubesPos[JSON.stringify(cube.pos)] = cube;
    }

    Object.values(groupToEmptyPositions).forEach((emptyPositions) => {
        const adjacentCubes: Cube[] = [];

        for (const emptyPos of [...emptyPositions]) {
            const adjacents = computeAdjacentPositions(JSON.parse(emptyPos)).map(a => JSON.stringify(a));
            if (adjacents.find(adj => ! emptyPositions.has(adj) && ! cubesPos[adj])) {
                return;
            }

            for (const adj of adjacents) {
                if (cubesPos[adj]) { adjacentCubes.push(cubesPos[adj]); }
            }
        }

        for (const adjCube of adjacentCubes) {
            adjCube.masked += 1;
        }
    });

    return cubes.map(c => 6 - c.masked).reduce((acc, v) => acc + v, 0);
}

function parseInput(lines: string[]): Position[] {
    const result = [];

    for (const line of lines) {
        result.push({
            x: toInt(line.split(",")[0]),
            y: toInt(line.split(",")[1]),
            z: toInt(line.split(",")[2])
        });
    }

    return result;
}
