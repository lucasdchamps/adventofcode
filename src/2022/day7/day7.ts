import { readFileSync } from "fs";
import { toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day7/input.txt", "utf8");

class File {
    name: string
    parent: Directory;
    size: number;

    constructor(name: string, parent: Directory, size: number) {
        this.name = name;
        this.size = size;
        this.parent = parent;
    }

    log() {
        return `- ${this.name} (file, size=${this.size})`;
    }

    getChildren() {
        return null;
    }

    getSize() {
        return this.size;
    }
}

class Directory {
    name: string
    parent: Directory | null;
    children: (Directory | File)[];
    size: number;

    constructor(name: string, parent: Directory | null) {
        this.name = name;
        this.parent = parent;
        this.children = [];
    }

    log() {
        const logLines = [`- ${this.name} (dir)`];
        for (const child of this.children) {
            logLines.push(child.log().split("\n").map(l => "  " + l).join("\n"));
        }
        return logLines.join("\n");
    }

    getChildren() {
        return this.children;
    }

    getSize() {
        if (this.size !== undefined) { return this.size; }

        this.size = this.children.map(child => child.getSize()).reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
        );
        return this.size;
    }
}

const input = parseInput(rawInput.split("\n"));
console.log(input.log());
console.log(part1(input));
console.log(part2(input));

function part1(fileSystem: Directory) {
    let total = 0;
    let toVisit: (File | Directory)[] = [fileSystem];

    while(toVisit.length > 0) {
        const node = toVisit.pop()!;
        if (! node.getChildren()) {
            continue;
        }

        if (node.getSize() < 100000) {
            total += node.getSize();
        }
        toVisit = [...toVisit, ...node.getChildren()!];
    }

    return total;
}

function part2(fileSystem: Directory) {
    const totalSpace = 70000000;
    const usedSpace = fileSystem.getSize();
    const unusedSpace = totalSpace - usedSpace;
    const spaceToFree = 30000000 - unusedSpace;
    const possibleDirectories: Directory[] = [];

    let toVisit: (File | Directory)[] = [fileSystem];
    while(toVisit.length > 0) {
        const node = toVisit.pop()!;
        if (! node.getChildren()) {
            continue;
        }

        if (node.getSize() > spaceToFree) {
            possibleDirectories.push(node as Directory);
        }
        toVisit = [...toVisit, ...node.getChildren()!];
    }

    possibleDirectories.sort((d1, d2) => d1.getSize() - d2.getSize());
    return possibleDirectories[0].getSize();
}

function parseInput(lines: string[]) {
    const fileSystem = new Directory("/", null);
    let currentDir = fileSystem;

    for (const line of lines.slice(1)) {
        if (line.startsWith("$ ls")) {
            continue;
        }
        if (line.startsWith("$ cd ..")) {
            currentDir = currentDir.parent!;
            continue;
        }
        if (line.startsWith("$ cd")) {
            const name = line.split(" ")[2];
            currentDir = currentDir.children.find(child => child.name === name) as Directory;
            continue;
        }
        if (line.startsWith("dir")) {
            const name = line.split(" ")[1];
            currentDir.children.push(new Directory(name, currentDir));
            continue;
        }
        const size = toInt(line.split(" ")[0])
        const name = line.split(" ")[1];
        currentDir.children.push(new File(name, currentDir, size));
    }

    return fileSystem;
}
